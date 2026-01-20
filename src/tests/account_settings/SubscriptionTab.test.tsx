import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { SubscriptionTab } from "@app/(protectedRoutes)/client/[cuid]/account_settings/components/tabs/SubscriptionTab";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { useGetSubscriptionPlans } from "@app/(auth)/register/hook/queries/useGetSubscriptionPlans";
import { IClient } from "@interfaces/client.interface";

// Mock hooks
jest.mock("@hooks/useUnifiedPermissions");
jest.mock("@app/(auth)/register/hook/queries/useGetSubscriptionPlans");

const mockUseUnifiedPermissions = useUnifiedPermissions as jest.MockedFunction<
  typeof useUnifiedPermissions
>;
const mockUseGetSubscriptionPlans = useGetSubscriptionPlans as jest.MockedFunction<
  typeof useGetSubscriptionPlans
>;

describe("SubscriptionTab", () => {
  const mockClientInfo: IClient = {
    cuid: "TEST123",
    displayName: "Test Company",
    accountType: {
      planId: "prof-plan",
      planName: "Professional",
      isEnterpriseAccount: false,
    },
    identification: {
      idType: "",
      dataProcessingConsent: true,
    },
    subscription: {
      planName: "professional",
      status: "active",
      currentProperties: 12,
      currentUnits: 50,
      currentSeats: 8,
      billingCycle: "monthly",
      nextBillingDate: "2025-02-15",
      amount: 79,
      paymentMethod: {
        type: "Visa",
        last4: "4242",
        expiry: "12/2026",
      },
    },
    isVerified: true,
    accountAdmin: {
      id: "admin123",
      email: "admin@test.com",
      profile: {
        firstName: "John",
        lastName: "Doe",
        displayName: "John Doe",
      },
    },
    companyProfile: {
      contactInfo: {},
    },
    settings: {
      notificationPreferences: {
        email: true,
        sms: false,
        inApp: true,
      },
      timeZone: "UTC",
      lang: "en",
    },
    clientStats: {
      totalUsers: 8,
      totalProperties: 12,
    },
    id: "client123",
    verifiedBy: "system",
  };

  const mockPlansData = [
    {
      planName: "starter",
      name: "Starter",
      description: "For small landlords",
      displayOrder: 1,
      isFeatured: false,
      ctaText: "Get Started",
      featureList: ["Up to 5 properties", "2 team members", "Basic reporting"],
      trialDays: 0,
      priceInCents: 2900,
      transactionFeePercent: 0,
      isCustomPricing: false,
      seatPricing: {
        includedSeats: 2,
        additionalSeatPriceCents: 500,
        maxAdditionalSeats: 5,
      },
      limits: {
        maxProperties: 5,
        maxUnits: 20,
        maxVendors: 10,
      },
      features: {},
      pricing: {
        monthly: {
          priceId: "price_starter_monthly",
          priceInCents: 2900,
          displayPrice: "$29",
          lookUpKey: "starter_monthly",
        },
        annual: {
          priceId: "price_starter_annual",
          priceInCents: 27840,
          displayPrice: "$23.20",
          savingsPercent: 20,
          savingsDisplay: "Save 20%",
          lookUpKey: "starter_annual",
        },
      },
    },
    {
      planName: "professional",
      name: "Professional",
      description: "Most popular choice",
      displayOrder: 2,
      isFeatured: true,
      ctaText: "Start Trial",
      featureList: [
        "Up to 25 properties",
        "10 team members",
        "Advanced reporting",
        "Priority support",
      ],
      disabledFeatures: ["White-label branding"],
      trialDays: 14,
      priceInCents: 7900,
      transactionFeePercent: 0,
      isCustomPricing: false,
      seatPricing: {
        includedSeats: 10,
        additionalSeatPriceCents: 800,
        maxAdditionalSeats: 50,
      },
      limits: {
        maxProperties: 25,
        maxUnits: 100,
        maxVendors: 50,
      },
      features: {},
      pricing: {
        monthly: {
          priceId: "price_prof_monthly",
          priceInCents: 7900,
          displayPrice: "$79",
          lookUpKey: "prof_monthly",
        },
        annual: {
          priceId: "price_prof_annual",
          priceInCents: 75840,
          displayPrice: "$63.20",
          savingsPercent: 20,
          savingsDisplay: "Save 20%",
          lookUpKey: "prof_annual",
        },
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Access Control", () => {
    it("should show access restricted message for non-super-admins", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        isSuperAdmin: false,
        isAdmin: false,
        isManager: false,
        currentRole: null,
        canCreate: jest.fn(),
        canRead: jest.fn(),
        canUpdate: jest.fn(),
        canDelete: jest.fn(),
        hasRole: jest.fn(),
      });

      mockUseGetSubscriptionPlans.mockReturnValue({
        data: mockPlansData,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<SubscriptionTab clientInfo={mockClientInfo} inEditmode={false} />);

      expect(screen.getByText("Access Restricted")).toBeInTheDocument();
      expect(
        screen.getByText(/Only account owners can manage subscription and billing details/)
      ).toBeInTheDocument();
    });

    it("should show access restricted message when subscription data is missing", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        isSuperAdmin: true,
        isAdmin: true,
        isManager: false,
        currentRole: 6,
        canCreate: jest.fn(),
        canRead: jest.fn(),
        canUpdate: jest.fn(),
        canDelete: jest.fn(),
        hasRole: jest.fn(),
      });

      mockUseGetSubscriptionPlans.mockReturnValue({
        data: mockPlansData,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const clientWithoutSubscription = { ...mockClientInfo, subscription: undefined };

      render(
        <SubscriptionTab clientInfo={clientWithoutSubscription} inEditmode={false} />
      );

      expect(screen.getByText("Access Restricted")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should show loading state while fetching plans", () => {
      mockUseUnifiedPermissions.mockReturnValue({
        isSuperAdmin: true,
        isAdmin: true,
        isManager: false,
        currentRole: 6,
        canCreate: jest.fn(),
        canRead: jest.fn(),
        canUpdate: jest.fn(),
        canDelete: jest.fn(),
        hasRole: jest.fn(),
      });

      mockUseGetSubscriptionPlans.mockReturnValue({
        data: undefined,
        totalCount: 0,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<SubscriptionTab clientInfo={mockClientInfo} inEditmode={false} />);

      expect(screen.getByText(/Loading subscription plans/)).toBeInTheDocument();
    });
  });

  describe("Subscription Display", () => {
    beforeEach(() => {
      mockUseUnifiedPermissions.mockReturnValue({
        isSuperAdmin: true,
        isAdmin: true,
        isManager: false,
        currentRole: 6,
        canCreate: jest.fn(),
        canRead: jest.fn(),
        canUpdate: jest.fn(),
        canDelete: jest.fn(),
        hasRole: jest.fn(),
      });

      mockUseGetSubscriptionPlans.mockReturnValue({
        data: mockPlansData,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it("should render subscription details for super-admin", async () => {
      render(<SubscriptionTab clientInfo={mockClientInfo} inEditmode={false} />);

      await waitFor(() => {
        expect(screen.getByText("Subscription & Billing")).toBeInTheDocument();
        expect(screen.getByText("Professional")).toBeInTheDocument();
        expect(screen.getByText("Active")).toBeInTheDocument();
      });
    });

    it("should display current plan information", async () => {
      render(<SubscriptionTab clientInfo={mockClientInfo} inEditmode={false} />);

      await waitFor(() => {
        expect(screen.getByText("CURRENT PLAN")).toBeInTheDocument();
        expect(screen.getByText("Professional")).toBeInTheDocument();
        expect(screen.getByText(/month/)).toBeInTheDocument();
      });
    });

    it("should display plan features from server data", async () => {
      render(<SubscriptionTab clientInfo={mockClientInfo} inEditmode={false} />);

      await waitFor(() => {
        expect(screen.getByText("Up to 25 properties")).toBeInTheDocument();
        expect(screen.getByText("10 team members")).toBeInTheDocument();
        expect(screen.getByText("Advanced reporting")).toBeInTheDocument();
      });
    });

    it("should display payment method information", async () => {
      render(<SubscriptionTab clientInfo={mockClientInfo} inEditmode={false} />);

      await waitFor(() => {
        expect(screen.getByText(/4242/)).toBeInTheDocument();
        expect(screen.getByText(/12\/2026/)).toBeInTheDocument();
      });
    });

    it("should display change plan section", async () => {
      render(<SubscriptionTab clientInfo={mockClientInfo} inEditmode={false} />);

      await waitFor(() => {
        expect(screen.getByText("CHANGE PLAN")).toBeInTheDocument();
        expect(screen.getByText("SELECT A PLAN")).toBeInTheDocument();
      });
    });
  });

  describe("Plan Data Integration", () => {
    beforeEach(() => {
      mockUseUnifiedPermissions.mockReturnValue({
        isSuperAdmin: true,
        isAdmin: true,
        isManager: false,
        currentRole: 6,
        canCreate: jest.fn(),
        canRead: jest.fn(),
        canUpdate: jest.fn(),
        canDelete: jest.fn(),
        hasRole: jest.fn(),
      });
    });

    it("should use data from useGetSubscriptionPlans hook", async () => {
      mockUseGetSubscriptionPlans.mockReturnValue({
        data: mockPlansData,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<SubscriptionTab clientInfo={mockClientInfo} inEditmode={false} />);

      await waitFor(() => {
        // Should display plans from server data
        const select = screen.getByRole("combobox");
        expect(select).toBeInTheDocument();
      });
    });

    it("should handle empty plans data gracefully", async () => {
      mockUseGetSubscriptionPlans.mockReturnValue({
        data: [],
        totalCount: 0,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<SubscriptionTab clientInfo={mockClientInfo} inEditmode={false} />);

      await waitFor(() => {
        // Should still render with fallback data
        expect(screen.getByText("Subscription & Billing")).toBeInTheDocument();
      });
    });
  });
});
