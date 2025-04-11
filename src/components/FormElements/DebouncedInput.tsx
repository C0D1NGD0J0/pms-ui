"use client";

import { useDebounce } from "@hooks/useDebounce";
import React, {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from "react";

import { FormInput } from "./FormInput";

interface ValidationResult {
  isValid: boolean;
  message?: string;
  data?: any;
}

interface DebouncedInputProps {
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
  onValidationComplete?: (result: ValidationResult) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  debounceDelay?: number;
  validateFn?: (value: string | number) => Promise<ValidationResult>;
  autoComplete?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(
  (
    {
      id,
      name,
      type = "text",
      value,
      onChange,
      onBlur,
      onValidationComplete,
      placeholder = " ",
      className = "",
      required = false,
      disabled = false,
      readOnly = false,
      debounceDelay = 500,
      validateFn,
      autoComplete,
      ariaLabel,
      ariaDescribedBy,
      ...rest
    },
    forwardedRef
  ) => {
    // Create a local ref that we will sync with the forwarded ref
    const localRef = useRef<HTMLInputElement>(null);

    // Sync the forwarded ref with our local ref
    useEffect(() => {
      if (!forwardedRef) return;

      if (typeof forwardedRef === "function") {
        forwardedRef(localRef.current);
      } else {
        forwardedRef.current = localRef.current;
      }
    }, [forwardedRef]);
    const [isValidating, setIsValidating] = useState(false);
    const [validationResult, setValidationResult] =
      useState<ValidationResult | null>(null);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
      undefined
    );

    // Track if component is mounted to prevent state updates after unmount
    const isMountedRef = React.useRef(true);

    // Track if the input was focused before validation started
    const wasFocusedBeforeValidation = React.useRef(false);

    // Use the useDebounce hook to debounce the input value
    const debouncedValue = useDebounce(value, debounceDelay);

    // Store previous debounced value to prevent duplicate validations
    const prevDebouncedValueRef = React.useRef(debouncedValue);

    // Run validation when the debounced value changes
    useEffect(() => {
      // Return early if the value hasn't actually changed to prevent unnecessary validations
      if (prevDebouncedValueRef.current === debouncedValue) {
        return;
      }

      prevDebouncedValueRef.current = debouncedValue;

      const validateInput = async () => {
        // Skip validation if no validation function or empty value
        if (
          !validateFn ||
          (typeof debouncedValue === "string" && !debouncedValue.trim())
        ) {
          if (isMountedRef.current) {
            setIsValidating(false);
          }
          return;
        }

        if (isMountedRef.current) {
          // Check if the input has focus before starting validation
          wasFocusedBeforeValidation.current =
            document.activeElement === localRef.current;

          setIsValidating(true);
        }
        try {
          const result = await validateFn(debouncedValue);
          if (isMountedRef.current) {
            setValidationResult(result);
            setHasError(!result.isValid);
            setErrorMessage(result.message);

            if (onValidationComplete) {
              onValidationComplete(result);
            }
          }
        } catch (error) {
          console.error("Validation error:", error);
          if (isMountedRef.current) {
            setHasError(true);
            setErrorMessage("Validation failed");

            if (onValidationComplete) {
              onValidationComplete({
                isValid: false,
                message: "Validation failed",
              });
            }
          }
        } finally {
          if (isMountedRef.current) {
            setIsValidating(false);

            // Restore focus if the input had focus before validation
            if (wasFocusedBeforeValidation.current && localRef.current) {
              // Use a short timeout to ensure the DOM has settled
              setTimeout(() => {
                if (localRef.current) {
                  localRef.current.focus();
                }
              }, 0);
            }
          }
        }
      };

      // Only validate if there's a value to validate
      if (
        debouncedValue ||
        (typeof debouncedValue === "string" && debouncedValue.trim())
      ) {
        validateInput();
      }
    }, [debouncedValue, validateFn, onValidationComplete]);

    // Clean up effect to prevent memory leaks and updates after unmount
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    // Composite className that includes validation status
    const compositeClassName = [
      className,
      isValidating ? "is-validating" : "",
      validationResult?.isValid ? "is-valid" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="debounced-input-wrapper">
        <FormInput
          ref={localRef}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={compositeClassName}
          required={required}
          disabled={disabled || isValidating}
          readOnly={readOnly}
          hasError={hasError}
          autoComplete={autoComplete}
          ariaLabel={ariaLabel}
          ariaDescribedBy={ariaDescribedBy}
          {...rest}
        />

        {isValidating && (
          <div className="validation-indicator">
            <span className="spinner"></span>
          </div>
        )}
      </div>
    );
  }
);

DebouncedInput.displayName = "DebouncedInput";
