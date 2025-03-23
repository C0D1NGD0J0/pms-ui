"use client";
import React, { ChangeEvent, forwardRef, FocusEvent,useState } from "react";

interface FormTextareaProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  maxLength?: number;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      placeholder = "",
      className = "",
      required = false,
      disabled = false,
      readOnly = false,
      rows = 4,
      maxLength,
      ariaLabel,
      ariaDescribedBy,
    },
    ref
  ) => {
    const [isTouched, setIsTouched] = useState(false);

    const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
      setIsTouched(true);
      if (onBlur) onBlur(e);
    };

    const textareaClasses = [
      "form-input_textarea",
      isTouched ? "touched" : "untouched",
      disabled ? "input-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <textarea
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={textareaClasses}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        rows={rows}
        maxLength={maxLength}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-required={required}
        aria-invalid={isTouched && required && !value}
      />
    );
  }
);

Textarea.displayName = "FormTextarea";
