import _ from "lodash";
import axios, { AxiosError } from "axios";
import { IErrorReturnData, ParsedError } from "@interfaces/index";

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

function isObject(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

export function extractChanges<T extends object, U extends object>(
  original: T,
  current: U,
  opts: { ignoreKeys?: string[] } = {}
): Record<string, any> | null {
  if (!isObject(original) || !isObject(current)) {
    return !_.isEqual(original, current) ? (current as any) : null;
  }
  const { ignoreKeys = [] } = opts;
  const diff: Record<string, any> = {};

  for (const [key, currVal] of Object.entries(current)) {
    if (ignoreKeys.includes(key as string)) continue;
    const origVal = (original as any)[key];
    if (_.isEqual(origVal, currVal)) continue;

    if (Array.isArray(currVal)) {
      diff[key] = currVal;
    } else if (isObject(currVal) && isObject(origVal)) {
      if (key === "address") {
        const origFullAddress = (origVal as any)?.fullAddress;
        const currFullAddress = (currVal as any)?.fullAddress;
        const objlength = Object.keys(origVal).length;
        const currObjLength = Object.keys(currVal).length;

        if (origFullAddress !== currFullAddress || currObjLength > objlength) {
          diff[key] = currVal;
          continue;
        }
      }

      const nested = extractChanges(origVal, currVal);
      if (nested) diff[key] = nested;
    } else {
      diff[key] = currVal;
    }
  }

  return Object.keys(diff).length > 0 ? diff : null;
}

export function parseError(error: any): ParsedError {
  const defaultResult: ParsedError = {
    fieldErrors: {},
    statusCode: undefined,
    hasValidationErrors: false,
    message: "An unexpected error occurred",
  };

  if (!error) {
    return defaultResult;
  }

  if (error.response?.data) {
    const data = error.response.data;
    return {
      message: data.message || "Request failed",
      fieldErrors: data.errorInfo || {},
      statusCode: data.statusCode || error.response.status,
    };
  }
  if (error.success === false && error.errorInfo) {
    return {
      message: error.message || "Validation failed",
      fieldErrors: error.errorInfo || {},
      statusCode: error.statusCode,
    };
  }

  if (error.success === false && error.errors) {
    const hasValidationErrors =
      Array.isArray(error.errors) && error.errors.length > 0;
    return {
      message: error.message || "Validation failed",
      fieldErrors: error.errors.reduce(
        (acc: Record<string, string>, err: any) => {
          acc[err.path] = err.message;
          return acc;
        },
        {}
      ),
      hasValidationErrors,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      fieldErrors: {},
      statusCode: undefined,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
      fieldErrors: {},
      statusCode: undefined,
    };
  }

  if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT") {
    return {
      message: "Connection problem. Please try again.",
      fieldErrors: {},
      statusCode: undefined,
    };
  }

  if (error.code === "ECONNABORTED") {
    return {
      message: "Request timeout. Please try again.",
      fieldErrors: {},
      statusCode: undefined,
    };
  }

  return {
    message: error.message || error.toString() || "Something went wrong",
    fieldErrors: {},
    statusCode: error.status || error.statusCode,
  };
}
