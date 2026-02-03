import { userService } from "@services/users";
import { useNotification } from "@hooks/useNotification";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  useReconnectVendor,
  useRemoveVendor,
} from "@app/(protectedRoutes)/users/[cuid]/vendors/hooks/vendorHooks";

jest.mock("@services/users");
jest.mock("@hooks/useNotification");

const mockedUserService = userService as jest.Mocked<typeof userService>;
const mockedUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
>;

describe("Vendor Hooks", () => {
  const mockCuid = "client-123";
  const mockUid = "vendor-456";
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

  describe("useRemoveVendor", () => {
    it("should remove vendor successfully", async () => {
      const mockResponse = {
        success: true,
        message: "Vendor removed successfully",
        data: {
          actions: [{ action: "user_disconnected", uid: mockUid }],
        },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRemoveVendor(mockCuid, mockUid), {
        wrapper,
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserService.removeUser).toHaveBeenCalledWith(
        mockCuid,
        mockUid
      );
      expect(mockMessage.success).toHaveBeenCalledWith(
        "Vendor removed successfully!"
      );
    });

    it("should handle primary vendor with linked accounts", async () => {
      const mockResponse = {
        success: true,
        message: "Vendor removed successfully",
        data: {
          actions: [
            { action: "user_disconnected", uid: mockUid },
            { action: "removed_linked_vendor_accounts", count: 3 },
          ],
        },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRemoveVendor(mockCuid, mockUid), {
        wrapper,
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockMessage.success).toHaveBeenCalledWith(
        "Vendor removed successfully!"
      );
      expect(mockMessage.info).toHaveBeenCalledWith(
        "Primary vendor removed along with 3 linked accounts"
      );
    });

    it("should handle single linked account (singular text)", async () => {
      const mockResponse = {
        success: true,
        message: "Vendor removed successfully",
        data: {
          actions: [
            { action: "user_disconnected", uid: mockUid },
            { action: "removed_linked_vendor_accounts", count: 1 },
          ],
        },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRemoveVendor(mockCuid, mockUid), {
        wrapper,
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockMessage.info).toHaveBeenCalledWith(
        "Primary vendor removed along with 1 linked account"
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

      const { result } = renderHook(() => useRemoveVendor(mockCuid, mockUid), {
        wrapper,
      });

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

      const { result } = renderHook(() => useRemoveVendor(mockCuid, mockUid), {
        wrapper,
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockMessage.error).toHaveBeenCalledWith("Database error");
    });

    it("should invalidate vendor queries on success", async () => {
      const mockResponse = {
        success: true,
        message: "Vendor removed successfully",
        data: { actions: [] },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const invalidateQueriesSpy = jest.spyOn(
        queryClient,
        "invalidateQueries"
      );

      const { result } = renderHook(() => useRemoveVendor(mockCuid, mockUid), {
        wrapper,
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateQueriesSpy).toHaveBeenCalled();
    });
  });

  describe("useReconnectVendor", () => {
    it("should reconnect vendor successfully", async () => {
      const mockResponse = {
        success: true,
        message: "Vendor reconnected successfully",
        data: {
          uid: mockUid,
          isConnected: true,
        },
      };

      mockedUserService.reconnectUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useReconnectVendor(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserService.reconnectUser).toHaveBeenCalledWith(
        mockCuid,
        mockUid
      );
      expect(mockMessage.success).toHaveBeenCalledWith(
        "Vendor reconnected successfully!"
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
        () => useReconnectVendor(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockMessage.error).toHaveBeenCalledWith("User already connected");
    });

    it("should handle generic errors", async () => {
      const mockError = new Error("Network error");

      mockedUserService.reconnectUser.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useReconnectVendor(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockMessage.error).toHaveBeenCalledWith(
        "Failed to reconnect vendor"
      );
    });

    it("should invalidate vendor queries on successful reconnect", async () => {
      const mockResponse = {
        success: true,
        message: "Vendor reconnected successfully",
        data: { uid: mockUid, isConnected: true },
      };

      mockedUserService.reconnectUser.mockResolvedValue(mockResponse);

      const invalidateQueriesSpy = jest.spyOn(
        queryClient,
        "invalidateQueries"
      );

      const { result } = renderHook(
        () => useReconnectVendor(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateQueriesSpy).toHaveBeenCalled();
    });
  });
});
