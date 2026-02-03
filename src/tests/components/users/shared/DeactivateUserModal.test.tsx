import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DeactivateUserModal } from "@components/UserManagement/DeactivateUserModal";

describe("DeactivateUserModal", () => {
  const defaultProps = {
    isOpen: true,
    userName: "John Doe",
    userType: "employee" as const,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render modal when isOpen is true", () => {
      render(<DeactivateUserModal {...defaultProps} />);

      expect(
        screen.getByText(/are you sure you want to remove john doe/i)
      ).toBeInTheDocument();
    });

    it("should not render modal when isOpen is false", () => {
      render(<DeactivateUserModal {...defaultProps} isOpen={false} />);

      expect(
        screen.queryByText(/are you sure you want to remove/i)
      ).not.toBeInTheDocument();
    });

    it("should display user name in modal", () => {
      render(<DeactivateUserModal {...defaultProps} userName="Jane Smith" />);

      expect(
        screen.getByText(/are you sure you want to remove jane smith/i)
      ).toBeInTheDocument();
    });
  });

  describe("User Type Specific Content", () => {
    it("should show employee-specific actions", () => {
      render(<DeactivateUserModal {...defaultProps} userType="employee" />);

      expect(screen.getByText(/free up 1 seat/i)).toBeInTheDocument();
      expect(screen.getByText(/disconnect them from this client/i)).toBeInTheDocument();
    });

    it("should show tenant-specific actions", () => {
      render(<DeactivateUserModal {...defaultProps} userType="tenant" />);

      expect(screen.getByText(/validate no active leases exist/i)).toBeInTheDocument();
      expect(screen.getByText(/disconnect them from this client/i)).toBeInTheDocument();
    });

    it("should show vendor-specific actions", () => {
      render(<DeactivateUserModal {...defaultProps} userType="vendor" />);

      expect(screen.getByText(/disconnect them from this client/i)).toBeInTheDocument();
      expect(screen.queryByText(/free up 1 seat/i)).not.toBeInTheDocument();
    });

    it("should show common actions for all user types", () => {
      const userTypes = ["employee", "tenant", "vendor"] as const;

      userTypes.forEach((userType) => {
        const { unmount } = render(
          <DeactivateUserModal {...defaultProps} userType={userType} />
        );

        expect(
          screen.getByText(/mark their account as inactive/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/preserve all their data for compliance/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/they will not be able to login/i)
        ).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe("Warnings", () => {
    it("should display warnings when provided", () => {
      const warnings = [
        "This is a primary vendor account.",
        "Removing will also disconnect linked accounts.",
      ];

      render(<DeactivateUserModal {...defaultProps} warnings={warnings} />);

      warnings.forEach((warning) => {
        expect(screen.getByText(warning)).toBeInTheDocument();
      });
    });

    it("should apply warning styling when warnings present", () => {
      const warnings = ["Warning message"];

      render(
        <DeactivateUserModal {...defaultProps} warnings={warnings} />
      );

      const warningElement = screen.getByText("Warning message");
      expect(warningElement).toHaveClass("text-orange-600");
    });

    it("should not show warnings section when warnings array is empty", () => {
      render(<DeactivateUserModal {...defaultProps} warnings={[]} />);

      const actionsList = screen.queryAllByRole("listitem");
      const warningItems = actionsList.filter((item) =>
        item.classList.contains("text-orange-600")
      );
      expect(warningItems).toHaveLength(0);
    });
  });

  describe("Error Handling", () => {
    it("should display error message when provided", () => {
      const errorMessage = "Cannot remove tenant with active lease";

      render(
        <DeactivateUserModal {...defaultProps} errorMessage={errorMessage} />
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should show error action button when error action provided", () => {
      const errorAction = {
        label: "View Leases",
        onClick: jest.fn(),
      };

      render(
        <DeactivateUserModal
          {...defaultProps}
          errorMessage="Active lease error"
          errorAction={errorAction}
        />
      );

      const errorButton = screen.getByText("View Leases");
      expect(errorButton).toBeInTheDocument();

      fireEvent.click(errorButton);
      expect(errorAction.onClick).toHaveBeenCalledTimes(1);
    });

    it("should hide confirm button when error message present", () => {
      render(
        <DeactivateUserModal
          {...defaultProps}
          errorMessage="Some error occurred"
        />
      );

      expect(screen.queryByText(/yes, remove/i)).not.toBeInTheDocument();
    });

    it("should show confirm button when no error message", () => {
      render(<DeactivateUserModal {...defaultProps} />);

      expect(screen.getByText(/yes, remove/i)).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("should call onConfirm when confirm button is clicked", () => {
      render(<DeactivateUserModal {...defaultProps} />);

      const confirmButton = screen.getByText(/yes, remove/i);
      fireEvent.click(confirmButton);

      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when cancel button is clicked", () => {
      render(<DeactivateUserModal {...defaultProps} />);

      const cancelButton = screen.getByText(/cancel/i);
      fireEvent.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("should disable confirm button when isSubmitting is true", () => {
      render(<DeactivateUserModal {...defaultProps} isSubmitting={true} />);

      const confirmButton = screen.getByText(/removing/i);
      expect(confirmButton).toBeDisabled();
    });

    it("should show loading text when isSubmitting is true", () => {
      render(<DeactivateUserModal {...defaultProps} isSubmitting={true} />);

      expect(screen.getByText(/removing/i)).toBeInTheDocument();
      expect(screen.queryByText(/yes, remove/i)).not.toBeInTheDocument();
    });

    it("should not be disabled when isSubmitting is false", () => {
      render(<DeactivateUserModal {...defaultProps} isSubmitting={false} />);

      const confirmButton = screen.getByText(/yes, remove/i);
      expect(confirmButton).not.toBeDisabled();
    });
  });

  describe("Modal Title", () => {
    it("should show correct title for employee", () => {
      render(<DeactivateUserModal {...defaultProps} userType="employee" />);

      expect(screen.getByText(/remove employee/i)).toBeInTheDocument();
    });

    it("should show correct title for tenant", () => {
      render(<DeactivateUserModal {...defaultProps} userType="tenant" />);

      expect(screen.getByText(/remove tenant/i)).toBeInTheDocument();
    });

    it("should show correct title for vendor", () => {
      render(<DeactivateUserModal {...defaultProps} userType="vendor" />);

      expect(screen.getByText(/remove vendor/i)).toBeInTheDocument();
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle vendor with warnings and error", () => {
      const warnings = ["Primary vendor with linked accounts"];
      const errorMessage = "Cannot remove primary vendor";
      const errorAction = {
        label: "View Linked Accounts",
        onClick: jest.fn(),
      };

      render(
        <DeactivateUserModal
          {...defaultProps}
          userType="vendor"
          warnings={warnings}
          errorMessage={errorMessage}
          errorAction={errorAction}
        />
      );

      expect(screen.getByText(warnings[0])).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText("View Linked Accounts")).toBeInTheDocument();
      expect(screen.queryByText(/yes, remove/i)).not.toBeInTheDocument();
    });

    it("should handle employee with active submission", () => {
      render(
        <DeactivateUserModal
          {...defaultProps}
          userType="employee"
          isSubmitting={true}
        />
      );

      expect(screen.getByText(/free up 1 seat/i)).toBeInTheDocument();
      expect(screen.getByText(/removing/i)).toBeInTheDocument();

      const confirmButton = screen.getByText(/removing/i);
      expect(confirmButton).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button roles", () => {
      render(<DeactivateUserModal {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should allow keyboard navigation", () => {
      render(<DeactivateUserModal {...defaultProps} />);

      const confirmButton = screen.getByText(/yes, remove/i);
      confirmButton.focus();
      expect(confirmButton).toHaveFocus();
    });
  });
});
