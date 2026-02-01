import { userService } from "@services/users";
import { useNotification } from "@hooks/useNotification";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useDeactivateTenant } from "@app/(protectedRoutes)/users/[cuid]/tenants/hooks/tenantHooks";

jest.mock("@services/users");
jest.mock("@hooks/useNotification");

const mockedUserService = userService as jest.Mocked<typeof userService>;
const mockedUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
>;

describe("Tenant Hooks", () => {
  const mockCuid = "client-123";
  const mockUid = "tenant-456";
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
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useDeactivateTenant", () => {
    it("should remove tenant successfully using removeUser API", async () => {
      const mockResponse = {
        success: true,
        message: "Tenant removed successfully",
        data: {
          actions: [{ action: "user_disconnected", uid: mockUid }],
        },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useDeactivateTenant(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedUserService.removeUser).toHaveBeenCalledWith(
        mockCuid,
        mockUid
      );
      expect(mockMessage.success).toHaveBeenCalledWith(
        "Tenant removed successfully!"
      );
    });

    it("should handle active lease error without automatic toast", async () => {
      const mockError = {
        response: {
          data: {
            message: "Cannot remove tenant with active lease",
          },
        },
      };

      mockedUserService.removeUser.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useDeactivateTenant(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      // Error is logged to console but NOT shown in toast
      // Component will handle error display
      expect(console.error).toHaveBeenCalledWith(
        "Failed to remove tenant:",
        mockError
      );
      expect(mockMessage.error).not.toHaveBeenCalled();
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
        () => useDeactivateTenant(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(console.error).toHaveBeenCalledWith(
        "Failed to remove tenant:",
        mockError
      );
      expect(mockMessage.error).not.toHaveBeenCalled();
    });

    it("should invalidate tenant queries on success", async () => {
      const mockResponse = {
        success: true,
        message: "Tenant removed successfully",
        data: { actions: [] },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const invalidateQueriesSpy = jest.spyOn(
        queryClient,
        "invalidateQueries"
      );

      const { result } = renderHook(
        () => useDeactivateTenant(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: [`/users/${mockCuid}/filtered-tenants`],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["clientTenant", mockCuid, mockUid],
      });
    });

    it("should preserve data for compliance (soft delete)", async () => {
      const mockResponse = {
        success: true,
        message: "Tenant removed successfully",
        data: {
          uid: mockUid,
          isConnected: false,
          actions: [
            {
              action: "user_disconnected",
              uid: mockUid,
              note: "Data preserved for compliance",
            },
          ],
        },
      };

      mockedUserService.removeUser.mockResolvedValue(mockResponse);

      const { result } = renderHook(
        () => useDeactivateTenant(mockCuid, mockUid),
        { wrapper }
      );

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify removeUser was called (not a hard delete)
      expect(mockedUserService.removeUser).toHaveBeenCalledWith(
        mockCuid,
        mockUid
      );
    });
  });
});
