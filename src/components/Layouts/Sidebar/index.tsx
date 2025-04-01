"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { path: "/dashboard", icon: "bx bxs-dashboard", label: "Dashboard" },
    { path: "/properties", icon: "bx bx-building-house", label: "Properties" },
    { path: "/leases", icon: "bx bx-book-open", label: "Leases" },
    {
      path: "/service-requests",
      icon: "bx bxs-briefcase-alt",
      label: "Service Requests",
    },
  ];

  const dropdownItems = [
    { path: "/tenants", icon: "bx bx-user", label: "Tenants" },
    { path: "/vendors", icon: "bx bx-building", label: "Vendors" },
    { path: "/employees", icon: "bx bx-id-card", label: "Employees" },
  ];

  const bottomMenuItems = [
    { path: "/accounts", icon: "bx bx-cog", label: "Account" },
    { path: "/wallet", icon: "bx bx-wallet", label: "Wallet" },
    { path: "/viewings", icon: "bx bx-street-view", label: "Viewings" },
    {
      path: "#",
      icon: "bx bx-log-out",
      label: "Logout",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // add logout logic here
      },
    },
  ];

  const toggleUsersDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsUsersDropdownOpen(!isUsersDropdownOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // add thme change logic here
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="sidebar">
      <ul className="sidebar__navbar">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`sidebar__navbar-item ${
              isActive(item.path) ? "active" : ""
            }`}
          >
            <span>
              <i className={`${item.icon} icon`}></i>
            </span>
            <Link href={item.path}>{item.label}</Link>
          </li>
        ))}

        <li
          className={`sidebar__navbar-item sidebar__dropdown ${
            isUsersDropdownOpen ? "open-dd" : ""
          }`}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>
              <i className="bx bx-group icon"></i>
            </span>
            <a
              href="#!"
              className="dropdown-toggle"
              onClick={toggleUsersDropdown}
            >
              Users
              <i
                className={`bx bx-chevron-down dropdown-icon ${
                  isUsersDropdownOpen ? "rotate-180" : ""
                }`}
              ></i>
            </a>
          </div>
          <ul className="sidebar__dropdown-menu">
            {dropdownItems.map((item) => (
              <li
                key={item.path}
                className={`sidebar__dropdown-item ${
                  isActive(item.path) ? "active" : ""
                }`}
              >
                <span>
                  <i className={`${item.icon} icon`}></i>
                </span>
                <Link href={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </li>

        {bottomMenuItems.map((item) => (
          <li
            key={item.path}
            className={`sidebar__navbar-item ${
              isActive(item.path) ? "active" : ""
            }`}
          >
            <span>
              <i className={`${item.icon} icon`}></i>
            </span>
            {item.onClick ? (
              <a href={item.path} onClick={item.onClick}>
                {item.label}
              </a>
            ) : (
              <Link href={item.path}>{item.label}</Link>
            )}
          </li>
        ))}
      </ul>

      <div className="theme">
        <div className="theme__icons">
          <i className={`bx bx-moon moon ${isDarkMode ? "hidden" : ""}`}></i>
          <i className={`bx bx-sun sun ${!isDarkMode ? "hidden" : ""}`}></i>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            id="theme-toggle"
            className="toggle-checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <span className="switch"></span>
        </label>
      </div>
    </aside>
  );
};
