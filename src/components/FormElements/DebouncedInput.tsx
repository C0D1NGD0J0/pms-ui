"use client";

import { useDebounce } from "@hooks/useDebounce";
import React, {
  ChangeEvent,
  useCallback,
  FocusEvent,
  forwardRef,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";

import { FormInput } from "./FormInput";

interface ValidationResult {
  isValid: boolean;
  message?: string;
  data?: any;
}

interface ValidationState {
  isValidating: boolean;
  result: ValidationResult | null;
  hasError: boolean;
  errorMessage?: string;
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

export const DebouncedInput = React.memo(
  forwardRef<HTMLInputElement, DebouncedInputProps>(
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
      const localRef = useRef<HTMLInputElement>(null);
      const [validationState, setValidationState] = useState<ValidationState>({
        isValidating: false,
        result: null,
        hasError: false,
        errorMessage: undefined,
      });

      const isMountedRef = useRef(true);
      const hasFocusRef = useRef(false);
      const debouncedValue = useDebounce(value, debounceDelay);
      const prevDebouncedValueRef = useRef(debouncedValue);
      const performValidation = useCallback(
        async (valueToValidate: string | number) => {
          if (
            !validateFn ||
            (typeof valueToValidate === "string" && !valueToValidate.trim())
          ) {
            return null;
          }

          try {
            return await validateFn(valueToValidate);
          } catch (error) {
            console.error("Validation error:", error);
            return {
              isValid: false,
              message: "Validation failed",
            };
          }
        },
        [validateFn]
      );

      const handleValidationComplete = useCallback(
        (result: ValidationResult) => {
          if (onValidationComplete) {
            onValidationComplete(result);
          }
        },
        [onValidationComplete]
      );

      // Sync the forwarded ref with our local ref - only run when refs change
      useEffect(() => {
        if (!forwardedRef) return;

        if (typeof forwardedRef === "function") {
          forwardedRef(localRef.current);
        } else {
          forwardedRef.current = localRef.current;
        }
      }, [forwardedRef]);

      useEffect(() => {
        return () => {
          isMountedRef.current = false;
        };
      }, []);

      const updateFocusState = useCallback(() => {
        if (localRef.current) {
          hasFocusRef.current = document.activeElement === localRef.current;
        }
      }, []);

      useEffect(() => {
        const inputElement = localRef.current;
        if (!inputElement) return;

        const handleFocus = () => {
          hasFocusRef.current = true;
        };

        const handleBlur = () => {
          setTimeout(() => {
            hasFocusRef.current = document.activeElement === inputElement;
          }, 30);
        };

        inputElement.addEventListener("focus", handleFocus);
        inputElement.addEventListener("blur", handleBlur);

        return () => {
          inputElement.removeEventListener("focus", handleFocus);
          inputElement.removeEventListener("blur", handleBlur);
        };
      }, []);

      useEffect(() => {
        if (prevDebouncedValueRef.current === debouncedValue) {
          return;
        }

        prevDebouncedValueRef.current = debouncedValue;
        if (!debouncedValue && typeof debouncedValue !== "number") {
          return;
        }

        const validateInput = async () => {
          updateFocusState();
          const hadFocusBeforeValidation = hasFocusRef.current;

          if (isMountedRef.current) {
            setValidationState((prev) => ({
              ...prev,
              isValidating: true,
            }));
          }

          const result = await performValidation(debouncedValue);

          if (isMountedRef.current) {
            if (result) {
              setValidationState({
                isValidating: false,
                result,
                hasError: !result.isValid,
                errorMessage: result.message,
              });

              handleValidationComplete(result);
            } else {
              setValidationState((prev) => ({
                ...prev,
                isValidating: false,
              }));
            }

            if (hadFocusBeforeValidation && localRef.current) {
              setTimeout(() => {
                if (isMountedRef.current && localRef.current) {
                  localRef.current.focus();

                  if (type !== "date" && type !== "time") {
                    try {
                      localRef.current.select();
                    } catch (e: unknown) {
                      console.error(
                        "Error selecting input value after validation:",
                        e
                      );
                      // ignore any errors for now <maybe log it later>
                    }
                  }
                }
              }, 500);
            }
          }
        };

        validateInput();
      }, [
        debouncedValue,
        performValidation,
        handleValidationComplete,
        updateFocusState,
        type,
      ]);

      const compositeClassName = useMemo(() => {
        return [
          className,
          validationState.isValidating ? "is-validating" : "",
          validationState.result?.isValid ? "is-valid" : "",
        ]
          .filter(Boolean)
          .join(" ");
      }, [
        className,
        validationState.isValidating,
        validationState.result?.isValid,
      ]);

      const handleBlur = useCallback(
        (e: FocusEvent<HTMLInputElement>) => {
          hasFocusRef.current = false;
          if (onBlur) {
            onBlur(e);
          }
        },
        [onBlur]
      );

      return (
        <div className="debounced-input-wrapper">
          <FormInput
            ref={localRef}
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={compositeClassName}
            required={required}
            disabled={disabled || validationState.isValidating}
            readOnly={readOnly}
            hasError={validationState.hasError}
            autoComplete={autoComplete}
            ariaLabel={ariaLabel}
            ariaDescribedBy={ariaDescribedBy}
            {...rest}
          />

          {validationState.isValidating && (
            <div className="validation-indicator">
              <span className="spinner"></span>
            </div>
          )}
        </div>
      );
    }
  )
);

DebouncedInput.displayName = "DebouncedInput";
