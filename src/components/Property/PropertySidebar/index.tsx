import React from "react";

export interface PropertySidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function PropertySidebar({
  children,
  className = "",
}: PropertySidebarProps) {
  return <aside className={`property-sidebar ${className}`}>{children}</aside>;
}
