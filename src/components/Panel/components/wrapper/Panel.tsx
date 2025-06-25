import React, { ChangeEvent, ReactNode } from "react";

interface PanelProps {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "alt-2";
  headerTitleComponent?: ReactNode;
  header?: {
    title?: string | ReactNode;
  };
  searchOpts?: {
    value: string;
    placeholder?: string;
    onSearchChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  } | null;
  filterOpts?: {
    options: { label: string; value: string }[];
    onFilterChange: (value: string) => void;
  } | null;
}

export const Panel: React.FC<PanelProps> = ({ 
  children, 
  className = "",
  variant = "default"
}) => {
  const panelClass = `panel ${variant === "alt-2" ? "panel-alt-2" : ""} ${className}`.trim();
  return <div className={panelClass}>{children}</div>;
};
