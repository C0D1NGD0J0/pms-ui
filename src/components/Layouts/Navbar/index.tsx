"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@src/components/FormElements";
import { useAuthActions, useAuth } from "@store/auth.store";
import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  useSSENotificationActions,
  useSSENotifications,
} from "@src/store/sseNotification.store";

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

  const { notifications, announcements, isConnected, isConnecting, hasError } =
    useSSENotifications();

  const { initializeConnection, markAsRead, reconnect, disconnectStreams } =
    useSSENotificationActions();

  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cuid = user?.client?.cuid;

  useEffect(() => {
    if (cuid && isLoggedIn) {
      initializeConnection(cuid);
    } else if (!isLoggedIn) {
      disconnectStreams();
    }
  }, [cuid, isLoggedIn, initializeConnection, disconnectStreams]);

  const handleMarkAsRead = useCallback(
    (nuid: string) => {
      if (cuid) {
        markAsRead(cuid, nuid);
      }
    },
    [cuid, markAsRead]
  );

  const handleReconnect = useCallback(() => {
    if (cuid) {
      reconnect(cuid);
    }
  }, [cuid, reconnect]);

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

  const handleUserDropdownMouseEnter = useCallback(() => {
    if (userDropdownTimeoutRef.current) {
      clearTimeout(userDropdownTimeoutRef.current);
    }
    userDropdownTimeoutRef.current = setTimeout(() => {
      setIsUserDropdownOpen(true);
    }, 200);
  }, []);

  const handleUserDropdownMouseLeave = useCallback(() => {
    if (userDropdownTimeoutRef.current) {
      clearTimeout(userDropdownTimeoutRef.current);
    }
    userDropdownTimeoutRef.current = setTimeout(() => {
      setIsUserDropdownOpen(false);
    }, 300);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserDropdownOpen(false);
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
              <span className="item-icon">
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
            <span className="item-icon">
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
                markAsRead={handleMarkAsRead}
                isConnected={isConnected}
                isConnecting={isConnecting}
                hasError={hasError}
                reconnect={handleReconnect}
              />
            </div>
          </li>
        )}

        {isLoggedIn && (
          <li
            className="navbar-menu__item user-avatar"
            onMouseEnter={handleUserDropdownMouseEnter}
            onMouseLeave={handleUserDropdownMouseLeave}
          >
            <span className="item-icon">
              <Image
                src={user?.avatarUrl || "/default-avatar.png"}
                alt="User Avatar"
                width={32}
                height={32}
                className="user-avatar__image"
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </span>
            <ul
              className={`navbar__dropdown-menu ${
                isUserDropdownOpen ? "show" : ""
              }`}
              onMouseEnter={handleUserDropdownMouseEnter}
              onMouseLeave={handleUserDropdownMouseLeave}
            >
              <li>
                <Link href={`/profile/${user?.uid}`}>
                  <i className="bx bx-user"></i>
                  Profile
                </Link>
              </li>
              <li>
                <Button
                  label="Logout"
                  className="btn-danger"
                  onClick={async () => {
                    await logout();
                    console.log("User logged out");
                    sessionStorage.removeItem("static-data-storage");
                    sessionStorage.removeItem("auth-storage");
                  }}
                />
              </li>
            </ul>
          </li>
        )}
      </ul>

      <div className="menuToggle" onClick={toggleMobileMenu}>
        <span className="mobile-menu__icon">
          <i className="bx bx-menu"></i>
        </span>
      </div>
    </nav>
  );
};
