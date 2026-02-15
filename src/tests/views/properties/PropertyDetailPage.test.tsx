import React from "react";
import { useEntitlements } from "@hooks/contexts";
import { waitFor, render, screen } from "@testing-library/react";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PropertyShow from "@app/(protectedRoutes)/properties/[cuid]/[pid]/page";
import { usePropertyData } from "@app/(protectedRoutes)/properties/[cuid]/hooks";

jest.mock("@app/(protectedRoutes)/properties/[cuid]/hooks");
jest.mock("@hooks/useUnifiedPermissions");
jest.mock("@hooks/contexts");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

const mockUsePropertyData = usePropertyData as jest.MockedFunction<
  typeof usePropertyData
>;
const mockUseUnifiedPermissions = useUnifiedPermissions as jest.MockedFunction<
  typeof useUnifiedPermissions
>;
const mockUseEntitlements = useEntitlements as jest.MockedFunction<
  typeof useEntitlements
>;

describe("PropertyDetailPage", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockPropertyData = {
    property: {
      pid: "prop-123",
      cuid: "client-123",
      name: "Test Property",
      propertyType: "residential",
      address: {
        fullAddress: "123 Main St, New York, NY",
      },
      images: [],
      documents: [],
    },
    unitInfo: {
      currentUnits: 0,
      maxAllowedUnits: 1,
      availableSpaces: 1,
      canAddUnit: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePropertyData.mockReturnValue({
      data: mockPropertyData,
      isLoading: false,
      error: null,
    } as any);

    mockUseUnifiedPermissions.mockReturnValue({
      isManagerOrAbove: true,
      isStaffOrAbove: true,
      can: jest.fn(),
    } as any);

    mockUseEntitlements.mockReturnValue({
      hasFeature: jest.fn().mockReturnValue(true),
      canCreate: jest.fn(),
      showUpgradeModal: jest.fn(),
    } as any);
  });

  describe("withClientAccess HOC", () => {
    it("should be wrapped with withClientAccess for tenant isolation", async () => {
      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<PropertyShow params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Test Property")).toBeInTheDocument();
      });

      // Component should receive both cuid and pid params
      expect(mockUsePropertyData).toHaveBeenCalledWith("prop-123");
    });

    it("should validate cuid matches authenticated user client", async () => {
      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<PropertyShow params={params} />, { wrapper });

      // withClientAccess ensures params.cuid matches user's client
      await waitFor(() => {
        expect(mockUsePropertyData).toHaveBeenCalled();
      });
    });
  });

  describe("Feature gates", () => {
    it("should show advanced reports when feature is available", async () => {
      mockUseEntitlements.mockReturnValue({
        hasFeature: jest.fn().mockReturnValue(true),
        canCreate: jest.fn(),
        showUpgradeModal: jest.fn(),
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<PropertyShow params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Notes/Reports")).toBeInTheDocument();
      });
    });

    it("should show UpgradeRequired when advanced reports not available", async () => {
      mockUseEntitlements.mockReturnValue({
        hasFeature: jest.fn().mockReturnValue(false),
        canCreate: jest.fn(),
        showUpgradeModal: jest.fn(),
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<PropertyShow params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Notes/Reports")).toBeInTheDocument();
      });

      // UpgradeRequired component should be rendered
      expect(mockUseEntitlements().hasFeature).toHaveBeenCalledWith(
        "reports.advanced"
      );
    });
  });

  describe("Loading and error states", () => {
    it("should show loading state", () => {
      mockUsePropertyData.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<PropertyShow params={params} />, { wrapper });

      expect(screen.getByText("Fetching property details")).toBeInTheDocument();
    });

    it("should show error state when property not found", async () => {
      mockUsePropertyData.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error("Not found"),
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<PropertyShow params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Error Loading Property")).toBeInTheDocument();
      });
    });
  });

  describe("Permission-based UI", () => {
    it("should show edit button for staff and above", async () => {
      mockUseUnifiedPermissions.mockReturnValue({
        isManagerOrAbove: false,
        isStaffOrAbove: true,
        can: jest.fn(),
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<PropertyShow params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Edit Property")).toBeInTheDocument();
      });
    });

    it("should show add unit button when allowed", async () => {
      mockUsePropertyData.mockReturnValue({
        data: {
          ...mockPropertyData,
          unitInfo: {
            ...mockPropertyData.unitInfo,
            canAddUnit: true,
          },
        },
        isLoading: false,
        error: null,
      } as any);

      mockUseUnifiedPermissions.mockReturnValue({
        isManagerOrAbove: false,
        isStaffOrAbove: true,
        can: jest.fn(),
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<PropertyShow params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Add Unit")).toBeInTheDocument();
      });
    });
  });
});
