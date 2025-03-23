"use client";
import React, { ChangeEvent, forwardRef } from "react";

interface FormRadioProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
}

export const FormRadio = forwardRef<HTMLInputElement, FormRadioProps>(
  (
    {
      id,
      name,
      value,
      checked,
      onChange,
      label,
      className = "",
      disabled = false,
      required = false,
      ariaLabel,
    },
    ref
  ) => {
    const radioClasses = [disabled ? "input-disabled" : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="radio-option">
        <input
          ref={ref}
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          className={radioClasses}
          disabled={disabled}
          required={required}
          aria-label={ariaLabel}
        />
        {label && <label htmlFor={id}>{label}</label>}
      </div>
    );
  }
);

FormRadio.displayName = "FormRadio";
