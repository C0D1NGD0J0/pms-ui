import { AxiosError } from "axios";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ErrorResponse = {
  success: boolean;
  data: any;
};

export type ValidationError = {
  message: string;
  path: string;
};

export type ErrorType =
  | "validation"
  | "authentication"
  | "authorization"
  | "network"
  | "server"
  | "unknown";

export type APIErrorResponse = {
  success: boolean;
  message: string;
  errors?: ValidationError[];
  statusCode?: number;
  type?: ErrorType;
};

export type ErrorDisplayOptions = {
  showNotification?: boolean;
  showFieldErrors?: boolean;
  fallbackMessage?: string;
};

export type ErrorLogLevel = "error" | "warning" | "info";

export interface ErrorLogContext {
  user?: { useruid?: string };
  request?: { url?: string; method?: string; headers?: Record<string, string> };
  additional?: Record<string, any>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ERROR_KEYWORDS = {
  authentication: [
    "password",
    "credentials",
    "email/password",
    "authentication",
    "login",
  ],
  authorization: ["permission", "authorized", "authorization", "forbidden"],
  validation: ["validation", "invalid"],
  network: ["network", "connection"],
  server: ["server", "internal"],
} as const;

const STATUS_MESSAGES: Record<number, string> = {
  400: "Bad request. Please check your input and try again.",
  401: "Authentication required. Please log in and try again.",
  403: "Access denied. You do not have permission to perform this action.",
  404: "Resource not found.",
  409: "Conflict. The resource already exists or is in use.",
  422: "Validation failed. Please check your input.",
  429: "Too many requests. Please wait and try again.",
  500: "Internal server error. Please try again later.",
  502: "Bad gateway. Please try again later.",
  503: "Service unavailable. Please try again later.",
  504: "Gateway timeout. Please try again later.",
};

const DEFAULT_ERROR_MESSAGE = "An unexpected error occurred. Please try again.";

// ============================================================================
// ERROR CATEGORIZATION
// ============================================================================

function matchesKeywords(
  message: string,
  keywords: readonly string[]
): boolean {
  const lowerMessage = message.toLowerCase();
  return keywords.some((keyword) => lowerMessage.includes(keyword));
}

function categorizeByMessage(message: string): ErrorType | null {
  if (matchesKeywords(message, ERROR_KEYWORDS.authentication))
    return "authentication";
  if (matchesKeywords(message, ERROR_KEYWORDS.authorization))
    return "authorization";
  if (matchesKeywords(message, ERROR_KEYWORDS.validation)) return "validation";
  if (matchesKeywords(message, ERROR_KEYWORDS.network)) return "network";
  if (matchesKeywords(message, ERROR_KEYWORDS.server)) return "server";
  return null;
}

function categorizeByStatusCode(statusCode: number, data?: any): ErrorType {
  // Auth errors
  if (statusCode === 401) return "authentication";
  if (statusCode === 403) return "authorization";

  // Check message content first for better categorization
  if (data?.message) {
    const messageType = categorizeByMessage(data.message);
    if (messageType) return messageType;
  }

  // Validation errors
  if (statusCode === 400 || statusCode === 422) {
    return data?.errors?.length > 0 ? "validation" : "unknown";
  }

  // Server errors
  if (statusCode >= 500) return "server";
  if (statusCode >= 400) return "unknown";

  return "unknown";
}

// ============================================================================
// ERROR PARSING
// ============================================================================

export class APIErrorHandler {
  /**
   * Parse and categorize errors from API responses
   */
  static parseError(error: any): APIErrorResponse {
    // Structured API error (already parsed)
    if (error?.success === false && typeof error === "object") {
      return {
        success: false,
        message: error.message || DEFAULT_ERROR_MESSAGE,
        errors: error.errors || [],
        statusCode: error.statusCode || error.status,
        type: this.categorizeFromData(error),
      };
    }

    // Axios errors
    if (error instanceof AxiosError) {
      return this.parseAxiosError(error);
    }

    // Generic JavaScript errors
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || DEFAULT_ERROR_MESSAGE,
        type: "unknown",
      };
    }

    // Unknown error types
    return {
      success: false,
      message: DEFAULT_ERROR_MESSAGE,
      type: "unknown",
    };
  }

  private static parseAxiosError(error: AxiosError): APIErrorResponse {
    const { response, request } = error;

    // Server responded with error status
    if (response) {
      const data = response.data;
      const statusCode = response.status;

      if (data && typeof data === "object") {
        return {
          success: false,
          message: (data as any).message || this.getStatusMessage(statusCode),
          errors: (data as any).errors || [],
          statusCode,
          type: categorizeByStatusCode(statusCode, data),
        };
      }

      return {
        success: false,
        message: this.getStatusMessage(statusCode),
        statusCode,
        type: categorizeByStatusCode(statusCode),
      };
    }

    // Network error (no response received)
    if (request) {
      return {
        success: false,
        message: "Network error. Please check your connection and try again.",
        type: "network",
      };
    }

    return {
      success: false,
      message: DEFAULT_ERROR_MESSAGE,
      type: "unknown",
    };
  }

  private static categorizeFromData(data: any): ErrorType {
    // Has validation errors array
    if (data?.errors?.length > 0) {
      return "validation";
    }

    // Has status code
    if (data.statusCode || data.status) {
      const statusCode = data.statusCode || data.status;
      return categorizeByStatusCode(statusCode, data);
    }

    // Check message content
    if (data.message) {
      const messageType = categorizeByMessage(data.message);
      if (messageType) return messageType;
    }

    return "unknown";
  }

  // ============================================================================
  // ERROR FORMATTING
  // ============================================================================

  /**
   * Get user-friendly message based on HTTP status code
   */
  static getStatusMessage(statusCode: number): string {
    return STATUS_MESSAGES[statusCode] || DEFAULT_ERROR_MESSAGE;
  }

  /**
   * Format validation errors for display
   */
  static formatValidationErrors(errors: ValidationError[]): string {
    if (!errors?.length) return "";
    if (errors.length === 1) return errors[0].message;
    return errors.map((error) => `• ${error.message}`).join("\n");
  }

  /**
   * Get field-specific errors as an object
   */
  static getFieldErrors(errors: ValidationError[]): Record<string, string> {
    if (!errors?.length) return {};
    return errors.reduce(
      (acc, error) => {
        acc[error.path] = error.message;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  // ============================================================================
  // ERROR POLICIES
  // ============================================================================

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

// ============================================================================
// ERROR LOGGING
// ============================================================================

/**
 * Error Logger - Tracks errors to external services (Sentry, LogRocket, etc.)
 * Enable by setting: NEXT_PUBLIC_ENABLE_ERROR_LOGGING=true
 */
class ErrorLogger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isEnabled = process.env.NEXT_PUBLIC_ENABLE_ERROR_LOGGING === "true";

  log(
    error: APIErrorResponse,
    level: ErrorLogLevel = "error",
    context?: ErrorLogContext
  ): void {
    if (this.isDevelopment) {
      const logMethod =
        level === "error"
          ? console.error
          : level === "warning"
            ? console.warn
            : console.info;

      const errorDetails: Record<string, any> = {
        timestamp: new Date().toISOString(),
      };
      if (error.message) errorDetails.message = error.message;
      if (error.type) errorDetails.type = error.type;
      if (error.statusCode) errorDetails.statusCode = error.statusCode;
      if (error.errors && error.errors.length > 0)
        errorDetails.errors = error.errors;
      if (context) errorDetails.context = context;

      if (Object.keys(errorDetails).length > 1) {
        logMethod("[Error]", errorDetails);
      } else {
        logMethod("[Error]", "Unknown error occurred", error);
      }
    }

    if (!this.isEnabled) return;

    // TODO: Send to external logging service (Sentry, LogRocket, etc.)
  }

  logNetworkError(error: APIErrorResponse, context?: ErrorLogContext): void {
    this.log(error, "error", {
      ...context,
      additional: { ...context?.additional, isNetworkError: true },
    });
  }

  logValidationError(error: APIErrorResponse, context?: ErrorLogContext): void {
    this.log(error, "warning", {
      ...context,
      additional: {
        ...context?.additional,
        isValidationError: true,
        validationErrors: error.errors,
      },
    });
  }

  logAuthError(error: APIErrorResponse, context?: ErrorLogContext): void {
    this.log(error, "error", {
      ...context,
      additional: { ...context?.additional, isAuthError: true },
    });
  }
}

export const errorLogger = new ErrorLogger();

// ============================================================================
// EXTERNAL ERROR LOGGING (Sentry, LogRocket, etc.)
// ============================================================================

/**
 * Log errors to external services without showing user notifications
 * Use this in catch blocks for background error tracking
 */
export function logExternalError(
  error: unknown,
  context?: ErrorLogContext
): APIErrorResponse {
  const parsedError = APIErrorHandler.parseError(error);

  // Determine log level based on error type
  const logLevel: ErrorLogLevel =
    parsedError.type === "validation" ? "warning" : "error";

  // Log once with appropriate context metadata
  const enrichedContext: ErrorLogContext = {
    ...context,
    additional: {
      ...context?.additional,
      errorType: parsedError.type,
      ...(parsedError.type === "validation" && {
        validationErrors: parsedError.errors,
      }),
      ...(parsedError.type === "network" && { isNetworkError: true }),
      ...(["authentication", "authorization"].includes(
        parsedError.type || ""
      ) && { isAuthError: true }),
    },
  };

  errorLogger.log(parsedError, logLevel, enrichedContext);

  return parsedError;
}

// ============================================================================
// GLOBAL QUERY ERROR HANDLER (TanStack Query)
// ============================================================================

/**
 * Notification bridge - allows utilities to call openNotification
 * Set this from your useNotification hook in a layout/provider component
 */
let notificationBridge:
  | ((
      type: "success" | "error" | "info" | "warning",
      message: string,
      description?: string
    ) => void)
  | null = null;

export function setNotificationBridge(
  bridge:
    | ((
        type: "success" | "error" | "info" | "warning",
        message: string,
        description?: string
      ) => void)
    | null
): void {
  notificationBridge = bridge;
}

function getNotificationTitle(errorType: ErrorType): string {
  const titles: Record<ErrorType, string> = {
    validation: "Validation Error",
    network: "Network Error",
    authentication: "Authentication Error",
    authorization: "Authorization Error",
    server: "Server Error",
    unknown: "Error",
  };
  return titles[errorType];
}

/**
 * Global error handler for all TanStack Query mutations/queries
 * Automatically logs errors and shows notifications to users
 */
export function globalQueryErrorHandler(error: unknown): void {
  const parsedError = APIErrorHandler.parseError(error);

  // Log based on error type
  if (APIErrorHandler.shouldLog(parsedError)) {
    errorLogger.log(parsedError, "error");
  }
  if (parsedError.type === "validation") {
    errorLogger.logValidationError(parsedError);
  }
  if (parsedError.type === "network") {
    errorLogger.logNetworkError(parsedError);
  }
  if (
    parsedError.type === "authentication" ||
    parsedError.type === "authorization"
  ) {
    errorLogger.logAuthError(parsedError);
  }

  // Show user notification
  if (notificationBridge) {
    const notificationType =
      parsedError.type === "validation" ? "warning" : "error";
    const title = getNotificationTitle(parsedError.type || "unknown");
    const description =
      parsedError.type === "validation" && parsedError.errors?.length
        ? APIErrorHandler.formatValidationErrors(parsedError.errors)
        : parsedError.message;

    notificationBridge(notificationType, title, description);
  }
}
