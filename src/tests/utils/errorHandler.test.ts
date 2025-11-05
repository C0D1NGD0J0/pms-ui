import { AxiosResponse, AxiosError } from "axios";
import {
  APIErrorResponse,
  APIErrorHandler,
  ValidationError,
} from "@utils/errorHandler";

describe("errorHandler", () => {
  describe("APIErrorHandler.parseError", () => {
    it("should parse structured API error responses", () => {
      const error = {
        success: false,
        message: "Validation failed",
        errors: [{ message: "Email is required", path: "email" }],
        statusCode: 422,
      };

      const result = APIErrorHandler.parseError(error);

      expect(result).toEqual({
        success: false,
        message: "Validation failed",
        errors: [{ message: "Email is required", path: "email" }],
        statusCode: 422,
        type: "validation",
      });
    });

    it("should handle Axios errors with response", () => {
      const axiosError = new AxiosError("Request failed");
      axiosError.response = {
        status: 404,
        data: {
          message: "Resource not found",
        },
      } as AxiosResponse;

      const result = APIErrorHandler.parseError(axiosError);

      expect(result).toEqual({
        success: false,
        message: "Resource not found",
        errors: [],
        statusCode: 404,
        type: "unknown",
      });
    });

    it("should handle Axios network errors (no response)", () => {
      const axiosError = new AxiosError("Network Error");
      axiosError.request = {}; // Request was made but no response

      const result = APIErrorHandler.parseError(axiosError);

      expect(result).toEqual({
        success: false,
        message: "Network error. Please check your connection and try again.",
        type: "network",
      });
    });

    it("should handle generic JavaScript errors", () => {
      const error = new Error("Something went wrong");

      const result = APIErrorHandler.parseError(error);

      expect(result).toEqual({
        success: false,
        message: "Something went wrong",
        type: "unknown",
      });
    });

    it("should handle unknown error types", () => {
      const error = "Some random error";

      const result = APIErrorHandler.parseError(error);

      expect(result).toEqual({
        success: false,
        message: "An unexpected error occurred",
        type: "unknown",
      });
    });

    it("should categorize 401 errors as authentication", () => {
      const axiosError = new AxiosError("Unauthorized");
      axiosError.response = {
        status: 401,
        data: {
          message: "Authentication required",
        },
      } as AxiosResponse;

      const result = APIErrorHandler.parseError(axiosError);

      expect(result.type).toBe("authentication");
      expect(result.statusCode).toBe(401);
    });

    it("should categorize 403 errors as authorization", () => {
      const axiosError = new AxiosError("Forbidden");
      axiosError.response = {
        status: 403,
        data: {
          message: "Access denied",
        },
      } as AxiosResponse;

      const result = APIErrorHandler.parseError(axiosError);

      expect(result.type).toBe("authorization");
      expect(result.statusCode).toBe(403);
    });

    it("should categorize 422 errors with validation errors", () => {
      const axiosError = new AxiosError("Validation Failed");
      axiosError.response = {
        status: 422,
        data: {
          message: "Validation failed",
          errors: [{ message: "Invalid email", path: "email" }],
        },
      } as AxiosResponse;

      const result = APIErrorHandler.parseError(axiosError);

      expect(result.type).toBe("validation");
      expect(result.statusCode).toBe(422);
    });

    it("should categorize 500+ errors as server errors", () => {
      const axiosError = new AxiosError("Internal Server Error");
      axiosError.response = {
        status: 500,
        data: {
          message: "Internal server error",
        },
      } as AxiosResponse;

      const result = APIErrorHandler.parseError(axiosError);

      expect(result.type).toBe("server");
      expect(result.statusCode).toBe(500);
    });

    it("should use default message when response data is plain text", () => {
      const axiosError = new AxiosError("Bad Request");
      axiosError.response = {
        status: 400,
        data: "Bad Request",
      } as AxiosResponse;

      const result = APIErrorHandler.parseError(axiosError);

      expect(result.message).toBe(
        "Bad request. Please check your input and try again."
      );
    });

    it("should infer error type from message content", () => {
      const error = {
        success: false,
        message: "Invalid validation data provided",
      };

      const result = APIErrorHandler.parseError(error);
      expect(result.type).toBe("validation");
    });

    it("should handle structured error with status property", () => {
      const error = {
        success: false,
        message: "Unauthorized access",
        status: 401,
      };

      const result = APIErrorHandler.parseError(error);
      expect(result.statusCode).toBe(401);
      expect(result.type).toBe("authentication");
    });
  });

  describe("getStatusMessage", () => {
    it("should return appropriate messages for common HTTP status codes", () => {
      const testCases = [
        { code: 400, expected: /bad request/i },
        { code: 401, expected: /authentication required/i },
        { code: 403, expected: /access denied/i },
        { code: 404, expected: /not found/i },
        { code: 409, expected: /conflict/i },
        { code: 422, expected: /validation failed/i },
        { code: 429, expected: /too many requests/i },
        { code: 500, expected: /internal server error/i },
        { code: 502, expected: /bad gateway/i },
        { code: 503, expected: /service unavailable/i },
        { code: 504, expected: /gateway timeout/i },
      ];

      testCases.forEach(({ code, expected }) => {
        const axiosError = new AxiosError("Error");
        axiosError.response = {
          status: code,
          data: {},
        } as AxiosResponse;

        const result = APIErrorHandler.parseError(axiosError);
        expect(result.message).toMatch(expected);
      });
    });

    it("should return default message for unknown status codes", () => {
      const axiosError = new AxiosError("Error");
      axiosError.response = {
        status: 999,
        data: {},
      } as AxiosResponse;

      const result = APIErrorHandler.parseError(axiosError);
      expect(result.message).toMatch(/unexpected error/i);
    });
  });

  describe("formatValidationErrors", () => {
    it("should return empty string for empty errors array", () => {
      expect(APIErrorHandler.formatValidationErrors([])).toBe("");
    });

    it("should return empty string for null/undefined", () => {
      expect(APIErrorHandler.formatValidationErrors(null as any)).toBe("");
      expect(APIErrorHandler.formatValidationErrors(undefined as any)).toBe("");
    });

    it("should return single error message for one error", () => {
      const errors: ValidationError[] = [
        { message: "Email is required", path: "email" },
      ];

      expect(APIErrorHandler.formatValidationErrors(errors)).toBe(
        "Email is required"
      );
    });

    it("should format multiple errors with bullet points", () => {
      const errors: ValidationError[] = [
        { message: "Email is required", path: "email" },
        { message: "Password must be at least 8 characters", path: "password" },
        { message: "Name is required", path: "name" },
      ];

      const result = APIErrorHandler.formatValidationErrors(errors);

      expect(result).toContain("• Email is required");
      expect(result).toContain("• Password must be at least 8 characters");
      expect(result).toContain("• Name is required");
      expect(result.split("\n")).toHaveLength(3);
    });
  });

  describe("getFieldErrors", () => {
    it("should return empty object for empty errors array", () => {
      expect(APIErrorHandler.getFieldErrors([])).toEqual({});
    });

    it("should return empty object for null/undefined", () => {
      expect(APIErrorHandler.getFieldErrors(null as any)).toEqual({});
      expect(APIErrorHandler.getFieldErrors(undefined as any)).toEqual({});
    });

    it("should map errors to field paths", () => {
      const errors: ValidationError[] = [
        { message: "Email is required", path: "email" },
        { message: "Password is too short", path: "password" },
        { message: "Phone number is invalid", path: "phone" },
      ];

      const result = APIErrorHandler.getFieldErrors(errors);

      expect(result).toEqual({
        email: "Email is required",
        password: "Password is too short",
        phone: "Phone number is invalid",
      });
    });

    it("should handle nested field paths", () => {
      const errors: ValidationError[] = [
        { message: "Street is required", path: "address.street" },
        { message: "City is required", path: "address.city" },
      ];

      const result = APIErrorHandler.getFieldErrors(errors);

      expect(result).toEqual({
        "address.street": "Street is required",
        "address.city": "City is required",
      });
    });

    it("should handle duplicate field paths (last error wins)", () => {
      const errors: ValidationError[] = [
        { message: "Email is required", path: "email" },
        { message: "Email is invalid", path: "email" },
      ];

      const result = APIErrorHandler.getFieldErrors(errors);

      expect(result).toEqual({
        email: "Email is invalid",
      });
    });
  });

  describe("shouldReload", () => {
    it("should return true for 401 authentication errors", () => {
      const errorResponse: APIErrorResponse = {
        success: false,
        message: "Unauthorized",
        type: "authentication",
        statusCode: 401,
      };

      expect(APIErrorHandler.shouldReload(errorResponse)).toBe(true);
    });

    it("should return false for non-401 authentication errors", () => {
      const errorResponse: APIErrorResponse = {
        success: false,
        message: "Authentication failed",
        type: "authentication",
        statusCode: 403,
      };

      expect(APIErrorHandler.shouldReload(errorResponse)).toBe(false);
    });

    it("should return false for other error types", () => {
      const testCases: APIErrorResponse[] = [
        {
          success: false,
          message: "Validation error",
          type: "validation",
          statusCode: 422,
        },
        {
          success: false,
          message: "Server error",
          type: "server",
          statusCode: 500,
        },
        {
          success: false,
          message: "Network error",
          type: "network",
        },
      ];

      testCases.forEach((errorResponse) => {
        expect(APIErrorHandler.shouldReload(errorResponse)).toBe(false);
      });
    });
  });

  describe("shouldLog", () => {
    it("should return true for server errors", () => {
      const errorResponse: APIErrorResponse = {
        success: false,
        message: "Internal server error",
        type: "server",
        statusCode: 500,
      };

      expect(APIErrorHandler.shouldLog(errorResponse)).toBe(true);
    });

    it("should return true for unknown errors", () => {
      const errorResponse: APIErrorResponse = {
        success: false,
        message: "Something went wrong",
        type: "unknown",
      };

      expect(APIErrorHandler.shouldLog(errorResponse)).toBe(true);
    });

    it("should return false for user errors", () => {
      const testCases: APIErrorResponse[] = [
        {
          success: false,
          message: "Validation error",
          type: "validation",
          statusCode: 422,
        },
        {
          success: false,
          message: "Authentication required",
          type: "authentication",
          statusCode: 401,
        },
        {
          success: false,
          message: "Access denied",
          type: "authorization",
          statusCode: 403,
        },
        {
          success: false,
          message: "Network error",
          type: "network",
        },
      ];

      testCases.forEach((errorResponse) => {
        expect(APIErrorHandler.shouldLog(errorResponse)).toBe(false);
      });
    });
  });

  describe("Error type inference from message", () => {
    it("should infer validation error from message keywords", () => {
      const testCases = [
        "Validation failed for email",
        "Invalid input provided",
        "validation error occurred",
      ];

      testCases.forEach((message) => {
        const error = { success: false, message };
        const result = APIErrorHandler.parseError(error);
        expect(result.type).toBe("validation");
      });
    });

    it("should infer authentication error from message keywords", () => {
      const testCases = [
        "Authentication required",
        "Please login to continue",
        "authentication failed",
      ];

      testCases.forEach((message) => {
        const error = { success: false, message };
        const result = APIErrorHandler.parseError(error);
        expect(result.type).toBe("authentication");
      });
    });

    it("should infer authorization error from message keywords", () => {
      const testCases = [
        "Authorization failed",
        "You don't have permission to access this resource",
        "authorization error",
      ];

      testCases.forEach((message) => {
        const error = { success: false, message };
        const result = APIErrorHandler.parseError(error);
        expect(result.type).toBe("authorization");
      });
    });

    it("should infer network error from message keywords", () => {
      const testCases = [
        "Network connection failed",
        "Connection timeout occurred",
        "network error",
      ];

      testCases.forEach((message) => {
        const error = { success: false, message };
        const result = APIErrorHandler.parseError(error);
        expect(result.type).toBe("network");
      });
    });

    it("should infer server error from message keywords", () => {
      const testCases = [
        "Internal server error",
        "Server error occurred",
        "internal error",
      ];

      testCases.forEach((message) => {
        const error = { success: false, message };
        const result = APIErrorHandler.parseError(error);
        expect(result.type).toBe("server");
      });
    });
  });

  describe("Complex error scenarios", () => {
    it("should handle Axios error with structured API response and validation errors", () => {
      const axiosError = new AxiosError("Validation Failed");
      axiosError.response = {
        status: 422,
        data: {
          message: "Validation failed",
          errors: [
            { message: "Email is required", path: "email" },
            { message: "Password is required", path: "password" },
          ],
        },
      } as AxiosResponse;

      const result = APIErrorHandler.parseError(axiosError);

      expect(result.type).toBe("validation");
      expect(result.errors).toHaveLength(2);
      expect(result.statusCode).toBe(422);
    });

    it("should handle multiple error formats consistently", () => {
      // Test that different error formats produce consistent results
      const axiosError = new AxiosError("Error");
      axiosError.response = {
        status: 500,
        data: { message: "Server error" },
      } as AxiosResponse;

      const structuredError = {
        success: false,
        message: "Server error",
        statusCode: 500,
      };

      const result1 = APIErrorHandler.parseError(axiosError);
      const result2 = APIErrorHandler.parseError(structuredError);

      expect(result1.type).toBe(result2.type);
      expect(result1.message).toBe(result2.message);
    });
  });
});
