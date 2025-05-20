"use client";
import React from "react";

import { ModalContentProps } from "./interface";

export function ModalContent({ children, className = "" }: ModalContentProps) {
  return <div className={`modal-content ${className}`}>{children}</div>;
}
