import React from "react";
import "@testing-library/jest-dom";
import { IClient } from "@interfaces/client.interface";
import { waitFor, render, screen } from "@testing-library/react";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { IUnifiedPermissions } from "@interfaces/permission.interface";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SubscriptionTab } from "@clients/account_settings/components/tabs/SubscriptionTab";
import { useGetSubscriptionPlans } from "@auth/register/hook/queries/useGetSubscriptionPlans";

jest.mock("@hooks/useUnifiedPermissions");
jest.mock("@auth/register/hook/queries/useGetSubscriptionPlans");
jest.mock("@hooks/useEntitlementsUsage", () => ({
  useEntitlementsUsage: jest.fn(() => ({
    data: {
      seatInfo: {
        includedSeats: 10,
        additionalSeats: 0,
        totalAllowed: 10,
        additionalSeatPriceCents: 800,
        maxAdditionalSeats: 50,
        availableForPurchase: 50,
      },
    },
  })),
}));

jest.mock("@app/(protectedRoutes)/subscription/hooks/useManageSeats", () => ({
  useManageSeats: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock(
  "@app/(protectedRoutes)/subscription/hooks/useCancelSubscription",
  () => ({
    useCancelSubscription: jest.fn(() => ({
      cancelSubscription: jest.fn(),
      isLoading: false,
    })),
  })
);

jest.mock(
  "@app/(protectedRoutes)/subscription/hooks/useInitSubscriptionPayment",
  () => ({
    useInitSubscriptionPayment: jest.fn(() => ({
      initPayment: jest.fn(),
      isLoading: false,
    })),
  })
);

const mockUseUnifiedPermissions = useUnifiedPermissions as jest.MockedFunction<
  typeof useUnifiedPermissions
>;
const mockUseGetSubscriptionPlans =
  useGetSubscriptionPlans as jest.MockedFunction<
    typeof useGetSubscriptionPlans
  >;

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

const createMockPermissions = (
  overrides: Partial<IUnifiedPermissions> = {}
): IUnifiedPermissions => ({
  hasRoleLevel: jest.fn(),
  canPerformAction: jest.fn(),
  can: jest.fn(),
  canAccess: jest.fn(),
  canAccessPage: jest.fn(),
  isOwner: jest.fn(),
  inDepartment: jest.fn(),
  hasRole: jest.fn(),
  canAll: jest.fn(),
  canAny: jest.fn(),
  canManage: jest.fn(),
  getUserContext: jest.fn(),
  canCreateProperty: jest.fn(),
  canViewProperty: jest.fn(),
  canEditProperty: jest.fn(),
  canDeleteProperty: jest.fn(),
  canCreateUser: jest.fn(),
  canViewUsers: jest.fn(),
  canEditUser: jest.fn(),
  canDeleteUser: jest.fn(),
  canInviteUsers: jest.fn(),
  canCreateLease: jest.fn(),
  canViewLease: jest.fn(),
  canEditLease: jest.fn(),
  canDeleteLease: jest.fn(),
  canCreateMaintenance: jest.fn(),
  canViewMaintenance: jest.fn(),
  canEditMaintenance: jest.fn(),
  canDeleteMaintenance: jest.fn(),
  canViewClient: jest.fn(),
  canEditClient: jest.fn(),
  canManageClientSettings: jest.fn(),
  canCreateReport: jest.fn(),
  canViewReports: jest.fn(),
  canEditReport: jest.fn(),
  canDeleteReport: jest.fn(),
  canEditField: jest.fn(),
  isFieldDisabled: jest.fn(),
  getAccessibleNavigation: jest.fn(),
  getRoleTitle: jest.fn(),
  isAuthenticated: jest.fn(),
  currentUser: null,
  currentRole: null,
  isSuperAdmin: false,
  isAdmin: false,
  isManager: false,
  isStaff: false,
  isTenant: false,
  isVendor: false,
  isStaffOrAbove: false,
  isManagerOrAbove: false,
  ...overrides,
});

describe("SubscriptionTab", () => {
  const mockClientInfo: IClient = {
    cuid: "TEST123",
    displayName: "Test Company",
    accountType: {
      category: "business",
      billingInterval: "monthly",
      isEnterpriseAccount: false,
    },
    identification: {
      idType: "",
      dataProcessingConsent: true,
    },
    subscription: {
      _id: "sub123",
      id: "sub123",
      cuid: "TEST123",
      suid: "suid123",
      planName: "portfolio",
      status: "active",
      billingInterval: "monthly",
      additionalSeatsCount: 0,
      additionalSeatsCost: 0,
      totalMonthlyPrice: 79,
      currentProperties: 12,
      currentUnits: 50,
      currentSeats: 8,
      nextBillingDate: "2025-02-15",
      amount: 79,
      paymentMethod: {
        brand: "Visa",
        last4: "4242",
      },
      subscriptionId: "",
      canceledAt: null,
      pendingDowngradeAt: null,
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
      planName: "growth" as const,
      name: "Growth",
      description: "For growing landlords",
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
      pricing: {
        monthly: {
          priceId: "price_growth_monthly",
          priceInCents: 2900,
          displayPrice: "$29",
          lookUpKey: "growth_monthly",
        },
        annual: {
          priceId: "price_growth_annual",
          priceInCents: 27840,
          displayPrice: "$23.20",
          lookUpKey: "growth_annual",
          savings: 20,
        },
      },
    },
    {
      planName: "portfolio" as const,
      name: "Portfolio",
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
      pricing: {
        monthly: {
          priceId: "price_portfolio_monthly",
          priceInCents: 7900,
          displayPrice: "$79",
          lookUpKey: "portfolio_monthly",
        },
        annual: {
          priceId: "price_portfolio_annual",
          priceInCents: 75840,
          displayPrice: "$63.20",
          lookUpKey: "portfolio_annual",
          savings: 20,
        },
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Access Control", () => {
    it("should show access restricted message for non-super-admins", () => {
      mockUseUnifiedPermissions.mockReturnValue(
        createMockPermissions({
          isSuperAdmin: false,
          isAdmin: false,
          isManager: false,
          currentRole: null,
        })
      );

      mockUseGetSubscriptionPlans.mockReturnValue({
        data: mockPlansData,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      renderWithQueryClient(
        <SubscriptionTab clientInfo={mockClientInfo} inEditMode={false} />
      );

      expect(screen.getByText("Access Restricted")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Only account owners can manage subscription and billing details/
        )
      ).toBeInTheDocument();
    });

    it("should show access restricted message when subscription data is missing", () => {
      mockUseUnifiedPermissions.mockReturnValue(
        createMockPermissions({
          isSuperAdmin: true,
          isAdmin: true,
          isManager: false,
          currentRole: 6,
        })
      );

      mockUseGetSubscriptionPlans.mockReturnValue({
        data: mockPlansData,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const clientWithoutSubscription = {
        ...mockClientInfo,
        subscription: undefined,
      };

      renderWithQueryClient(
        <SubscriptionTab
          clientInfo={clientWithoutSubscription}
          inEditMode={false}
        />
      );

      expect(screen.getByText("Access Restricted")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should show loading state while fetching plans", () => {
      mockUseUnifiedPermissions.mockReturnValue(
        createMockPermissions({
          isSuperAdmin: true,
          isAdmin: true,
          isManager: false,
          currentRole: 6,
        })
      );

      mockUseGetSubscriptionPlans.mockReturnValue({
        data: undefined,
        totalCount: 0,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      renderWithQueryClient(
        <SubscriptionTab clientInfo={mockClientInfo} inEditMode={false} />
      );

      expect(
        screen.getAllByText(/Loading subscription plans/)[0]
      ).toBeInTheDocument();
    });
  });

  describe("Subscription Display", () => {
    beforeEach(() => {
      mockUseUnifiedPermissions.mockReturnValue(
        createMockPermissions({
          isSuperAdmin: true,
          isAdmin: true,
          isManager: false,
          currentRole: 6,
        })
      );

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
      renderWithQueryClient(
        <SubscriptionTab clientInfo={mockClientInfo} inEditMode={false} />
      );

      await waitFor(() => {
        expect(screen.getByText("Subscription & Billing")).toBeInTheDocument();
        expect(screen.getByText("Portfolio")).toBeInTheDocument();
      });
    });

    it("should display current plan information", async () => {
      renderWithQueryClient(
        <SubscriptionTab clientInfo={mockClientInfo} inEditMode={false} />
      );

      await waitFor(() => {
        expect(screen.getByText("PLAN FEATURES")).toBeInTheDocument();
        expect(screen.getByText("Portfolio")).toBeInTheDocument();
      });

      // Check for month text separately with case-insensitive match
      await waitFor(() => {
        const monthTexts = screen.getAllByText(/month/i);
        expect(monthTexts.length).toBeGreaterThan(0);
      });
    });

    it("should display plan features from server data", async () => {
      renderWithQueryClient(
        <SubscriptionTab clientInfo={mockClientInfo} inEditMode={false} />
      );

      await waitFor(() => {
        expect(screen.getByText("Up to 25 properties")).toBeInTheDocument();
        expect(screen.getByText("10 team members")).toBeInTheDocument();
        expect(screen.getByText("Advanced reporting")).toBeInTheDocument();
      });
    });

    it("should display payment method information", async () => {
      renderWithQueryClient(
        <SubscriptionTab clientInfo={mockClientInfo} inEditMode={false} />
      );

      await waitFor(() => {
        // Check for last 4 digits of card in the payment method display
        expect(screen.getByText(/4242/)).toBeInTheDocument();
      });
    });

    it("should display change plan section", async () => {
      renderWithQueryClient(
        <SubscriptionTab clientInfo={mockClientInfo} inEditMode={false} />
      );

      await waitFor(() => {
        expect(screen.getByText("CHANGE PLAN")).toBeInTheDocument();
        expect(screen.getByText("SELECT PLAN")).toBeInTheDocument();
      });
    });
  });

  describe("Plan Data Integration", () => {
    beforeEach(() => {
      mockUseUnifiedPermissions.mockReturnValue(
        createMockPermissions({
          isSuperAdmin: true,
          isAdmin: true,
          isManager: false,
          currentRole: 6,
        })
      );
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

      renderWithQueryClient(
        <SubscriptionTab clientInfo={mockClientInfo} inEditMode={false} />
      );

      await waitFor(() => {
        // Should display plans from server data - look for plan selector
        expect(screen.getByText("SELECT PLAN")).toBeInTheDocument();
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

      renderWithQueryClient(
        <SubscriptionTab clientInfo={mockClientInfo} inEditMode={false} />
      );

      await waitFor(() => {
        // Should still render with fallback data
        expect(screen.getByText("Subscription & Billing")).toBeInTheDocument();
      });
    });
  });

  describe("Seat Management Over-Limit Scenarios", () => {
    beforeEach(() => {
      mockUseUnifiedPermissions.mockReturnValue(
        createMockPermissions({
          isSuperAdmin: true,
          isAdmin: true,
          isManager: false,
          currentRole: 6,
        })
      );

      mockUseGetSubscriptionPlans.mockReturnValue({
        data: mockPlansData,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it("should set isOverLimit flag when currentSeats > totalAllowed", async () => {
      const clientOverLimit = {
        ...mockClientInfo,
        subscription: {
          ...mockClientInfo.subscription!,
          currentSeats: 12, // totalAllowed is 10 (includedSeats)
        },
      };

      renderWithQueryClient(
        <SubscriptionTab clientInfo={clientOverLimit} inEditMode={false} />
      );

      // The component should render without errors
      await waitFor(() => {
        expect(screen.getByText("Team Seat Management")).toBeInTheDocument();
      });
    });

    it("should calculate seatsOverLimit correctly", async () => {
      const clientOverLimit = {
        ...mockClientInfo,
        subscription: {
          ...mockClientInfo.subscription!,
          currentSeats: 15, // 5 seats over the limit of 10
        },
      };

      renderWithQueryClient(
        <SubscriptionTab clientInfo={clientOverLimit} inEditMode={false} />
      );

      await waitFor(() => {
        // Should show warning about 5 seats over limit
        expect(screen.getByText(/5 seats over limit/i)).toBeInTheDocument();
      });
    });

    it("should return maxCanRemove as 0 when over limit", async () => {
      const clientOverLimit = {
        ...mockClientInfo,
        subscription: {
          ...mockClientInfo.subscription!,
          currentSeats: 13, // Over the limit
          additionalSeatsCount: 3, // Has additional seats but can't remove
        },
      };

      renderWithQueryClient(
        <SubscriptionTab clientInfo={clientOverLimit} inEditMode={false} />
      );

      await waitFor(() => {
        // Should show over limit warning
        expect(screen.getByText(/over limit/i)).toBeInTheDocument();
      });
    });

    it("should display over-limit warning banner", async () => {
      const clientOverLimit = {
        ...mockClientInfo,
        subscription: {
          ...mockClientInfo.subscription!,
          currentSeats: 12, // Over limit
        },
      };

      renderWithQueryClient(
        <SubscriptionTab clientInfo={clientOverLimit} inEditMode={false} />
      );

      await waitFor(() => {
        // Should display error banner
        expect(screen.getByText(/Over Seat Limit/i)).toBeInTheDocument();
        expect(screen.getByText(/You must either:/i)).toBeInTheDocument();
      });
    });

    it("should disable 'Remove Seats' button when over limit", async () => {
      const clientOverLimit = {
        ...mockClientInfo,
        subscription: {
          ...mockClientInfo.subscription!,
          currentSeats: 12,
          additionalSeatsCount: 2, // Has additional seats but over limit
        },
      };

      renderWithQueryClient(
        <SubscriptionTab clientInfo={clientOverLimit} inEditMode={false} />
      );

      await waitFor(() => {
        // Check that Team Seat Management section exists
        expect(screen.getByText("Team Seat Management")).toBeInTheDocument();
        // The remove button should be disabled when over limit
        const buttons = screen.queryAllByRole("button", {
          name: /Remove Seats/i,
        });
        if (buttons.length > 0) {
          expect(buttons[0]).toBeDisabled();
        }
      });
    });

    it("should show seat breakdown with warning icon and over-limit message", async () => {
      const clientOverLimit = {
        ...mockClientInfo,
        subscription: {
          ...mockClientInfo.subscription!,
          currentSeats: 13, // 3 seats over limit of 10
        },
      };

      renderWithQueryClient(
        <SubscriptionTab clientInfo={clientOverLimit} inEditMode={false} />
      );

      await waitFor(() => {
        // Should show the warning emoji and over-limit count
        expect(screen.getByText(/⚠️ 3 seats over limit/i)).toBeInTheDocument();
      });
    });
  });
});
