import { invitationService } from "@services/index";
import * as helpersModule from "@src/utils/helpers";
import { renderHook, act } from "@testing-library/react";
import * as useNotificationModule from "@hooks/useNotification";
import { useValidateInviteToken } from "@app/(auth)/invite/[cuid]/hooks/useValidateInviteToken";

// Mock dependencies
jest.mock("@services/index", () => ({
  invitationService: {
    validateInvitationToken: jest.fn(),
  },
}));

jest.mock("@hooks/useNotification", () => ({
  useNotification: jest.fn(),
}));

jest.mock("@src/utils/helpers", () => ({
  parseError: jest.fn(() => ({
    fieldErrors: { email: "Invalid email" },
    message: "Validation error",
    hasValidationErrors: true,
  })),
}));

const mockOpenNotification = jest.fn();
const mockValidateInvitationToken =
  invitationService.validateInvitationToken as jest.Mock;

describe("useValidateInviteToken Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNotificationModule.useNotification as jest.Mock).mockReturnValue({
      openNotification: mockOpenNotification,
    });
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useValidateInviteToken());

    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.validateToken).toBe("function");
  });

  it("should handle successful token validation", async () => {
    const mockResponse = {
      success: true,
      data: {
        invitation: {
          id: "invite-123",
          email: "test@example.com",
          role: "staff",
          clientName: "Test Company",
        },
      },
    };

    mockValidateInvitationToken.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useValidateInviteToken());

    let response: any;
    await act(async () => {
      response = await result.current.validateToken({
        cuid: "test-cuid",
        token: "test-token",
      });
    });

    expect(mockValidateInvitationToken).toHaveBeenCalledWith(
      "test-cuid",
      "test-token"
    );
    expect(response).toEqual(mockResponse);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle token validation error", async () => {
    const mockError = new Error("Invalid token");
    mockValidateInvitationToken.mockRejectedValue(mockError);

    const { result } = renderHook(() => useValidateInviteToken());

    let response: any;
    await act(async () => {
      response = await result.current.validateToken({
        cuid: "test-cuid",
        token: "invalid-token",
      });
    });

    expect(mockValidateInvitationToken).toHaveBeenCalledWith(
      "test-cuid",
      "invalid-token"
    );
    expect(response).toEqual({
      success: false,
      data: null,
    });
    expect(mockOpenNotification).toHaveBeenCalledWith(
      "error",
      "Validation Failed",
      "Invalid email"
    );
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle validation error without field errors", async () => {
    const mockError = new Error("Server error");
    mockValidateInvitationToken.mockRejectedValue(mockError);

    // Mock parseError to return no field errors
    const parseErrorMock = helpersModule.parseError as jest.Mock;
    parseErrorMock.mockReturnValue({
      fieldErrors: null,
      message: "Server error",
      hasValidationErrors: false,
    });

    const { result } = renderHook(() => useValidateInviteToken());

    let response: any;
    await act(async () => {
      response = await result.current.validateToken({
        cuid: "test-cuid",
        token: "test-token",
      });
    });

    expect(response).toEqual({
      success: false,
      data: null,
    });
    expect(mockOpenNotification).toHaveBeenCalledWith(
      "error",
      "Validation Failed",
      "Server error"
    );
  });

  it("should manage loading state correctly", async () => {
    mockValidateInvitationToken.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useValidateInviteToken());

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.validateToken({ cuid: "test-cuid", token: "test-token" });
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.isLoading).toBe(false);
  });
});
