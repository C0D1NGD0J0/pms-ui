import React from "react";
import { LeaseDetailData } from "@interfaces/lease.interface";
import { fireEvent, render, screen } from "@testing-library/react";
import { ScheduleRenewalModal } from "@app/(protectedRoutes)/leases/[cuid]/components/ScheduleRenewalModal";

// Mock createPortal to render in the same DOM
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node: any) => node,
}));

jest.mock("@utils/dateFormatter", () => ({
  formatDate: jest.fn((date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }),
}));

const mockRenewalLease: LeaseDetailData = {
  luid: "lease-123",
  leaseNumber: "L-2024-001",
  tenant: { id: "tenant-123", fullname: "John Doe", email: "john@example.com" },
  duration: { startDate: "2024-01-01", endDate: "2024-12-31", moveInDate: "2024-01-01" },
  renewalOptions: {
    autoRenew: true,
    renewalTermMonths: 12,
    noticePeriodDays: 60,
    daysBeforeExpiryToAutoSendSignature: 7,
  },
} as LeaseDetailData;

describe("ScheduleRenewalModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render modal when isOpen is true", () => {
    render(
      <ScheduleRenewalModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        renewalLease={mockRenewalLease}
      />
    );

    expect(screen.getByText("Schedule Lease Renewal")).toBeInTheDocument();
  });

  it("should not render modal when isOpen is false", () => {
    render(
      <ScheduleRenewalModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        renewalLease={mockRenewalLease}
      />
    );

    expect(screen.queryByText("Schedule Lease Renewal")).not.toBeInTheDocument();
  });

  it("should display lease information", () => {
    render(
      <ScheduleRenewalModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        renewalLease={mockRenewalLease}
      />
    );

    expect(screen.getByText("L-2024-001")).toBeInTheDocument();
    expect(screen.getByText(/7 days before the new lease starts/i)).toBeInTheDocument();
  });

  it("should use custom days before expiry", () => {
    const customLease = {
      ...mockRenewalLease,
      renewalOptions: {
        ...mockRenewalLease.renewalOptions,
        daysBeforeExpiryToAutoSendSignature: 14,
      },
    } as LeaseDetailData;

    render(
      <ScheduleRenewalModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        renewalLease={customLease}
      />
    );

    expect(screen.getByText(/14 days before the new lease starts/i)).toBeInTheDocument();
  });

  it("should call onClose when Cancel is clicked", () => {
    render(
      <ScheduleRenewalModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        renewalLease={mockRenewalLease}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirm when Schedule Renewal is clicked", () => {
    render(
      <ScheduleRenewalModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        renewalLease={mockRenewalLease}
      />
    );

    fireEvent.click(screen.getByText("Schedule Renewal"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("should show loading state", () => {
    render(
      <ScheduleRenewalModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        renewalLease={mockRenewalLease}
        isLoading={true}
      />
    );

    expect(screen.getByText("Scheduling...")).toBeInTheDocument();
    expect(screen.getByText("Cancel").closest("button")).toBeDisabled();
  });
});
