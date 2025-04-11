"use client";
import Link from "next/link";
import { useTheme } from "@theme/index";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthActions, useAuth } from "@store/hooks";

export const Sidebar = () => {
  const { logout } = useAuthActions();
  const { isLoggedIn } = useAuth();
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  // Reference to the sidebar component
  const sidebarRef = React.useRef<HTMLElement>(null);

  // Update main element class and save state to localStorage
  const updateMainElementClass = (collapsed: boolean) => {
    // Find the main element that is a parent of the sidebar
    if (sidebarRef.current) {
      const mainElement = sidebarRef.current.closest(".main");
      if (mainElement) {
        if (collapsed) {
          mainElement.classList.add("sidebar-collapsed");
        } else {
          mainElement.classList.remove("sidebar-collapsed");
        }
      }
    }
  };

  // Initialize sidebar state from localStorage and update main element class
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    const isCollapsed = savedState === "true";

    if (savedState !== null) {
      setIsSidebarCollapsed(isCollapsed);
      // Apply initial class
      setTimeout(() => updateMainElementClass(isCollapsed), 0);
    }
  }, []);

  // Toggle sidebar state
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
    updateMainElementClass(newState);
  };

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
        if (isLoggedIn) {
          logout();
        }
      },
    },
  ];

  const toggleUsersDropdown = (e: React.MouseEvent) => {
    e.preventDefault();

    // If sidebar is collapsed, first expand it, then open dropdown
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      localStorage.setItem("sidebarCollapsed", "false");
      // Set a small timeout to allow the sidebar to expand before opening dropdown
      setTimeout(() => {
        setIsUsersDropdownOpen(true);
      }, 150);
    } else {
      setIsUsersDropdownOpen(!isUsersDropdownOpen);
    }
  };

  const isActive = (path: string) => pathname === path;

  // Close dropdown when sidebar is collapsed
  useEffect(() => {
    if (isSidebarCollapsed && isUsersDropdownOpen) {
      setIsUsersDropdownOpen(false);
    }
  }, [isSidebarCollapsed, isUsersDropdownOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${isSidebarCollapsed ? "close" : ""}`}
    >
      <div
        className="sidebar-toggle"
        onClick={toggleSidebar}
        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <i
          className={`bx ${
            isSidebarCollapsed ? "bx-chevron-right" : "bx-chevron-left"
          }`}
        ></i>
      </div>
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
          <i
            className={`bx bx-moon moon ${theme === "dark" ? "hidden" : ""}`}
          ></i>
          <i
            className={`bx bx-sun sun ${theme === "light" ? "hidden" : ""}`}
          ></i>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            id="theme-toggle"
            className="toggle-checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span className="switch"></span>
        </label>
      </div>
    </aside>
  );
};
