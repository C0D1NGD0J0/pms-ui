import { userService } from "@services/users";
import { useNotification } from "@hooks/useNotification";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  useReconnectEmployee,
  useRemoveEmployee,
} from "@app/(protectedRoutes)/users/[cuid]/staff/hooks/employeeHooks";

jest.mock("@services/users");
jest.mock("@hooks/useNotification");

const mockedUserService = userService as jest.Mocked<typeof userService>;
const mockedUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
>;

describe("Employee Hooks", () => {
  const mockCuid = "client-123";
  const mockUid = "user-456";
  const mockMessage = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  };

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockedUseNotification.mockReturnValue({
      message: mockMessage,
    } as any);

    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useRemoveEmployee", () => {
    it("should remove employee successfully", async () => {
      const mockResponse = {
        success: true,
        message: "Employee removed successfully",
        data: {
          actions: [{ action: "user_disconnected", uid: mockUid }],
        },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useRemoveEmployee(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserService.removeUser).toHaveBeenCalledWith(
        mockCuid,
        mockUid
      );
      expect(mockMessage.success).toHaveBeenCalledWith(
        "Employee removed successfully!"
      );
    });

    it("should free up seat when employee is removed", async () => {
      const mockResponse = {
        success: true,
        message: "Employee removed successfully",
        data: {
          actions: [
            { action: "user_disconnected", uid: mockUid },
            { action: "seat_freed", count: 1 },
          ],
        },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useRemoveEmployee(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockMessage.success).toHaveBeenCalledWith(
        "Employee removed successfully!"
      );
      expect(mockMessage.info).toHaveBeenCalledWith(
        "Seat count updated: 1 seat freed"
      );
    });

    it("should handle error when cannot remove yourself", async () => {
      const mockError = {
        response: {
          data: {
            message: "Cannot archive yourself",
          },
        },
      };

      mockedUserService.removeUser.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useRemoveEmployee(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockMessage.error).toHaveBeenCalledWith(
        "You cannot remove yourself"
      );
    });

    it("should handle generic removal errors", async () => {
      const mockError = {
        response: {
          data: {
            message: "Database error",
          },
        },
      };

      mockedUserService.removeUser.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useRemoveEmployee(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockMessage.error).toHaveBeenCalledWith("Database error");
    });

    it("should invalidate employee queries on success", async () => {
      const mockResponse = {
        success: true,
        message: "Employee removed successfully",
        data: { actions: [] },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const invalidateQueriesSpy = jest.spyOn(
        queryClient,
        "invalidateQueries"
      );

      const { result } = renderHook(
        () => useRemoveEmployee(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["clientUsers", mockCuid],
      });
    });
  });

  describe("useReconnectEmployee", () => {
    it("should reconnect employee successfully", async () => {
      const mockResponse = {
        success: true,
        message: "Employee reconnected successfully",
        data: {
          uid: mockUid,
          isConnected: true,
        },
      };

      mockedUserService.reconnectUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useReconnectEmployee(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserService.reconnectUser).toHaveBeenCalledWith(
        mockCuid,
        mockUid
      );
      expect(mockMessage.success).toHaveBeenCalledWith(
        "Employee reconnected successfully!"
      );
    });

    it("should update seat count when employee is reconnected", async () => {
      const mockResponse = {
        success: true,
        message: "Employee reconnected successfully",
        data: {
          uid: mockUid,
          isConnected: true,
          actions: [{ action: "seat_occupied", count: 1 }],
        },
      };

      mockedUserService.reconnectUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useReconnectEmployee(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockMessage.success).toHaveBeenCalledWith(
        "Employee reconnected successfully!"
      );
      expect(mockMessage.info).toHaveBeenCalledWith(
        "Seat count updated: 1 seat occupied"
      );
    });

    it("should handle reconnect errors", async () => {
      const mockError = {
        response: {
          data: {
            message: "User already connected",
          },
        },
      };

      mockedUserService.reconnectUser.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useReconnectEmployee(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockMessage.error).toHaveBeenCalledWith("User already connected");
    });

    it("should invalidate queries on successful reconnect", async () => {
      const mockResponse = {
        success: true,
        message: "Employee reconnected successfully",
        data: { uid: mockUid, isConnected: true },
      };

      mockedUserService.reconnectUser.mockResolvedValue(mockResponse);

      const invalidateQueriesSpy = jest.spyOn(
        queryClient,
        "invalidateQueries"
      );

      const { result } = renderHook(
        () => useReconnectEmployee(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["clientUsers", mockCuid],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["subscriptionUsage", mockCuid],
      });
    });
  });
});
