"use client";
import Link from "next/link";
import { useTheme } from "@theme/index";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMenuItems } from "@hooks/useMenuItems";
import { useAuthActions, useAuth } from "@store/auth.store";

export const Sidebar = () => {
  const { logout } = useAuthActions();
  const { isLoggedIn } = useAuth();
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { menuSections, getResolvedPath } = useMenuItems();
  const sidebarRef = React.useRef<HTMLElement>(null);
  const pathname = usePathname();

  const updateMainElementClass = (collapsed: boolean) => {
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

  // Get menu sections from the hook
  const mainMenuSection = menuSections.find(
    (section) => section.type === "main"
  );
  const dropdownSection = menuSections.find(
    (section) => section.type === "dropdown"
  );
  const bottomMenuSection = menuSections.find(
    (section) => section.type === "bottom"
  );

  const bottomMenuItems = [
    ...(bottomMenuSection?.items || []),
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
      updateMainElementClass(false);
      // Set a small timeout to allow the sidebar to expand before opening dropdown
      setTimeout(() => {
        setIsUsersDropdownOpen(true);
      }, 150);
    } else {
      setIsUsersDropdownOpen(!isUsersDropdownOpen);
    }
  };

  const isActive = (path: string | ((user: any) => string)) => {
    const resolvedPath = getResolvedPath(path);
    return pathname === resolvedPath;
  };

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
        {mainMenuSection?.items.map((item) => {
          const resolvedPath = getResolvedPath(item.path);
          return (
            <li
              key={typeof item.path === "string" ? item.path : item.label}
              className={`sidebar__navbar-item ${
                isActive(item.path) ? "active" : ""
              }`}
            >
              <span>
                <i className={`${item.icon} icon`}></i>
              </span>
              <Link href={resolvedPath}>{item.label}</Link>
            </li>
          );
        })}

        {dropdownSection && dropdownSection.items.length > 0 && (
          <li
            className={`sidebar__navbar-item sidebar__dropdown ${
              isUsersDropdownOpen ? "open-dd" : ""
            }`}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>
                <i className={`${dropdownSection.icon} icon`}></i>
              </span>
              <a
                href="#!"
                className="dropdown-toggle"
                onClick={toggleUsersDropdown}
              >
                {dropdownSection.title}
                <i
                  className={`bx bx-chevron-down dropdown-icon ${
                    isUsersDropdownOpen ? "rotate-180" : ""
                  }`}
                ></i>
              </a>
            </div>
            <ul className="sidebar__dropdown-menu">
              {dropdownSection.items.map((item) => {
                const resolvedPath = getResolvedPath(item.path);
                return (
                  <li
                    key={typeof item.path === "string" ? item.path : item.label}
                    className={`sidebar__dropdown-item ${
                      isActive(item.path) ? "active" : ""
                    }`}
                  >
                    <span>
                      <i className={`${item.icon} icon`}></i>
                    </span>
                    <Link href={resolvedPath}>{item.label}</Link>
                  </li>
                );
              })}
            </ul>
          </li>
        )}

        {/* Bottom Menu Items */}
        {bottomMenuItems.map((item) => {
          const resolvedPath = getResolvedPath(item.path);
          return (
            <li
              key={typeof item.path === "string" ? item.path : item.label}
              className={`sidebar__navbar-item ${
                isActive(item.path) ? "active" : ""
              }`}
            >
              <span>
                <i className={`${item.icon} icon`}></i>
              </span>
              {item.onClick ? (
                <a href={resolvedPath} onClick={item.onClick}>
                  {item.label}
                </a>
              ) : (
                <Link href={resolvedPath}>{item.label}</Link>
              )}
            </li>
          );
        })}
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
