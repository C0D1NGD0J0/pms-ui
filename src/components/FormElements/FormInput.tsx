"use client";
import React, { ChangeEvent, forwardRef, FocusEvent, useState } from "react";

interface FormInputProps {
  id?: string;
  name: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "search"
    | "url"
    | "date"
    | "time";
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onkeydown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  autoComplete?: string;
  maxLength?: number;
  pattern?: string;
  ariaLabel?: string;
  hasError: boolean;
  ariaDescribedBy?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      name,
      type = "text",
      value,
      onChange,
      onBlur,
      onkeydown,
      placeholder = " ",
      className = "",
      required = false,
      disabled = false,
      readOnly = false,
      min,
      max,
      step,
      autoComplete,
      maxLength,
      pattern,
      ariaLabel,
      hasError = false,
      ariaDescribedBy,
    },
    ref
  ) => {
    const [isTouched, setIsTouched] = useState(false);

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsTouched(true);
      if (onBlur) onBlur(e);
    };

    const inputClasses = [
      "form-input",
      hasError && "touched-invalid",
      disabled ? "input-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={inputClasses}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        onKeyDown={onkeydown}
        min={min}
        max={max}
        step={step}
        autoComplete={autoComplete}
        maxLength={maxLength}
        pattern={pattern}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-required={required}
        aria-invalid={isTouched && required && !value}
      />
    );
  }
);

FormInput.displayName = "FormInput";
