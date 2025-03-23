"use client";
import React, { ChangeEvent, forwardRef } from "react";

interface FormCheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  (
    {
      id,
      name,
      checked,
      onChange,
      label,
      className = "",
      disabled = false,
      required = false,
      ariaLabel,
      description,
    },
    ref
  ) => {
    const checkboxClasses = [
      "form-field_checkbox",
      disabled ? "input-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="checkbox-wrapper">
        <input
          ref={ref}
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={checkboxClasses}
          disabled={disabled}
          required={required}
          aria-label={ariaLabel}
          aria-required={required}
        />
        {label && (
          <div className="checkbox-label-wrapper">
            <label htmlFor={id} className="checkbox-label">
              {label}
              {required && (
                <span className="text-danger" aria-hidden="true">
                  {" "}
                  *
                </span>
              )}
            </label>
            {description && <small>{description}</small>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "FormCheckbox";
