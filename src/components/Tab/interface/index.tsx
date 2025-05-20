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
  scrollOnChange?: boolean; // New prop to optionally disable auto-scrolling
}

export interface TabListProps {
  children: ReactNode;
  className?: string;
}

// Individual Tab component
export interface TabListItemProps {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
}

export interface TabPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
}
