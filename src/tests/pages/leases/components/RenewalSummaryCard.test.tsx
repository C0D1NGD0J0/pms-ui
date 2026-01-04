import React from "react";
import { render, screen } from "@testing-library/react";
import { LeaseDetailData } from "@interfaces/lease.interface";
import { RenewalSummaryCard } from "@app/(protectedRoutes)/leases/[cuid]/components/RenewalSummaryCard";

jest.mock("@utils/dateFormatter", () => ({
  formatDate: jest.fn((date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }),
}));

jest.mock("@utils/currencyMapper", () => ({
  formatCurrency: jest.fn((amount: number, currency: string) => {
    return `${currency} ${amount.toFixed(2)}`;
  }),
}));

const mockRenewalLease: LeaseDetailData = {
  luid: "lease-123",
  tenant: { id: "tenant-123", fullname: "John Doe", email: "john@example.com" },
  property: {
    id: "prop-123",
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postCode: "94102",
      streetNumber: "123",
      fullAddress: "123 Main St, San Francisco, CA 94102"
    }
  },
  duration: { startDate: "2024-01-01", endDate: "2024-12-31", moveInDate: "2024-01-01" },
  fees: {
    monthlyRent: 2000,
    currency: "USD",
    rentDueDay: 1,
    securityDeposit: 2000,
    lateFeeAmount: 100,
    lateFeeDays: 5,
    lateFeeType: "fixed",
    acceptedPaymentMethod: "bank_transfer",
  },
  type: "fixed_term",
  status: "active",
} as LeaseDetailData;

describe("RenewalSummaryCard", () => {
  it("should render renewal lease information", () => {
    render(<RenewalSummaryCard renewalLease={mockRenewalLease} />);

    expect(screen.getByText("Current Lease Summary")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
  });

  it("should display new term dates when provided", () => {
    render(
      <RenewalSummaryCard
        renewalLease={mockRenewalLease}
        newStartDate="2025-01-01"
        newEndDate="2025-12-31"
      />
    );

    expect(screen.getByText(/New Term:/i)).toBeInTheDocument();
  });

  it("should display new rent with increase", () => {
    render(
      <RenewalSummaryCard renewalLease={mockRenewalLease} newRent={2200} />
    );

    expect(screen.getByText(/New Rent:/i)).toBeInTheDocument();
    expect(screen.getByText("USD 2200.00")).toBeInTheDocument();
    expect(screen.getByText(/\+USD 200\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/\+10\.0%/i)).toBeInTheDocument();
  });

  it("should display new rent with decrease", () => {
    render(
      <RenewalSummaryCard renewalLease={mockRenewalLease} newRent={1800} />
    );

    expect(screen.getByText(/USD -200\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/-10\.0%/i)).toBeInTheDocument();
  });

  it("should not display new rent when same as original", () => {
    render(
      <RenewalSummaryCard renewalLease={mockRenewalLease} newRent={2000} />
    );

    expect(screen.queryByText(/New Rent:/i)).not.toBeInTheDocument();
  });

  it("should handle missing tenant", () => {
    const leaseWithoutTenant = {
      ...mockRenewalLease,
      tenant: null,
    } as any;

    render(<RenewalSummaryCard renewalLease={leaseWithoutTenant} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
