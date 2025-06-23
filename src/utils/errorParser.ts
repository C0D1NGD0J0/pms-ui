/**
 * Universal error parser for handling various error types throughout the app
 * Handles Axios errors, fetch errors, backend responses, JavaScript errors, etc.
 */

export interface ParsedError {
  message: string;
  fieldErrors: Record<string, string[]>;
  statusCode?: number;
}

export function parseError(error: any): ParsedError {
  // Default response structure
  const defaultResult: ParsedError = {
    message: "An unexpected error occurred",
    fieldErrors: {},
    statusCode: undefined,
  };

  // Handle null/undefined errors
  if (!error) {
    return defaultResult;
  }

  // 1. Axios errors (most common case)
  if (error.response?.data) {
    const data = error.response.data;
    return {
      message: data.message || "Request failed",
      fieldErrors: data.errorInfo || {},
      statusCode: data.statusCode || error.response.status,
    };
  }

  // 2. Fetch API errors
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return {
      message: "Network error. Please check your connection.",
      fieldErrors: {},
      statusCode: undefined,
    };
  }

  // 3. Direct backend error objects (already parsed JSON)
  if (error.success === false && error.errorInfo) {
    return {
      message: error.message || "Validation failed",
      fieldErrors: error.errorInfo || {},
      statusCode: error.statusCode,
    };
  }

  // 4. Standard JavaScript Error objects
  if (error instanceof Error) {
    return {
      message: error.message,
      fieldErrors: {},
      statusCode: undefined,
    };
  }

  // 5. String errors
  if (typeof error === "string") {
    return {
      message: error,
      fieldErrors: {},
      statusCode: undefined,
    };
  }

  // 6. Network/timeout errors
  if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT") {
    return {
      message: "Connection problem. Please try again.",
      fieldErrors: {},
      statusCode: undefined,
    };
  }

  // 7. Axios timeout/network errors
  if (error.code === "ECONNABORTED") {
    return {
      message: "Request timeout. Please try again.",
      fieldErrors: {},
      statusCode: undefined,
    };
  }

  // 8. Fallback for unknown error types
  return {
    message: error.message || error.toString() || "Something went wrong",
    fieldErrors: {},
    statusCode: error.status || error.statusCode,
  };
}
