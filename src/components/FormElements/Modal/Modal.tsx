"use client";
import { createPortal } from "react-dom";
import React, { useEffect, useRef } from "react";

import { ModalProps } from "./interface";
import { ModalHeader } from "./ModalHeader";
import { ModalFooter } from "./ModalFooter";
import { ModalContent } from "./ModalContent";

export function Modal({
  isOpen,
  onClose,
  size = "medium",
  children,
  className = "",
  destroyOnHidden = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const mountKeyRef = useRef(0);
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
      // Increment mount key when modal opens and destroyOnHidden is true
      if (destroyOnHidden) {
        mountKeyRef.current += 1;
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, destroyOnHidden]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // If modal is not open, return null (unmount completely)
  if (!isOpen) return null;

  const sizeClass =
    size === "small" ? "modal-sm" : size === "large" ? "modal-lg" : "modal-md";

  // When destroyOnHidden is true, use a key based on mount count to force remount
  const childrenToRender = destroyOnHidden ? (
    <React.Fragment key={mountKeyRef.current}>{children}</React.Fragment>
  ) : (
    children
  );

  const modalContent = (
    <div className="modal-backdrop" onClick={handleOutsideClick}>
      <div
        ref={modalRef}
        className={`modal ${sizeClass} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {childrenToRender}
      </div>
    </div>
  );

  if (typeof window === "undefined") {
    return null;
  }

  try {
    return createPortal(modalContent, document.body);
  } catch (error) {
    console.error("Error creating portal:", error);
    return modalContent;
  }
}

Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
