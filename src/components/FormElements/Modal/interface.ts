import { ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: "small" | "medium" | "large";
  children: ReactNode;
  title?: string;
  className?: string;
  destroyOnHidden?: boolean;
}

export interface ModalHeaderProps {
  title?: string;
  onClose?: () => void;
  className?: string;
}

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export type ModalSize = "small" | "medium" | "large";
