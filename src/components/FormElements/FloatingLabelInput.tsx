"use client";
import { useState } from "react";

export const FloatingLabelInput: React.FC<{
  id: string;
  name: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  hasError?: boolean;
}> = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  label,
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
  hasError = false,
}) => {
  const hasContent = value !== undefined && value !== "";
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="form-field">
      <label
        htmlFor={id}
        className={`form-label ${label ? "" : "no-label"} ${
          isFocused || hasContent ? "active" : ""
        }`}
      >
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`form-input ${
          hasError ? "touched-invalid" : ""
        } ${className} `}
        required={required}
        disabled={disabled}
        placeholder={placeholder || " "} // add space for the floating label effect
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value.length > 0)}
      />
    </div>
  );
};
