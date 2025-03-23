"use client";
import React, { ReactNode } from "react";

interface FormFieldProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  inline?: boolean;
  hasError?: boolean;
  error?: { msg: string; touched: boolean };
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  className = "",
  fullWidth = false,
  inline = false,
  hasError = false,
  error,
}) => {
  const baseClass = "form-field";

  const fieldClasses = [
    baseClass,
    inline ? "form-field_inline" : "",
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldClasses}>
      {children}
      {hasError && error?.touched && error?.msg ? (
        <small className="form-field-error">
          <i>{error.msg}</i>
        </small>
      ) : null}
    </div>
  );
};
