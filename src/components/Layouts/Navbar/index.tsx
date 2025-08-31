"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAuthActions, useAuth } from "@store/auth.store";
interface MenuItem {
  icon: string;
  label: string;
  href: string;
  authRequired?: boolean;
}

export const Navbar: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { logout } = useAuthActions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

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
    { icon: "bx-bell", label: "", href: "/notifications", authRequired: true },
    { icon: "bx-envelope", label: "", href: "/messages", authRequired: true },
  ];

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
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
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
