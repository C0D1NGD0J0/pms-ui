/**
 * Generic utility for transforming objects to FormData when files are present
 * Can be used across all services (properties, profiles, documents, etc.)
 */
export interface FormDataOptions {
  fileFields?: string[]; // specify which fields are files
  arrayPrefix?: string; // prefix for array fields (e.g., "documents")
}

/**
 * Checks if an object contains any File objects
 */
export function hasFiles(obj: any): boolean {
  if (obj instanceof File) return true;

  if (Array.isArray(obj)) {
    return obj.some((item) => hasFiles(item));
  }

  if (obj && typeof obj === "object") {
    return Object.values(obj).some((value) => hasFiles(value));
  }

  return false;
}

/**
 * Transforms an object to FormData, handling nested objects and files
 * @param data - The data object to transform
 * @param options - Optional configuration
 * @param parentKey - Internal: used for recursion
 */
export function transformToFormData(
  data: any,
  options: FormDataOptions = {},
  parentKey = ""
): FormData {
  const formData = new FormData();

  function appendToFormData(value: any, key: string) {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item);
        } else if (typeof item === "object" && item !== null) {
          Object.entries(item).forEach(([subKey, subValue]) => {
            appendToFormData(subValue, `${key}[${index}].${subKey}`);
          });
        } else {
          formData.append(`${key}[${index}]`, String(item));
        }
      });
    } else if (value && typeof value === "object" && !(value instanceof Date)) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        appendToFormData(
          subValue,
          parentKey ? `${key}.${subKey}` : `${key}.${subKey}`
        );
      });
    } else if (value !== undefined && value !== null) {
      // Handle primitives and dates
      const stringValue =
        value instanceof Date ? value.toISOString() : String(value);
      formData.append(key, stringValue);
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    appendToFormData(value, fullKey);
  });

  return formData;
}

/**
 * Simple helper to determine if we should use FormData or JSON
 * @param data - The data to check
 * @returns Object with sendAsFormData flag and transformed data
 */
export function prepareRequestData(data: any, options?: FormDataOptions) {
  const shouldUseFormData = hasFiles(data);

  if (shouldUseFormData) {
    return {
      sendAsFormData: true,
      data: transformToFormData(data, options),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }

  return {
    sendAsFormData: false,
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  };
}
