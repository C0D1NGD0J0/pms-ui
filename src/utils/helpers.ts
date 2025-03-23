import { IErrorReturnData } from "@interfaces/index";
import { AxiosError } from "axios";

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
  let inThrottle: boolean;
  return function (this: ThisParameterType<typeof func>, ...args: T) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const errorFormatter = (
  error: IErrorReturnData | Error | AxiosError | unknown
): string => {
  let result = "";

  // Check if it's our custom error type
  if ("errors" in error && Array.isArray(error.errors)) {
    error.errors.forEach((err) => {
      result += `* ${err.message}.\n`;
    });
  }
  // Check if it's an axios error with response data
  // else if ('response' in error && error.response?.data?.error) {
  //   const errors = error.response.data.errors;
  //   if (Array.isArray(errors)) {
  //     errors.forEach((err) => {
  //       result += `* ${err.message || err}.\n`;
  //     });
  //   }
  // }

  // Regular Error object
  else if (error instanceof Error) {
    result = error.message;
  }

  return result;
};
