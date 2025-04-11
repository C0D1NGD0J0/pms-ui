import React, { ChangeEvent, ReactNode } from "react";

interface PanelProps {
  children?: ReactNode;
  className?: string;
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

export const PanelsWrapper: React.FC<PanelProps> = ({
  children,
  className = "",
}) => {
  return <div className={`panels ${className}`}>{children}</div>;
};
