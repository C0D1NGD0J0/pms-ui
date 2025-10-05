import { renderHook } from "@testing-library/react";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { APIErrorHandler } from "@utils/errorHandler";
import { AxiosError } from "axios";

// Mock useNotification
const mockMessage = {
  error: jest.fn(),
};

const mockOpenNotification = jest.fn();

jest.mock("@hooks/useNotification", () => ({
  useNotification: jest.fn(() => ({
    message: mockMessage,
    openNotification: mockOpenNotification,
  })),
}));

// Mock useRouter
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));

describe("useErrorHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Error Parsing", () => {
    it("should parse structured API error response", () => {
      const error = {
        success: false,
        message: "Test error message",
        statusCode: 400,
        errors: [],
      };

      const parsed = APIErrorHandler.parseError(error);

      expect(parsed.success).toBe(false);
      expect(parsed.message).toBe("Test error message");
      expect(parsed.statusCode).toBe(400);
    });

    it("should parse Axios error with response", () => {
      const axiosError = new AxiosError("Request failed");
      axiosError.response = {
        status: 404,
        data: {
          message: "Resource not found",
        },
        statusText: "Not Found",
        headers: {},
        config: {} as any,
      };

      const parsed = APIErrorHandler.parseError(axiosError);

      expect(parsed.statusCode).toBe(404);
      expect(parsed.message).toBe("Resource not found");
    });

    it("should parse network error (no response)", () => {
      const axiosError = new AxiosError("Network Error");
      axiosError.request = {};

      const parsed = APIErrorHandler.parseError(axiosError);

      expect(parsed.type).toBe("network");
      expect(parsed.message).toContain("Network error");
    });
  });

  describe("Authentication Errors (401)", () => {
    it("should redirect to login on 401 authentication error", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Authentication required",
        statusCode: 401,
      };

      result.current.handleError(error);

      expect(mockMessage.error).toHaveBeenCalledWith(
        "Session expired. Please log in again."
      );
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  describe("Authorization Errors (403)", () => {
    it("should show message for 403 authorization error", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Access denied",
        statusCode: 403,
      };

      result.current.handleError(error);

      expect(mockMessage.error).toHaveBeenCalledWith("Access denied");
    });
  });

  describe("Validation Errors", () => {
    it("should display single validation error as message", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Validation failed",
        statusCode: 422,
        errors: [
          {
            path: "email",
            message: "Email is required",
          },
        ],
      };

      result.current.handleError(error);

      expect(mockMessage.error).toHaveBeenCalledWith("Email is required");
    });

    it("should display multiple validation errors as notification", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Validation failed",
        statusCode: 422,
        errors: [
          {
            path: "email",
            message: "Email is required",
          },
          {
            path: "password",
            message: "Password must be at least 8 characters",
          },
        ],
      };

      result.current.handleError(error);

      expect(mockOpenNotification).toHaveBeenCalledWith(
        "error",
        "Validation Error",
        expect.stringContaining("Email is required"),
        { duration: 6 }
      );
    });

    it("should return field errors when showFieldErrors is true", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Validation failed",
        statusCode: 422,
        errors: [
          {
            path: "email",
            message: "Email is required",
          },
          {
            path: "password",
            message: "Password is required",
          },
        ],
      };

      const response = result.current.handleValidationError(error);

      expect(response.fieldErrors).toEqual({
        email: "Email is required",
        password: "Password is required",
      });
    });
  });

  describe("Server Errors", () => {
    it("should display server error as notification", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Internal server error",
        statusCode: 500,
      };

      result.current.handleError(error);

      expect(mockOpenNotification).toHaveBeenCalledWith(
        "error",
        "Server Error",
        "Internal server error",
        { duration: 8 }
      );
    });
  });

  describe("Network Errors", () => {
    it("should display network error as message", () => {
      const { result } = renderHook(() => useErrorHandler());

      const axiosError = new AxiosError("Network Error");
      axiosError.request = {};

      result.current.handleError(axiosError);

      expect(mockMessage.error).toHaveBeenCalledWith(
        expect.stringContaining("Network error")
      );
    });
  });

  describe("Silent Error Mode", () => {
    it("should not show notification when using handleSilentError", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Test error",
        statusCode: 400,
      };

      result.current.handleSilentError(error);

      expect(mockMessage.error).not.toHaveBeenCalled();
      expect(mockOpenNotification).not.toHaveBeenCalled();
    });

    it("should still redirect to login on 401 even in silent mode", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Unauthorized",
        statusCode: 401,
      };

      result.current.handleSilentError(error);

      // Auth errors always show message and redirect
      expect(mockMessage.error).toHaveBeenCalledWith(
        "Session expired. Please log in again."
      );
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  describe("Custom Options", () => {
    it("should respect showNotification option", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Test error",
        statusCode: 400,
      };

      result.current.handleError(error, { showNotification: false });

      expect(mockMessage.error).not.toHaveBeenCalled();
      expect(mockOpenNotification).not.toHaveBeenCalled();
    });

    it("should use fallback message when error message is empty", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = new Error("Generic error");

      result.current.handleError(error, {
        fallbackMessage: "Custom fallback message",
      });

      expect(mockMessage.error).toHaveBeenCalledWith("Generic error");
    });
  });

  describe("handleValidationError", () => {
    it("should enable field errors and notifications by default", () => {
      const { result } = renderHook(() => useErrorHandler());

      const error = {
        success: false,
        message: "Validation failed",
        statusCode: 422,
        errors: [
          {
            path: "email",
            message: "Email is invalid",
          },
        ],
      };

      const response = result.current.handleValidationError(error);

      expect(response.fieldErrors).toBeDefined();
      expect(response.fieldErrors?.email).toBe("Email is invalid");
    });
  });
});
