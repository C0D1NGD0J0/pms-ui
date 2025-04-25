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
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClass =
    size === "small" ? "modal-sm" : size === "large" ? "modal-lg" : "modal-md";

  const modalContent = (
    <div className="modal-backdrop" onClick={handleOutsideClick}>
      <div
        ref={modalRef}
        className={`modal ${sizeClass} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
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
