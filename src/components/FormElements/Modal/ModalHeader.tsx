"use client";
import React from "react";

import { Button } from "../Button";
import { ModalHeaderProps } from "./interface";

export function ModalHeader({
  title,
  onClose,
  className = "",
}: ModalHeaderProps) {
  return (
    <div className={`modal-header ${className}`}>
      {title && <h2 className="modal-title">{title}</h2>}
      {onClose && (
        <Button
          label=""
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="modal-close"
          icon={<i className="bx bx-x"></i>}
        />
      )}
    </div>
  );
}
