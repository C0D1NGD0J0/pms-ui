"use client";

import React from "react";

interface FormLabelProps {
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
  required?: boolean;
  hideLabel?: boolean; // For visually hiding but keeping accessible
}

/**
 * FormLabel component - Accessible label for form inputs
 */
export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  className = "",
  children,
  required = false,
  hideLabel = false,
}) => {
  const labelClasses = ["form-label", hideLabel ? "sr-only" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <label htmlFor={htmlFor} className={labelClasses}>
      {children}
      {required && (
        <span className="text-danger" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
};
