"use client";
import Link from "next/link";
import React, { useState } from "react";

interface MenuItem {
  icon: string;
  label: string;
  href: string;
  authRequired?: boolean;
}

export const Navbar: React.FC = () => {
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
    { icon: "bx-bell", label: "", href: "/notifications", authRequired: false },
    { icon: "bx-envelope", label: "", href: "/messages", authRequired: false },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
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
          // Skip auth-required items if no user
          // if (item.authRequired && !user) return null;

          // Skip non-auth items if user is logged in
          // if (!item.authRequired && (item.label === 'Login' || item.label === 'Signup')) return null;

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
          onClick={toggleUserDropdown}
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
              <Link href="/logout">Logout</Link>
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
