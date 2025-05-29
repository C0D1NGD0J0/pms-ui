"use client";

import React from "react";

interface FormLabelProps {
  htmlFor: string;
  label: string;
  className?: string;
  children?: React.ReactNode;
  required?: boolean;
  style?: React.CSSProperties;
  hideLabel?: boolean; // For visually hiding but keeping accessible
}

/**
 * FormLabel component - Accessible label for form inputs
 */
export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  className = "",
  children,
  label,
  style = {},
  required = false,
  hideLabel = false,
}) => {
  const labelClasses = ["form-label", hideLabel ? "sr-only" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <label htmlFor={htmlFor} className={labelClasses} style={style}>
      {label ? label : children}
      {required && (
        <span className="text-danger" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>
  );
};
