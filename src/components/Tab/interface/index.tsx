import { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  hasError?: boolean;
  disabled?: boolean;
}

export interface TabsContextType {
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  registerTab: (id: string, disabled: boolean) => void;
}

export interface TabsProps {
  children: ReactNode;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  ariaLabel?: string;
  mode?: "new" | "edit";
  scrollOnChange?: boolean; // New prop to optionally disable auto-scrolling
  variant?: "settings" | "profile"; // New variant prop for different tab styles
}

export interface TabListProps {
  children: ReactNode;
  className?: string;
  variant?: "settings" | "profile"; // Variant prop for TabList
}

// Individual Tab component
export interface TabListItemProps {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
  icon?: ReactNode; // Add icon support for profile variant
}

export interface TabPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
}
