import React from "react";
import { IInvitationDocument } from "@src/interfaces";
import { fireEvent, render, screen } from "@testing-library/react";
import { InvitationDetails } from "@app/(auth)/invite/[cuid]/components/InvitationDetails";

// Mock Button component
jest.mock("@components/FormElements", () => ({
  Button: ({ label, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      <span>{label}</span>
    </button>
  ),
}));

const defaultInvitation: IInvitationDocument = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+1234567890",
  },
  status: "pending",
  inviteeEmail: "test@example.com",
  role: "staff",
  invitedBy: {
    fullname: "Admin User",
    email: "admin@example.com",
  },
  clientId: {
    name: "Test Company",
    cuid: "client-123",
  },
  invitationToken: "mock-invitation-token",
  iuid: "invite-123",
  expiresAt: new Date("2024-02-15T10:00:00Z"),
} as IInvitationDocument;

const defaultProps = {
  invitation: defaultInvitation,
  onAccept: jest.fn(),
  onDecline: jest.fn(),
};

describe("InvitationDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render invitation details correctly", () => {
    render(<InvitationDetails {...defaultProps} />);

    expect(screen.getByText("Invited by:")).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Role:")).toBeInTheDocument();
    expect(screen.getByText("staff")).toBeInTheDocument();
    expect(screen.getByText("Organization:")).toBeInTheDocument();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
  });

  it("should call onAccept when accept button is clicked", () => {
    render(<InvitationDetails {...defaultProps} />);

    const acceptButton = screen.getByText("Accept Invitation");
    fireEvent.click(acceptButton);

    expect(defaultProps.onAccept).toHaveBeenCalledTimes(1);
  });

  it("should call onDecline when decline button is clicked", () => {
    render(<InvitationDetails {...defaultProps} />);

    const declineButton = screen.getByText("Decline");
    fireEvent.click(declineButton);

    expect(defaultProps.onDecline).toHaveBeenCalledTimes(1);
  });

  it("should render vendor invitation with company name", () => {
    const vendorInvitation: IInvitationDocument = {
      ...defaultInvitation,
      role: "vendor",
      metadata: {
        vendorInfo: {
          companyName: "Vendor Company LLC",
        },
      },
    };

    const props = {
      ...defaultProps,
      invitation: vendorInvitation,
    };

    render(<InvitationDetails {...props} />);

    expect(screen.getByText("vendor")).toBeInTheDocument();
    expect(screen.getByText("Vendor Company LLC")).toBeInTheDocument();
  });

  it("should render expected start date when provided", () => {
    const invitationWithStartDate: IInvitationDocument = {
      ...defaultInvitation,
      metadata: {
        expectedStartDate: new Date("2024-03-01T09:00:00Z"),
      },
    };

    const props = {
      ...defaultProps,
      invitation: invitationWithStartDate,
    };

    render(<InvitationDetails {...props} />);

    expect(screen.getByText("Expected Start:")).toBeInTheDocument();
    expect(screen.getByText("March 1, 2024")).toBeInTheDocument();
  });

  it("should handle invitation without expected start date", () => {
    render(<InvitationDetails {...defaultProps} />);

    expect(screen.queryByText("Expected Start:")).not.toBeInTheDocument();
  });

  it("should display role badge with correct styling", () => {
    render(<InvitationDetails {...defaultProps} />);

    const roleBadge = screen.getByText("staff");
    expect(roleBadge).toHaveClass("role-badge");
  });

  it("should handle invitation with different roles", () => {
    const adminInvitation = {
      ...defaultProps,
      invitation: {
        ...defaultInvitation,
        role: "admin" as any,
      },
    };

    render(<InvitationDetails {...adminInvitation} />);

    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("should fallback to 'Organization' when no client name is provided", () => {
    const invitationNoClient = {
      ...defaultProps,
      invitation: {
        ...defaultInvitation,
        clientId: {} as Record<string, any>,
      },
    };

    render(<InvitationDetails {...invitationNoClient} />);

    expect(screen.getByText("Organization")).toBeInTheDocument();
  });

  it("should render buttons with correct class names", () => {
    render(<InvitationDetails {...defaultProps} />);

    const acceptButton = screen
      .getByText("Accept Invitation")
      .closest("button");
    const declineButton = screen.getByText("Decline").closest("button");

    expect(acceptButton).toHaveClass("btn-primary");
    expect(declineButton).toHaveClass("btn-outline");
  });

  it("should format start date correctly for different dates", () => {
    const invitationWithDifferentDate: IInvitationDocument = {
      ...defaultInvitation,
      metadata: {
        expectedStartDate: new Date("2024-12-25T12:00:00Z"),
      },
    };

    const props = {
      ...defaultProps,
      invitation: invitationWithDifferentDate,
    };

    render(<InvitationDetails {...props} />);

    expect(screen.getByText("December 25, 2024")).toBeInTheDocument();
  });

  it("should handle malformed date gracefully", () => {
    const invitationWithBadDate: IInvitationDocument = {
      ...defaultInvitation,
      metadata: {
        expectedStartDate: new Date("invalid-date"),
      },
    };

    const props = {
      ...defaultProps,
      invitation: invitationWithBadDate,
    };

    render(<InvitationDetails {...props} />);

    // Should still render the component without crashing
    expect(screen.getByText("Invited by:")).toBeInTheDocument();
  });

  it("should display invitation card with proper structure", () => {
    render(<InvitationDetails {...defaultProps} />);

    const card = document.querySelector(".invitation-details-card");
    expect(card).toBeInTheDocument();

    const detailRows = document.querySelectorAll(".detail-row");
    expect(detailRows.length).toBeGreaterThanOrEqual(3); // At least invited by, role, organization

    const labels = document.querySelectorAll(".detail-label");
    const values = document.querySelectorAll(".detail-value");
    expect(labels.length).toEqual(values.length);
  });
});
