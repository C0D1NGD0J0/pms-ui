"use client";
import React from "react";

import { ModalFooterProps } from "./interface";

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return <div className={`modal-footer ${className}`}>{children}</div>;
}
