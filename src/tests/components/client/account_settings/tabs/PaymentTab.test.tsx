import React from "react";
import { paymentService } from "@services/payment";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { fireEvent, waitFor, render, screen } from "@testing-library/react";
import { PaymentTab } from "@app/(protectedRoutes)/client/[cuid]/account_settings/components/tabs/PaymentTab";

// Mock dependencies
jest.mock("@services/payment");
jest.mock("@hooks/useCurrentUser");
jest.mock("@hooks/useUnifiedPermissions");

const mockPaymentService = paymentService as jest.Mocked<typeof paymentService>;
const mockUseCurrentUser = useCurrentUser as jest.MockedFunction<
  typeof useCurrentUser
>;
const mockUseUnifiedPermissions =
  useUnifiedPermissions as jest.MockedFunction<typeof useUnifiedPermissions>;

describe("PaymentTab", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUnifiedPermissions.mockReturnValue({
      isSuperAdmin: true,
      isManagerOrAbove: true,
      isStaffOrAbove: true,
      isOwner: jest.fn(),
      can: jest.fn(),
    } as any);
  });

  describe("Permission checks", () => {
    it("should show access restricted for non-super admins", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        isSuperAdmin: false,
        isManagerOrAbove: false,
        isStaffOrAbove: false,
        isOwner: jest.fn(),
        can: jest.fn(),
      } as any);

      mockUseCurrentUser.mockReturnValue({
        user: {
          email: "user@example.com",
          cuid: "test-cuid",
        } as any,
        refreshUser: jest.fn(),
        isLoading: false,
      });

      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      expect(screen.getByText("Access Restricted")).toBeInTheDocument();
      expect(
        screen.getByText("Only account owners can manage payment processing setup.")
      ).toBeInTheDocument();
    });
  });

  describe("No Payment Processor state", () => {
    beforeEach(() => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          email: "user@example.com",
          cuid: "test-cuid",
          paymentProcessor: undefined,
        } as any,
        refreshUser: jest.fn(),
        isLoading: false,
      });
    });

    it("should render enable online payments UI", () => {
      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      expect(screen.getByText("Enable Online Payments")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Connect your payment account to start collecting rent automatically"
        )
      ).toBeInTheDocument();
    });

    it("should show benefits section", () => {
      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      expect(screen.getByText("BENEFITS")).toBeInTheDocument();
      expect(
        screen.getByText("Automatic rent collection on due dates")
      ).toBeInTheDocument();
      expect(screen.getByText("Secure payment processing")).toBeInTheDocument();
    });

    it("should handle enable payments click", async () => {
      mockPaymentService.createConnectAccount.mockResolvedValue({
        success: true,
        data: { accountId: "acct_123" },
      } as any);

      mockPaymentService.getOnboardingLink.mockResolvedValue({
        success: true,
        data: { url: "https://connect.stripe.com/onboarding/123" },
      } as any);

      // Mock window.location.href
      delete (window as any).location;
      (window as any).location = { href: "" };

      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      const enableButton = screen.getByRole("button", {
        name: /Enable Online Payments/i,
      });
      fireEvent.click(enableButton);

      await waitFor(() => {
        expect(mockPaymentService.createConnectAccount).toHaveBeenCalledWith(
          "test-cuid",
          {
            email: "user@example.com",
            country: "US",
            businessType: "company",
          }
        );
      });

      await waitFor(() => {
        expect(mockPaymentService.getOnboardingLink).toHaveBeenCalledWith(
          "test-cuid"
        );
      });

      expect(window.location.href).toBe(
        "https://connect.stripe.com/onboarding/123"
      );
    });

    it("should show error message on failure", async () => {
      mockPaymentService.createConnectAccount.mockRejectedValue(
        new Error("Failed to create account")
      );

      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      const enableButton = screen.getByRole("button", {
        name: /Enable Online Payments/i,
      });
      fireEvent.click(enableButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to setup payment processing/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Needs Onboarding state", () => {
    beforeEach(() => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          email: "user@example.com",
          cuid: "test-cuid",
          paymentProcessor: {
            isSetup: true,
            chargesEnabled: false,
            needsOnboarding: true,
          },
        } as any,
        refreshUser: jest.fn(),
        isLoading: false,
      });
    });

    it("should render verification required UI", () => {
      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      expect(screen.getByText("Verification Required")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Complete account verification to activate payment processing"
        )
      ).toBeInTheDocument();
    });

    it("should show required information section", () => {
      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      expect(screen.getByText("REQUIRED INFORMATION")).toBeInTheDocument();
      expect(screen.getByText("Business information")).toBeInTheDocument();
      expect(screen.getByText("Tax ID (EIN or SSN)")).toBeInTheDocument();
    });

    it("should handle complete verification click", async () => {
      mockPaymentService.getOnboardingLink.mockResolvedValue({
        success: true,
        data: { url: "https://connect.stripe.com/onboarding/123" },
      } as any);

      delete (window as any).location;
      (window as any).location = { href: "" };

      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      const verifyButton = screen.getByRole("button", {
        name: /Complete Verification/i,
      });
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockPaymentService.getOnboardingLink).toHaveBeenCalledWith(
          "test-cuid"
        );
      });

      expect(window.location.href).toBe(
        "https://connect.stripe.com/onboarding/123"
      );
    });
  });

  describe("Active Payment Processor state", () => {
    beforeEach(() => {
      mockUseCurrentUser.mockReturnValue({
        user: {
          email: "user@example.com",
          cuid: "test-cuid",
          paymentProcessor: {
            isSetup: true,
            chargesEnabled: true,
            needsOnboarding: false,
          },
        } as any,
        refreshUser: jest.fn(),
        isLoading: false,
      });
    });

    it("should render active status UI", () => {
      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      expect(screen.getByText("Payment Processing Active")).toBeInTheDocument();
      expect(
        screen.getByText("Ready to collect rent from tenants")
      ).toBeInTheDocument();
    });

    it("should show capabilities section", () => {
      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      expect(screen.getByText("CAPABILITIES")).toBeInTheDocument();
      expect(screen.getByText("KYC Verified")).toBeInTheDocument();
      expect(screen.getByText("Charges Enabled")).toBeInTheDocument();
      expect(screen.getByText("Payouts Ready")).toBeInTheDocument();
    });

    it("should handle view dashboard click", async () => {
      mockPaymentService.getDashboardLink.mockResolvedValue({
        success: true,
        data: { url: "https://connect.stripe.com/express/dashboard" },
      } as any);

      const mockOpen = jest.fn();
      window.open = mockOpen;

      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      const dashboardButton = screen.getByRole("button", {
        name: /View Payment Dashboard/i,
      });
      fireEvent.click(dashboardButton);

      await waitFor(() => {
        expect(mockPaymentService.getDashboardLink).toHaveBeenCalledWith(
          "test-cuid"
        );
      });

      expect(mockOpen).toHaveBeenCalledWith(
        "https://connect.stripe.com/express/dashboard",
        "_blank",
        "noopener,noreferrer"
      );
    });

    it("should show update account button", () => {
      render(<PaymentTab cuid="test-cuid" />, { wrapper });

      expect(
        screen.getByRole("button", { name: /Update Account/i })
      ).toBeInTheDocument();
    });
  });
});
