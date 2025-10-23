import { ReactNode } from "react";

export interface AccordionItem {
  id: string;
  label: string;
  subtitle?: string;
  content: ReactNode;
  icon?: ReactNode;
  isCompleted?: boolean;
  isDisabled?: boolean;
}

export interface AccordionContextType {
  activeId: string | null;
  setActiveId: (id: string) => void;
  completedIds: Set<string>;
  markAsCompleted: (id: string) => void;
}

export interface AccordionContainerProps {
  items: AccordionItem[];
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  showSidebar?: boolean;
  allowMultipleOpen?: boolean;
  className?: string;
  ariaLabel?: string;
}

export interface AccordionSectionProps {
  item: AccordionItem;
  isActive: boolean;
  onToggle: () => void;
}
