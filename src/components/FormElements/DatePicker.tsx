"use client";
import dayjs from "dayjs";
import React from "react";
import { DatePicker as AntDatePicker, DatePickerProps } from "antd";

interface CustomDatePickerProps {
  id: string;
  name: string;
  value?: string | null;
  onChange: (value: string, field?: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  format?: string;
}

export const DatePicker: React.FC<CustomDatePickerProps> = ({
  id,
  name,
  value,
  onChange,
  className = "",
  placeholder = "Select date",
  required = false,
  disabled = false,
  hasError = false,
  format = "YYYY-MM-DD",
  ...restProps
}) => {
  const handleChange: DatePickerProps["onChange"] = (date, dateString) => {
    const dateValue = Array.isArray(dateString) ? dateString[0] : dateString;
    onChange(dateValue || "", name);
  };

  const inputClasses = [
    "form-input",
    hasError ? "touched-invalid" : "",
    disabled ? "input-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AntDatePicker
      id={id}
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
      className={inputClasses}
      disabled={disabled}
      format={format}
      value={value ? dayjs(value) : null}
      aria-required={required}
      {...restProps}
    />
  );
};
