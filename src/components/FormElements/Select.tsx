"use client";
import React, { ChangeEvent, FocusEvent, useState, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  id: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const Select = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      id,
      name,
      options,
      value,
      onChange,
      onBlur,
      className = "",
      placeholder = "Select an option",
      required = false,
      disabled = false,
      ariaLabel,
      ariaDescribedBy,
    },
    ref
  ) => {
    const [isTouched, setIsTouched] = useState(false);

    const handleBlur = (e: FocusEvent<HTMLSelectElement>) => {
      setIsTouched(true);
      if (onBlur) onBlur(e);
    };

    const selectClasses = [
      "form-input",
      isTouched ? "touched" : "untouched",
      disabled ? "input-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <select
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={selectClasses}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-required={required}
        aria-invalid={isTouched && required && !value}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "FormSelect";
