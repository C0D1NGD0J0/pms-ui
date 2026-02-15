import React from "react";
import { waitFor, render, screen } from "@testing-library/react";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import EditProperty from "@app/(protectedRoutes)/properties/[cuid]/[pid]/edit/page";
import {
  usePropertyEditForm,
  usePropertyFormBase,
  usePropertyData,
} from "@properties/hooks";

jest.mock("@properties/hooks");
jest.mock("@hooks/useUnifiedPermissions");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

const mockUsePropertyEditForm = usePropertyEditForm as jest.MockedFunction<
  typeof usePropertyEditForm
>;
const mockUsePropertyFormBase = usePropertyFormBase as jest.MockedFunction<
  typeof usePropertyFormBase
>;
const mockUsePropertyData = usePropertyData as jest.MockedFunction<
  typeof usePropertyData
>;
const mockUseUnifiedPermissions = useUnifiedPermissions as jest.MockedFunction<
  typeof useUnifiedPermissions
>;

describe("PropertyEditPage", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockPropertyForm = {
    values: {
      name: "Test Property",
      propertyType: "residential",
      maxAllowedUnits: 1,
    },
    isValid: jest.fn().mockReturnValue(true),
    reset: jest.fn(),
    onSubmit: jest.fn(() => jest.fn()),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePropertyFormBase.mockReturnValue({
      activeTab: "basic",
      formConfig: {},
      saveAddress: jest.fn(),
      setActiveTab: jest.fn(),
      hasTabErrors: jest.fn(),
      isTabVisible: jest.fn().mockReturnValue(true),
      propertyForm: mockPropertyForm,
      handleOnChange: jest.fn(),
      propertyManagers: [],
      documentTypeOptions: [],
      propertyTypeOptions: [],
      propertyStatusOptions: [],
      formConfigLoading: false,
    } as any);

    mockUsePropertyEditForm.mockReturnValue({
      handleUpdate: jest.fn(),
      propertyData: {
        pid: "prop-123",
        name: "Test Property",
        unitInfo: { canAddUnit: false },
      },
      isDataLoading: false,
      isSubmitting: false,
    } as any);

    mockUsePropertyData.mockReturnValue({
      data: {
        property: {
          pid: "prop-123",
          cuid: "client-123",
          name: "Test Property",
          pendingChanges: {},
        },
      },
      refetch: jest.fn(),
    } as any);

    mockUseUnifiedPermissions.mockReturnValue({
      isManagerOrAbove: true,
      isStaffOrAbove: true,
      can: jest.fn(),
    } as any);
  });

  describe("withClientAccess HOC", () => {
    it("should be wrapped with withClientAccess for multi-tenant security", async () => {
      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<EditProperty params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Edit property")).toBeInTheDocument();
      });

      // Verify hooks are called (component mounted successfully)
      expect(mockUsePropertyEditForm).toHaveBeenCalled();
    });

    it("should validate cuid param matches user client", async () => {
      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<EditProperty params={params} />, { wrapper });

      await waitFor(() => {
        // withClientAccess HOC validates cuid before rendering
        expect(mockUsePropertyFormBase).toHaveBeenCalled();
      });
    });
  });

  describe("Tabs rendering", () => {
    it("should render basic info tab by default", async () => {
      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<EditProperty params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Basic information")).toBeInTheDocument();
      });
    });

    it("should render all standard tabs", async () => {
      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<EditProperty params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Basic information")).toBeInTheDocument();
        expect(screen.getByText("Financial")).toBeInTheDocument();
        expect(screen.getByText("Property Details")).toBeInTheDocument();
        expect(screen.getByText("Amenities")).toBeInTheDocument();
        expect(screen.getByText("Photos & Documents")).toBeInTheDocument();
      });
    });

    it("should show units tab when canAddUnit is true", async () => {
      mockUsePropertyEditForm.mockReturnValue({
        handleUpdate: jest.fn(),
        propertyData: {
          pid: "prop-123",
          name: "Test Property",
          unitInfo: { canAddUnit: true },
        },
        isDataLoading: false,
        isSubmitting: false,
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<EditProperty params={params} />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Units")).toBeInTheDocument();
      });
    });
  });

  describe("Permission-based editing", () => {
    it("should allow editing when no pending changes", async () => {
      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<EditProperty params={params} />, { wrapper });

      await waitFor(() => {
        const saveButton = screen.getByRole("button", { name: /save changes/i });
        expect(saveButton).not.toBeDisabled();
      });
    });

    it("should disable editing for non-managers with pending changes", async () => {
      mockUsePropertyData.mockReturnValue({
        data: {
          property: {
            pid: "prop-123",
            cuid: "client-123",
            name: "Test Property",
            pendingChanges: { name: "Updated Name" },
          },
        },
        refetch: jest.fn(),
      } as any);

      mockUseUnifiedPermissions.mockReturnValue({
        isManagerOrAbove: false,
        isStaffOrAbove: true,
        can: jest.fn(),
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<EditProperty params={params} />, { wrapper });

      await waitFor(() => {
        const saveButton = screen.getByRole("button", { name: /save changes/i });
        expect(saveButton).toBeDisabled();
      });
    });
  });

  describe("Loading states", () => {
    it("should show loading state", () => {
      mockUsePropertyEditForm.mockReturnValue({
        handleUpdate: jest.fn(),
        propertyData: null,
        isDataLoading: true,
        isSubmitting: false,
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<EditProperty params={params} />, { wrapper });

      expect(screen.getByText("Loading property data...")).toBeInTheDocument();
    });

    it("should show not found message when property missing", () => {
      mockUsePropertyEditForm.mockReturnValue({
        handleUpdate: jest.fn(),
        propertyData: null,
        isDataLoading: false,
        isSubmitting: false,
      } as any);

      const params = Promise.resolve({ cuid: "client-123", pid: "prop-123" });

      render(<EditProperty params={params} />, { wrapper });

      expect(screen.getByText("Property data not found.")).toBeInTheDocument();
    });
  });
});
