"use client";
import { useState } from "react";

export const FloatingLabelInput: React.FC<{
  id: string;
  name: string;
  type?: "text" | "email" | "password" | "number";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="form-field">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`form-input ${className}`}
        required={required}
        disabled={disabled}
        placeholder=" " // add space for the floating label effect
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <label
        htmlFor={id}
        className={`form-label ${isFocused || value ? "active" : ""}`}
      >
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
    </div>
  );
};
