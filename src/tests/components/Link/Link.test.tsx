import React from "react";
import { Link } from "@components/Link";
import { useEntitlements } from "@hooks/contexts";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@hooks/contexts");

const mockUseEntitlements = useEntitlements as jest.MockedFunction<
  typeof useEntitlements
>;

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("Link Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEntitlements.mockReturnValue({
      hasFeature: jest.fn().mockReturnValue(true),
      canCreate: jest.fn().mockReturnValue(true),
      showUpgradeModal: jest.fn(),
    } as any);
  });

  describe("Basic functionality", () => {
    it("should render internal links", () => {
      render(<Link href="/test">Test Link</Link>);

      const link = screen.getByText("Test Link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("should render external links", () => {
      render(
        <Link href="https://example.com" target="_blank">
          External Link
        </Link>
      );

      const link = screen.getByText("External Link");
      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should handle mailto links", () => {
      render(<Link href="mailto:test@example.com">Email Link</Link>);

      const link = screen.getByText("Email Link");
      expect(link).toHaveAttribute("href", "mailto:test@example.com");
    });

    it("should handle tel links", () => {
      render(<Link href="tel:+1234567890">Phone Link</Link>);

      const link = screen.getByText("Phone Link");
      expect(link).toHaveAttribute("href", "tel:+1234567890");
    });
  });

  describe("Feature requirements", () => {
    it("should allow access when feature is available", () => {
      mockUseEntitlements.mockReturnValue({
        hasFeature: jest.fn().mockReturnValue(true),
        canCreate: jest.fn(),
        showUpgradeModal: jest.fn(),
      } as any);

      render(
        <Link href="/premium-feature" requiresFeature="premium">
          Premium Feature
        </Link>
      );

      const link = screen.getByText("Premium Feature");
      fireEvent.click(link);

      expect(mockUseEntitlements().showUpgradeModal).not.toHaveBeenCalled();
    });

    it("should block access when feature is not available", () => {
      const mockShowUpgradeModal = jest.fn();
      mockUseEntitlements.mockReturnValue({
        hasFeature: jest.fn().mockReturnValue(false),
        canCreate: jest.fn(),
        showUpgradeModal: mockShowUpgradeModal,
      } as any);

      render(
        <Link href="/premium-feature" requiresFeature="premium">
          Premium Feature
        </Link>
      );

      const link = screen.getByText("Premium Feature");
      fireEvent.click(link);

      expect(mockShowUpgradeModal).toHaveBeenCalledWith(
        "This feature requires an upgrade"
      );
    });

    it("should call custom onBlocked callback", () => {
      const mockOnBlocked = jest.fn();
      mockUseEntitlements.mockReturnValue({
        hasFeature: jest.fn().mockReturnValue(false),
        canCreate: jest.fn(),
        showUpgradeModal: jest.fn(),
      } as any);

      render(
        <Link
          href="/premium-feature"
          requiresFeature="premium"
          onBlocked={mockOnBlocked}
        >
          Premium Feature
        </Link>
      );

      const link = screen.getByText("Premium Feature");
      fireEvent.click(link);

      expect(mockOnBlocked).toHaveBeenCalled();
    });
  });

  describe("Capacity requirements", () => {
    it("should allow creation when capacity available", () => {
      mockUseEntitlements.mockReturnValue({
        hasFeature: jest.fn(),
        canCreate: jest.fn().mockReturnValue(true),
        showUpgradeModal: jest.fn(),
      } as any);

      render(
        <Link href="/properties/new" requiresCapacity="property">
          Add Property
        </Link>
      );

      const link = screen.getByText("Add Property");
      fireEvent.click(link);

      expect(mockUseEntitlements().showUpgradeModal).not.toHaveBeenCalled();
    });

    it("should block creation when capacity limit reached", () => {
      const mockShowUpgradeModal = jest.fn();
      mockUseEntitlements.mockReturnValue({
        hasFeature: jest.fn(),
        canCreate: jest.fn().mockReturnValue(false),
        showUpgradeModal: mockShowUpgradeModal,
      } as any);

      render(
        <Link href="/properties/new" requiresCapacity="property">
          Add Property
        </Link>
      );

      const link = screen.getByText("Add Property");
      fireEvent.click(link);

      expect(mockShowUpgradeModal).toHaveBeenCalledWith(
        "You've reached your property limit"
      );
    });

    it("should handle different capacity types", () => {
      const mockCanCreate = jest.fn().mockReturnValue(false);
      const mockShowUpgradeModal = jest.fn();

      mockUseEntitlements.mockReturnValue({
        hasFeature: jest.fn(),
        canCreate: mockCanCreate,
        showUpgradeModal: mockShowUpgradeModal,
      } as any);

      // Test unit capacity
      const { rerender } = render(
        <Link href="/units/new" requiresCapacity="unit">
          Add Unit
        </Link>
      );

      fireEvent.click(screen.getByText("Add Unit"));
      expect(mockShowUpgradeModal).toHaveBeenCalledWith(
        "You've reached your unit limit"
      );

      // Test user capacity
      rerender(
        <Link href="/users/new" requiresCapacity="user">
          Add User
        </Link>
      );

      fireEvent.click(screen.getByText("Add User"));
      expect(mockShowUpgradeModal).toHaveBeenCalledWith(
        "You've reached your user limit"
      );
    });
  });

  describe("Tracking data", () => {
    it("should log tracking data on click", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      render(
        <Link
          href="/properties/new"
          trackingData={{
            event: "add_property_click",
            category: "property",
            label: "properties_list_page",
          }}
        >
          Add Property
        </Link>
      );

      const link = screen.getByText("Add Property");
      fireEvent.click(link);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Link Click Analytics]",
        expect.objectContaining({
          href: "/properties/new",
          event: "add_property_click",
          category: "property",
          label: "properties_list_page",
          timestamp: expect.any(String),
        })
      );

      consoleSpy.mockRestore();
    });

    it("should include custom tracking properties", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      render(
        <Link
          href="/leases/new"
          trackingData={{
            event: "add_lease_click",
            category: "lease",
            label: "leases_list_page",
            propertyId: "prop-123",
            userId: "user-456",
          }}
        >
          New Lease
        </Link>
      );

      const link = screen.getByText("New Lease");
      fireEvent.click(link);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Link Click Analytics]",
        expect.objectContaining({
          propertyId: "prop-123",
          userId: "user-456",
        })
      );

      consoleSpy.mockRestore();
    });

    it("should not log tracking when no data provided", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      render(<Link href="/test">Regular Link</Link>);

      const link = screen.getByText("Regular Link");
      fireEvent.click(link);

      expect(consoleSpy).not.toHaveBeenCalledWith(
        "[Link Click Analytics]",
        expect.anything()
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Custom onClick handler", () => {
    it("should call custom onClick along with tracking", () => {
      const mockOnClick = jest.fn();
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      render(
        <Link
          href="/test"
          onClick={mockOnClick}
          trackingData={{ event: "test_click" }}
        >
          Test Link
        </Link>
      );

      const link = screen.getByText("Test Link");
      fireEvent.click(link);

      expect(mockOnClick).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "[Link Click Analytics]",
        expect.anything()
      );

      consoleSpy.mockRestore();
    });

    it("should not call onClick when blocked by capacity", () => {
      const mockOnClick = jest.fn();
      mockUseEntitlements.mockReturnValue({
        hasFeature: jest.fn(),
        canCreate: jest.fn().mockReturnValue(false),
        showUpgradeModal: jest.fn(),
      } as any);

      render(
        <Link
          href="/properties/new"
          onClick={mockOnClick}
          requiresCapacity="property"
        >
          Add Property
        </Link>
      );

      const link = screen.getByText("Add Property");
      fireEvent.click(link);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe("Next.js link props", () => {
    it("should pass through Next.js specific props", () => {
      render(
        <Link href="/test" prefetch={false} replace scroll={false}>
          Test Link
        </Link>
      );

      const link = screen.getByText("Test Link");
      expect(link).toBeInTheDocument();
    });

    it("should handle HTML anchor attributes", () => {
      render(
        <Link href="/test" className="custom-class" data-testid="custom-link">
          Test Link
        </Link>
      );

      const link = screen.getByTestId("custom-link");
      expect(link).toHaveClass("custom-class");
    });
  });
});
