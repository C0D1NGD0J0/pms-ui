import { AxiosError } from "axios";

export type ErrorResponse = {
  success: boolean;
  data: any;
};

export type ValidationError = {
  message: string;
  path: string;
};

export type APIErrorResponse = {
  success: boolean;
  message: string;
  errors?: ValidationError[];
  statusCode?: number;
  type?:
    | "validation"
    | "authentication"
    | "authorization"
    | "network"
    | "server"
    | "unknown";
};

export type ErrorDisplayOptions = {
  showNotification?: boolean;
  showFieldErrors?: boolean;
  fallbackMessage?: string;
};

export class APIErrorHandler {
  /**
   * Parse and categorize errors from API responses
   */
  static parseError(error: any): APIErrorResponse {
    // Handle structured API error responses (already parsed)
    if (
      error &&
      typeof error === "object" &&
      "success" in error &&
      error.success === false
    ) {
      return {
        success: false,
        message: error.message || "An error occurred",
        errors: error.errors || [],
        statusCode: error.statusCode || error.status,
        type: this.categorizeErrorFromData(error),
      };
    }

    // Handle Axios errors
    if (error instanceof AxiosError) {
      const { response, request } = error;

      if (response) {
        // Server responded with error status
        const data = response.data;
        const statusCode = response.status;

        // Handle structured API error responses
        if (data && typeof data === "object") {
          return {
            success: false,
            message: data.message || this.getStatusMessage(statusCode),
            errors: data.errors || [],
            statusCode,
            type: this.categorizeError(statusCode, data),
          };
        }

        // Handle plain text or unknown response format
        return {
          success: false,
          message: this.getStatusMessage(statusCode),
          statusCode,
          type: this.categorizeError(statusCode),
        };
      }

      if (request) {
        // Network error (no response received)
        return {
          success: false,
          message: "Network error. Please check your connection and try again.",
          type: "network",
        };
      }
    }

    // Handle generic JavaScript errors
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || "An unexpected error occurred",
        type: "unknown",
      };
    }

    // Handle unknown error types
    return {
      success: false,
      message: "An unexpected error occurred",
      type: "unknown",
    };
  }

  /**
   * Get user-friendly message based on HTTP status code
   */
  private static getStatusMessage(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return "Bad request. Please check your input and try again.";
      case 401:
        return "Authentication required. Please log in and try again.";
      case 403:
        return "Access denied. You do not have permission to perform this action.";
      case 404:
        return "Resource not found.";
      case 409:
        return "Conflict. The resource already exists or is in use.";
      case 422:
        return "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please wait and try again.";
      case 500:
        return "Internal server error. Please try again later.";
      case 502:
        return "Bad gateway. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      case 504:
        return "Gateway timeout. Please try again later.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }

  /**
   * Categorize error type based on status code and response data
   */
  private static categorizeError(
    statusCode: number,
    data?: any
  ): APIErrorResponse["type"] {
    if (statusCode === 401) return "authentication";
    if (statusCode === 403) return "authorization";
    if (statusCode === 400 || statusCode === 422) {
      return data?.errors?.length > 0 ? "validation" : "unknown";
    }
    if (statusCode >= 500) return "server";
    if (statusCode >= 400) return "unknown";
    return "unknown";
  }

  /**
   * Categorize error type based on structured error data (without HTTP status)
   */
  private static categorizeErrorFromData(data: any): APIErrorResponse["type"] {
    // Check if it has validation errors
    if (data?.errors?.length > 0) {
      return "validation";
    }

    // Check status code if available
    if (data.statusCode || data.status) {
      const statusCode = data.statusCode || data.status;
      return this.categorizeError(statusCode, data);
    }

    // Check message content for clues
    if (data.message) {
      const message = data.message.toLowerCase();
      if (message.includes("validation") || message.includes("invalid")) {
        return "validation";
      }
      if (message.includes("authentication") || message.includes("login")) {
        return "authentication";
      }
      if (message.includes("authorization") || message.includes("permission")) {
        return "authorization";
      }
      if (message.includes("network") || message.includes("connection")) {
        return "network";
      }
      if (message.includes("server") || message.includes("internal")) {
        return "server";
      }
    }

    return "unknown";
  }

  /**
   * Format validation errors for display
   */
  static formatValidationErrors(errors: ValidationError[]): string {
    if (!errors || errors.length === 0) return "";

    if (errors.length === 1) {
      return errors[0].message;
    }

    return errors.map((error) => `• ${error.message}`).join("\n");
  }

  /**
   * Get field-specific errors as an object
   */
  static getFieldErrors(errors: ValidationError[]): Record<string, string> {
    if (!errors || errors.length === 0) return {};

    return errors.reduce(
      (acc, error) => {
        acc[error.path] = error.message;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  /**
   * Determine if error should trigger a page reload or redirect
   */
  static shouldReload(errorResponse: APIErrorResponse): boolean {
    return (
      errorResponse.type === "authentication" &&
      errorResponse.statusCode === 401
    );
  }

  /**
   * Determine if error should be logged to external service
   */
  static shouldLog(errorResponse: APIErrorResponse): boolean {
    return errorResponse.type === "server" || errorResponse.type === "unknown";
  }
}

// Legacy class for backward compatibility
export default class APIError extends Error {
  constructor() {
    super("Api Error: ");
  }

  init = (error: Error) => {
    return this.parseErrorObj(error);
  };

  private parseErrorObj(error: any) {
    if (error instanceof AxiosError) {
      const { response } = error;
      if (response && response.data) {
        return response.data;
      }
    } else if (error instanceof Error) {
      console.log(error, "----ERR");
      return this.parseSystemError(error);
    }
    console.log("No original request found3", error);
  }

  private parseSystemError = (e: Error): ErrorResponse => {
    console.log(`System Error: ${e.name}`);
    return {
      success: false,
      data: e.message,
    };
  };
}
