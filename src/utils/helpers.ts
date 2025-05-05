import axios, { AxiosError } from "axios";
import { IErrorReturnData } from "@interfaces/index";
import _ from "lodash";

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex =
    /^(?:(?:\+|00)([1-9]\d{0,2}))?[ .-]?(?:\(([0-9]{1,4})\)|([0-9]{1,4}))[ .-]?([0-9]{1,4})(?:[ .-]?([0-9]{1,4}))*$/;
  const isValidFormat = phoneRegex.test(phoneNumber);

  if (!isValidFormat) return false;

  const digitCount = phoneNumber.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 15;
};

export const objectToFormData = (
  obj: any,
  formData = new FormData(),
  parentKey = ""
): FormData => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (Array.isArray(value)) {
        formData.append(formKey, JSON.stringify(value));
      } else if (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof File)
      ) {
        objectToFormData(value, formData, formKey);
      } else {
        const formValue = typeof value === "boolean" ? value.toString() : value;
        formData.append(formKey, formValue);
      }
    }
  }
  return formData;
};

export const throttle = <T extends unknown[]>(
  func: (...args: T) => void,
  limit: number
) => {
  let inThrottle = false;
  let lastArgs: T | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function throttled(this: ThisParameterType<typeof func>, ...args: T) {
    lastArgs = args;

    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      // allow calls again after the limit
      timeoutId = setTimeout(() => {
        inThrottle = false;

        // where there were any calls during the wait, run the function with the most recent args
        if (lastArgs) {
          // not really sure whats going on here, but it works
          Function.prototype.apply.call(func, this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    }
  }

  type ThrottledFunction = ((...args: T) => void) & { cancel: () => void };

  // cancel method
  (throttled as ThrottledFunction).cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    inThrottle = false;
    lastArgs = null;
  };

  return throttled as ThrottledFunction;
};

export const errorFormatter = (error: unknown): string => {
  let result = "";

  // if it's custom error type
  if (
    error !== null &&
    typeof error === "object" &&
    "errors" in error &&
    Array.isArray((error as IErrorReturnData).errors)
  ) {
    const customError = error as IErrorReturnData;
    customError.errors?.forEach((err) => {
      result += `* ${err.message}.\n`;
    });
  }
  // if it's axios error
  else if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const errors = axiosError.response?.data?.errors;
    if (Array.isArray(errors)) {
      errors.forEach((err) => {
        result += `* ${err.message || err}.\n`;
      });
    }
  }
  // regular error object
  else {
    console.log(error);
    result = (error as Error)?.message;
  }
  return result;
};

export const extractChangesBetweenObjects = <
  T extends Record<string, unknown>,
  K extends Record<string, unknown>
>(
  original: T,
  current: K,
  parentKey = ""
): Record<string, any> | null => {
  if (
    typeof current !== "object" ||
    current === null ||
    Array.isArray(current)
  ) {
    if (!_.isEqual(current, original)) {
      return current;
    }
    return {};
  }

  let hasChanges = false;
  const changes: Record<string, any> = {};

  for (const key in current) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const originalValue =
      original && typeof original === "object" ? original[key] : undefined;
    const currentValue = current[key];

    if (Array.isArray(currentValue)) {
      // Implementation for array comparison would go here
      if (!_.isEqual(currentValue, originalValue)) {
        changes[key] = currentValue;
        hasChanges = true;
      }
    } else if (
      typeof currentValue === "object" &&
      currentValue !== null &&
      originalValue
    ) {
      // recursive case for nested objects
      const nestedChanges = extractChangesBetweenObjects(
        originalValue,
        currentValue,
        fullKey
      );
      if (Object.keys(nestedChanges).length > 0) {
        changes[key] = nestedChanges;
        hasChanges = true;
      }
    } else if (!_.isEqual(currentValue, originalValue)) {
      changes[key] = currentValue;
      hasChanges = true;
    }
  }

  return hasChanges ? changes : null;
};
