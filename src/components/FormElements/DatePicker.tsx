"use client";
import dayjs from "dayjs";
import React from "react";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { DatePicker as AntDatePicker, DatePickerProps } from "antd";

dayjs.extend(isSameOrBefore);

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
  position?: "topRight" | "bottomLeft";
  disablePastDates?: boolean;
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
  disablePastDates = false,
  position = "bottomLeft",
  ...restProps
}) => {
  const handleChange: DatePickerProps["onChange"] = (date, dateString) => {
    const dateValue = Array.isArray(dateString) ? dateString[0] : dateString;
    onChange(dateValue || "", name);
  };

  const disabledDate = disablePastDates
    ? (current: dayjs.Dayjs) => {
        if (!current) return false;
        // Get today at start of day (00:00:00)
        const today = dayjs().startOf("day");
        // Disable if date is before today
        return current.endOf("day").isBefore(today);
      }
    : undefined;

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
      disabledDate={disabledDate}
      placement={position}
      getPopupContainer={(trigger) => trigger.parentElement || document.body}
      {...restProps}
    />
  );
};
