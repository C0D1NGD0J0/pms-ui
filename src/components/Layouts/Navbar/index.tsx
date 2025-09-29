"use client";
import Link from "next/link";
import { useAuthActions, useAuth } from "@store/auth.store";
import React, { useCallback, useState, useRef } from "react";
import { useSSENotifications } from "@hooks/useSSENotifications";

import NotificationDropdown from "./NotificationDropdown";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  authRequired?: boolean;
}

export const Navbar: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { logout } = useAuthActions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const {
    notifications,
    announcements,
    markAsRead,
    isConnected,
    isConnecting,
    hasError,
    reconnect,
  } = useSSENotifications();

  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const menuItems: MenuItem[] = [
    {
      icon: "bx-lock-alt",
      label: "Login",
      href: "/login",
      authRequired: false,
    },
    {
      icon: "bx-user-plus",
      label: "Signup",
      href: "/register",
      authRequired: false,
    },
    { icon: "bx-envelope", label: "", href: "/messages", authRequired: true },
  ];

  const handleNotificationMouseEnter = useCallback(() => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setIsNotificationDropdownOpen(true);
    }, 200);
  }, []);

  const handleNotificationMouseLeave = useCallback(() => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setIsNotificationDropdownOpen(false);
    }, 300);
  }, []);

  const allNotifications = [...notifications, ...announcements];
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = (e: React.MouseEvent, value: boolean) => {
    e.stopPropagation();
    setIsUserDropdownOpen(value);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">LOGO</Link>
      </div>

      <div className="navbar-search">
        <input
          type="search"
          name="navbar-search-input"
          placeholder="Search here..."
          className="navbar-search__input"
        />
      </div>

      <ul className={`navbar-menu ${isMobileMenuOpen ? "mobile-active" : ""}`}>
        {menuItems.map((item, index) => {
          if (item.authRequired && !isLoggedIn) return null;

          // Skip non-auth items if user is logged in
          if (
            !item.authRequired &&
            isLoggedIn &&
            (item.label === "Login" || item.label === "Signup")
          )
            return null;

          return (
            <li key={index} className="navbar-menu__item">
              <span>
                <i className={`bx ${item.icon}`}></i>
              </span>
              <Link href={item.href}>{item.label}</Link>
            </li>
          );
        })}

        {isLoggedIn && (
          <li
            className={`navbar-menu__item navbar-notification-item ${
              unreadCount > 0 ? "has-unread" : ""
            }`}
            onMouseEnter={handleNotificationMouseEnter}
            onMouseLeave={handleNotificationMouseLeave}
          >
            <span>
              <i className="bx bx-bell"></i>
              {unreadCount > 0 && (
                <span
                  className="notification-badge"
                  aria-label={`${unreadCount} unread notifications`}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>

            <div
              className={`navbar-notification-dropdown-wrapper ${
                isNotificationDropdownOpen ? "show" : ""
              }`}
              onMouseEnter={handleNotificationMouseEnter}
              onMouseLeave={handleNotificationMouseLeave}
            >
              <NotificationDropdown
                notifications={notifications}
                announcements={announcements}
                markAsRead={markAsRead}
                isConnected={isConnected}
                isConnecting={isConnecting}
                hasError={hasError}
                reconnect={reconnect}
              />
            </div>
          </li>
        )}

        <li
          className="navbar-menu__item user-avatar"
          onClick={(e) => toggleUserDropdown(e, !isUserDropdownOpen)}
        >
          <span>
            <i className="bx bx-user"></i>
          </span>
          <ul
            className={`navbar__dropdown-menu ${
              isUserDropdownOpen ? "show" : ""
            }`}
          >
            <li>
              <Link href={`/profile/${user?.uid}`}>Profile</Link>
            </li>
            <li>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "transparent",
                  fontSize: "2rem",
                  fontWeight: "100",
                }}
                className="text-danger"
                onClick={async () => {
                  await logout();
                  console.log("User logged out");
                  sessionStorage.removeItem("static-data-storage");
                  sessionStorage.removeItem("auth-storage");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </li>
      </ul>

      <div className="menuToggle" onClick={toggleMobileMenu}>
        <span className="mobile-menu__icon">
          <i className="bx bx-menu"></i>
        </span>
      </div>
    </nav>
  );
};
