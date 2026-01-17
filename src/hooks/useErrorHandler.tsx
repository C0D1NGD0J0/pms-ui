"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@hooks/useNotification";
import {
  ErrorDisplayOptions,
  APIErrorResponse,
  APIErrorHandler,
  errorLogger,
} from "@utils/errorHandler";

export function useErrorHandler() {
  const { message, openNotification } = useNotification();
  const router = useRouter();

  const handleError = useCallback(
    (error: any, options: ErrorDisplayOptions = {}) => {
      const {
        showNotification = true,
        showFieldErrors = false,
        fallbackMessage = "An unexpected error occurred",
      } = options;

      const errorResponse: APIErrorResponse = APIErrorHandler.parseError(error);

      if (APIErrorHandler.shouldLog(errorResponse)) {
        errorLogger.log(errorResponse, "error");
      }

      if (errorResponse.type === "validation") {
        errorLogger.logValidationError(errorResponse);
      }

      if (errorResponse.type === "network") {
        errorLogger.logNetworkError(errorResponse);
      }

      if (
        errorResponse.type === "authentication" ||
        errorResponse.type === "authorization"
      ) {
        errorLogger.logAuthError(errorResponse);
      }

      if (APIErrorHandler.shouldReload(errorResponse)) {
        message.error("Session expired. Please log in again.");
        router.push("/login");
        return errorResponse;
      }

      if (errorResponse.type === "validation" && errorResponse.errors?.length) {
        if (showFieldErrors) {
          return {
            ...errorResponse,
            fieldErrors: APIErrorHandler.getFieldErrors(errorResponse.errors),
          };
        }

        if (showNotification) {
          const validationMessage = APIErrorHandler.formatValidationErrors(
            errorResponse.errors
          );

          if (errorResponse.errors.length === 1) {
            message.error(validationMessage);
          } else {
            openNotification("error", "Validation Error", validationMessage, {
              duration: 6,
            });
          }
        }

        return errorResponse;
      }

      if (showNotification) {
        const displayMessage = errorResponse.message || fallbackMessage;

        switch (errorResponse.type) {
          case "network":
            message.error(displayMessage);
            break;
          case "server":
            openNotification("error", "Server Error", displayMessage, {
              duration: 8,
            });
            break;
          case "authorization":
            message.error(displayMessage);
            break;
          default:
            message.error(displayMessage);
        }
      }

      return errorResponse;
    },
    [message, openNotification, router]
  );

  const handleValidationError = useCallback(
    (error: any) => {
      return handleError(error, {
        showNotification: true,
        showFieldErrors: true,
      });
    },
    [handleError]
  );

  const handleSilentError = useCallback(
    (error: any) => {
      return handleError(error, {
        showNotification: false,
        showFieldErrors: false,
      });
    },
    [handleError]
  );

  const handleMutationError = useCallback(
    (error: any, customMessage?: string) => {
      return handleError(error, {
        showNotification: true,
        showFieldErrors: false,
        fallbackMessage: customMessage,
      });
    },
    [handleError]
  );

  const handleQueryError = useCallback(
    (error: any) => {
      return handleError(error, {
        showNotification: true,
        showFieldErrors: false,
      });
    },
    [handleError]
  );

  return {
    handleError,
    handleValidationError,
    handleSilentError,
    handleMutationError,
    handleQueryError,
    parseError: APIErrorHandler.parseError,
  };
}
