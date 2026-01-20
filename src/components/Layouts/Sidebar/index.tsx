"use client";
import Link from "next/link";
import storage from "@utils/storage";
import { useEvent } from "@hooks/event";
import { useTheme } from "@theme/index";
import { usePathname } from "next/navigation";
import { EventTypes } from "@services/events";
import React, { useEffect, useState } from "react";
import { useMenuItems } from "@hooks/useMenuItems";
import { useAuthActions, useAuth } from "@store/auth.store";

export const Sidebar = () => {
  const { logout } = useAuthActions();
  const { isLoggedIn } = useAuth();
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    const isCollapsed = storage.get<boolean>("sidebarCollapsed", "local");

    if (isCollapsed !== null) {
      setIsSidebarCollapsed(isCollapsed);
      setTimeout(() => updateMainElementClass(isCollapsed), 0);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    storage.set("sidebarCollapsed", newState, "local");
    updateMainElementClass(newState);
  };

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

    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      storage.set("sidebarCollapsed", false, "local");
      updateMainElementClass(false);
      setTimeout(() => {
        setIsUsersDropdownOpen(true);
      }, 150);
    } else {
      setIsUsersDropdownOpen(!isUsersDropdownOpen);
    }
  };

  const isActive = (path: string | ((user: any) => string)) => {
    const resolvedPath = getResolvedPath(path);
    return pathname === resolvedPath || pathname.startsWith(resolvedPath + "/");
  };

  useEffect(() => {
    if (isSidebarCollapsed && isUsersDropdownOpen) {
      setIsUsersDropdownOpen(false);
    }
  }, [isSidebarCollapsed, isUsersDropdownOpen]);

  useEffect(() => {
    setIsUsersDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEvent(EventTypes.MOBILE_MENU_TOGGLE, () => {
    setIsMobileMenuOpen((prev) => !prev);
  });

  return (
    <>
      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? "show" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside
        ref={sidebarRef}
        className={`sidebar ${isSidebarCollapsed ? "close" : ""} ${
          isMobileMenuOpen ? "mobile-open" : ""
        }`}
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
                      key={
                        typeof item.path === "string" ? item.path : item.label
                      }
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

          <li className="sidebar__navbar-item theme-item">
            <div className="theme">
              <div className="theme__icons">
                <i
                  className={`bx bx-moon moon ${
                    theme === "dark" ? "hidden" : ""
                  }`}
                ></i>
                <i
                  className={`bx bx-sun sun ${
                    theme === "light" ? "hidden" : ""
                  }`}
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
          </li>
        </ul>
      </aside>
    </>
  );
};
