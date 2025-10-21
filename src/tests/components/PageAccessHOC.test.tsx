import React from "react";
import "@testing-library/jest-dom";
import { usePathname, useRouter } from "next/navigation";
import { waitFor, render, screen } from "@testing-library/react";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { IUnifiedPermissions } from "@interfaces/permission.interface";
import { withPageAccess, usePageAccess } from "@components/PageAccessHOC";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock useUnifiedPermissions hook
jest.mock("@hooks/useUnifiedPermissions");

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseUnifiedPermissions = useUnifiedPermissions as jest.MockedFunction<
  typeof useUnifiedPermissions
>;

describe("PageAccessHOC", () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  const defaultPermissions: Partial<IUnifiedPermissions> = {
    canAccessPage: jest.fn(() => true),
    isAuthenticated: jest.fn(() => true),
    currentRole: "admin",
    isAdmin: true,
    isStaffOrAbove: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as any);
    mockUsePathname.mockReturnValue("/test-route");
    mockUseUnifiedPermissions.mockReturnValue(
      defaultPermissions as IUnifiedPermissions
    );
  });

  describe("withPageAccess HOC", () => {
    const TestComponent = () => <div>Protected Content</div>;
    TestComponent.displayName = "TestComponent";

    it("should render component when user has route-based access", async () => {
      const ProtectedComponent = withPageAccess(TestComponent);

      render(<ProtectedComponent />);

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });

    it("should show loading state initially", () => {
      const ProtectedComponent = withPageAccess(TestComponent);

      render(<ProtectedComponent />);

      expect(screen.getByText("Checking permissions...")).toBeInTheDocument();
    });

    it("should show default unauthorized message when access denied", async () => {
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canAccessPage: jest.fn(() => false),
      } as IUnifiedPermissions);

      const ProtectedComponent = withPageAccess(TestComponent);

      render(<ProtectedComponent />);

      await waitFor(() => {
        expect(screen.getByText("Access Denied")).toBeInTheDocument();
        expect(
          screen.getByText("You do not have permission to access this page.")
        ).toBeInTheDocument();
      });
    });

    it("should render custom fallback when provided and access denied", async () => {
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canAccessPage: jest.fn(() => false),
      } as IUnifiedPermissions);

      const CustomFallback = () => <div>Custom Access Denied</div>;
      const ProtectedComponent = withPageAccess(TestComponent, {
        fallback: CustomFallback,
      });

      render(<ProtectedComponent />);

      await waitFor(() => {
        expect(screen.getByText("Custom Access Denied")).toBeInTheDocument();
      });
    });

    it("should redirect when redirectTo is provided and access denied", async () => {
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canAccessPage: jest.fn(() => false),
      } as IUnifiedPermissions);

      const ProtectedComponent = withPageAccess(TestComponent, {
        redirectTo: "/dashboard",
      });

      render(<ProtectedComponent />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("should show custom loading message when provided", () => {
      const ProtectedComponent = withPageAccess(TestComponent, {
        loadingMessage: "Verifying access...",
      });

      render(<ProtectedComponent />);

      expect(screen.getByText("Verifying access...")).toBeInTheDocument();
    });

    it("should bypass permission check when bypassPermissionCheck is true", async () => {
      const ProtectedComponent = withPageAccess(TestComponent, {
        bypassPermissionCheck: true,
      });

      render(<ProtectedComponent />);

      await waitFor(() => {
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });

    it("should deny access when user is not authenticated", async () => {
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        isAuthenticated: jest.fn(() => false),
      } as IUnifiedPermissions);

      const ProtectedComponent = withPageAccess(TestComponent);

      render(<ProtectedComponent />);

      await waitFor(() => {
        expect(screen.getByText("Access Denied")).toBeInTheDocument();
      });
    });

    describe("requiredPermission option", () => {
      it("should grant access when requiredPermission returns true", async () => {
        const ProtectedComponent = withPageAccess(TestComponent, {
          requiredPermission: (p) => p.isAdmin === true,
        });

        render(<ProtectedComponent />);

        await waitFor(() => {
          expect(screen.getByText("Protected Content")).toBeInTheDocument();
        });
      });

      it("should deny access when requiredPermission returns false", async () => {
        mockUseUnifiedPermissions.mockReturnValue({
          ...defaultPermissions,
          isAdmin: false,
        } as IUnifiedPermissions);

        const ProtectedComponent = withPageAccess(TestComponent, {
          requiredPermission: (p) => p.isAdmin === true,
        });

        render(<ProtectedComponent />);

        await waitFor(() => {
          expect(screen.getByText("Access Denied")).toBeInTheDocument();
        });
      });

      it("should use requiredPermission with isStaffOrAbove", async () => {
        mockUseUnifiedPermissions.mockReturnValue({
          ...defaultPermissions,
          isStaffOrAbove: true,
        } as IUnifiedPermissions);

        const ProtectedComponent = withPageAccess(TestComponent, {
          requiredPermission: (p) => p.isStaffOrAbove === true,
        });

        render(<ProtectedComponent />);

        await waitFor(() => {
          expect(screen.getByText("Protected Content")).toBeInTheDocument();
        });
      });

      it("should use requiredPermission with can() function", async () => {
        const canMock = jest.fn(() => true);
        mockUseUnifiedPermissions.mockReturnValue({
          ...defaultPermissions,
          can: canMock,
        } as any);

        const ProtectedComponent = withPageAccess(TestComponent, {
          requiredPermission: (p) => p.can("user.create"),
        });

        render(<ProtectedComponent />);

        await waitFor(() => {
          expect(screen.getByText("Protected Content")).toBeInTheDocument();
          expect(canMock).toHaveBeenCalledWith("user.create");
        });
      });

      it("should use requiredPermission with combined checks", async () => {
        const canViewUsers = jest.fn(() => true);
        mockUseUnifiedPermissions.mockReturnValue({
          ...defaultPermissions,
          isManagerOrAbove: true,
          canViewUsers,
        } as any);

        const ProtectedComponent = withPageAccess(TestComponent, {
          requiredPermission: (p) =>
            p.isManagerOrAbove && p.canViewUsers(),
        });

        render(<ProtectedComponent />);

        await waitFor(() => {
          expect(screen.getByText("Protected Content")).toBeInTheDocument();
        });
      });

      it("should use requiredPermission instead of route-based check", async () => {
        const canAccessPageMock = jest.fn(() => false);
        mockUseUnifiedPermissions.mockReturnValue({
          ...defaultPermissions,
          canAccessPage: canAccessPageMock,
          isAdmin: true,
        } as IUnifiedPermissions);

        const ProtectedComponent = withPageAccess(TestComponent, {
          requiredPermission: (p) => p.isAdmin === true,
        });

        render(<ProtectedComponent />);

        await waitFor(() => {
          expect(screen.getByText("Protected Content")).toBeInTheDocument();
          // canAccessPage should not be called when requiredPermission is provided
          expect(canAccessPageMock).not.toHaveBeenCalled();
        });
      });
    });

    it("should use custom route override", async () => {
      const canAccessPageMock = jest.fn(() => true);
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canAccessPage: canAccessPageMock,
      } as IUnifiedPermissions);

      const ProtectedComponent = withPageAccess(TestComponent, {
        route: "/custom-route",
      });

      render(<ProtectedComponent />);

      await waitFor(() => {
        expect(canAccessPageMock).toHaveBeenCalledWith("/custom-route");
      });
    });
  });

  describe("usePageAccess hook", () => {
    const TestComponentWithHook = ({
      route,
      requiredPermission,
    }: {
      route?: string;
      requiredPermission?: (permissions: IUnifiedPermissions) => boolean;
    }) => {
      const { hasAccess, isLoading, routeChecked } = usePageAccess({
        route,
        requiredPermission,
      });

      if (isLoading) return <div>Loading...</div>;
      if (!hasAccess) return <div>No Access</div>;
      return <div>Has Access to {routeChecked}</div>;
    };

    it("should return hasAccess true when user has route access", async () => {
      render(<TestComponentWithHook />);

      await waitFor(() => {
        expect(
          screen.getByText("Has Access to /test-route")
        ).toBeInTheDocument();
      });
    });

    it("should return hasAccess false when user lacks access", async () => {
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        canAccessPage: jest.fn(() => false),
      } as IUnifiedPermissions);

      render(<TestComponentWithHook />);

      await waitFor(() => {
        expect(screen.getByText("No Access")).toBeInTheDocument();
      });
    });

    it("should use custom route", async () => {
      render(<TestComponentWithHook route="/custom" />);

      await waitFor(() => {
        expect(screen.getByText("Has Access to /custom")).toBeInTheDocument();
      });
    });

    it("should use requiredPermission function", async () => {
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        isAdmin: true,
      } as IUnifiedPermissions);

      render(
        <TestComponentWithHook
          requiredPermission={(p) => p.isAdmin === true}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText("Has Access to /test-route")
        ).toBeInTheDocument();
      });
    });

    it("should deny access when requiredPermission returns false", async () => {
      mockUseUnifiedPermissions.mockReturnValue({
        ...defaultPermissions,
        isAdmin: false,
      } as IUnifiedPermissions);

      render(
        <TestComponentWithHook
          requiredPermission={(p) => p.isAdmin === true}
        />
      );

      await waitFor(() => {
        expect(screen.getByText("No Access")).toBeInTheDocument();
      });
    });
  });
});
