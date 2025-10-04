"use client";

import { ICurrentUser } from "@interfaces/auth.interface";

import { useCurrentUser } from "./useCurrentUser";
import { useUnifiedPermissions } from "./useUnifiedPermissions";

export interface MenuItem {
  path: string | ((user: ICurrentUser | null | undefined) => string);
  icon: string;
  label: string;
  visible?: boolean | ((user: ICurrentUser | null | undefined) => boolean);
  onClick?: (e: React.MouseEvent) => void;
}

export interface MenuSection {
  items: MenuItem[];
  type: "main" | "dropdown" | "bottom";
  title?: string;
  icon?: string;
  isDropdown?: boolean;
}

export const useMenuItems = () => {
  const { user: currentUser } = useCurrentUser();
  const permissions = useUnifiedPermissions();

  const menuSections: MenuSection[] = [
    {
      type: "main",
      items: [
        {
          path: "/dashboard",
          icon: "bx bxs-dashboard",
          label: "Dashboard",
          visible: () => permissions.canAccess("dashboard"),
        },
        {
          path: "/properties",
          icon: "bx bx-building-house",
          label: "Properties",
          visible: () => permissions.canAccess("properties"),
        },
        {
          path: "/leases",
          icon: "bx bx-book-open",
          label: "Leases",
          visible: () => permissions.canAccess("leases"),
        },
        {
          path: "/service-requests",
          icon: "bx bxs-briefcase-alt",
          label: "Service Requests",
          visible: () => permissions.canAccess("service_requests"),
        },
      ],
    },
    {
      title: "Users",
      type: "dropdown",
      icon: "bx bx-group",
      isDropdown: true,
      items: [
        {
          path: `/users/${currentUser?.client.cuid}/tenants`,
          icon: "bx bx-group",
          label: "Tenants",
          visible: () => permissions.canAccess("users.tenants"),
        },
        {
          path: `/users/${currentUser?.client.cuid}/vendors`,
          icon: "bx bx-building",
          label: "Vendors",
          visible: () => permissions.canAccess("users.vendors"),
        },
        {
          path: `/users/${currentUser?.client.cuid}/staff`,
          icon: "bx bx-id-card",
          label: "Employees",
          visible: () => permissions.canAccess("users.employees"),
        },
        {
          path: `/users/${currentUser?.client.cuid}/add-users`,
          icon: "bx bx-plus",
          label: "Add Users",
          visible: () => permissions.canAccess("users.add"),
        },
      ],
    },
    {
      type: "bottom",
      items: [
        {
          path: `/client/${currentUser?.client.cuid}/account_settings`,
          icon: "bx bx-cog",
          label: "Account",
          visible: () =>
            permissions.canAccess("settings.client") &&
            !!currentUser?.client.cuid,
        },
        {
          path: `/wallet/${currentUser?.client.cuid}`,
          icon: "bx bx-wallet",
          label: "Wallet",
          visible: () => permissions.canAccess("wallet"),
        },
        {
          path: "/viewings",
          icon: "bx bx-street-view",
          label: "Viewings",
          visible: () => permissions.canAccess("viewings"),
        },
      ],
    },
  ];

  const getResolvedPath = (
    pathOrFunction: string | ((user: ICurrentUser | null | undefined) => string)
  ): string => {
    if (typeof pathOrFunction === "function") {
      return pathOrFunction(currentUser);
    }
    return pathOrFunction;
  };

  const isItemVisible = (
    visibilityRule:
      | boolean
      | ((user: ICurrentUser | null | undefined) => boolean)
      | undefined
  ): boolean => {
    if (visibilityRule === undefined) return true;
    if (typeof visibilityRule === "boolean") return visibilityRule;
    return visibilityRule(currentUser);
  };

  const getVisibleMenuItems = (section: MenuSection): MenuItem[] => {
    return section.items.filter((item) => isItemVisible(item.visible));
  };

  const getVisibleMenuSections = (): MenuSection[] => {
    return menuSections
      .map((section) => ({
        ...section,
        items: getVisibleMenuItems(section),
      }))
      .filter((section) => section.items.length > 0);
  };

  return {
    menuSections: getVisibleMenuSections(),
    getResolvedPath,
    isItemVisible,
    currentUser,
  };
};
