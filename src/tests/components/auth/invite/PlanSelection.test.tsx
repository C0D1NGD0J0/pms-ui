import { render } from "@tests/utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import PlanSelection from "@app/(auth)/register/view/SubscriptionPlans";

describe("PlanSelection Component", () => {
  const mockOnSelectPlan = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render login link", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    const loginLink = screen.getByRole("link", { name: "Sign in" });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("should render all plan cards", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    expect(screen.getByText("Choose Your Perfect Plan")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(screen.getByText("Professional")).toBeInTheDocument();
  });

  it("should render billing toggle with monthly selected by default", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    const monthlyLabel = screen.getByText("Monthly");
    const annualLabel = screen.getByText("Annual");

    expect(monthlyLabel).toHaveClass("active");
    expect(annualLabel).not.toHaveClass("active");
  });

  it("should toggle between monthly and annual billing", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    // Check initial monthly pricing
    const priceElements = screen.getAllByText("79");
    expect(priceElements.length).toBeGreaterThan(0);

    // Click the toggle switch
    const toggleSwitch = document.querySelector(".billing-toggle__switch");
    fireEvent.click(toggleSwitch as Element);

    // Check annual pricing is now displayed
    expect(screen.getByText("63")).toBeInTheDocument();
    expect(screen.getByText("159")).toBeInTheDocument();

    // Verify annual label is active
    const annualLabel = screen.getByText("Annual");
    expect(annualLabel).toHaveClass("active");
  });

  it("should call onSelectPlan with 'personal' when personal plan is selected", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    const personalButton = screen.getByText("Get Started Free");
    fireEvent.click(personalButton);

    expect(mockOnSelectPlan).toHaveBeenCalledWith("personal");
    expect(mockOnSelectPlan).toHaveBeenCalledTimes(1);
  });

  it("should call onSelectPlan with 'business' when business plan is selected", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    const businessButtons = screen.getAllByText("Start 14-Day Free Trial");
    fireEvent.click(businessButtons[0]); // Business plan is the first with this text

    expect(mockOnSelectPlan).toHaveBeenCalledWith("business");
    expect(mockOnSelectPlan).toHaveBeenCalledTimes(1);
  });

  it("should call onSelectPlan with 'professional' when professional plan is selected", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    const professionalButtons = screen.getAllByText("Start 14-Day Free Trial");
    fireEvent.click(professionalButtons[1]); // Professional plan is the second with this text

    expect(mockOnSelectPlan).toHaveBeenCalledWith("professional");
    expect(mockOnSelectPlan).toHaveBeenCalledTimes(1);
  });

  it("should display 'Most Popular' badge on Business plan", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("should display correct features for Personal plan", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    expect(screen.getByText("Up to 3 properties")).toBeInTheDocument();
    expect(screen.getByText("Basic tenant management")).toBeInTheDocument();
    expect(screen.getByText("Rent collection")).toBeInTheDocument();
  });

  it("should display correct features for Business plan", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    expect(screen.getByText("Up to 50 properties")).toBeInTheDocument();
    expect(screen.getByText("Advanced tenant screening")).toBeInTheDocument();
    expect(screen.getByText("Online payments & AutoPay")).toBeInTheDocument();
  });

  it("should display correct features for Professional plan", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    expect(screen.getByText("Unlimited properties")).toBeInTheDocument();
    expect(screen.getByText("Everything in Business")).toBeInTheDocument();
    expect(screen.getByText("Custom branding")).toBeInTheDocument();
  });

  it("should display enterprise CTA section", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    expect(
      screen.getByText("Need an Enterprise Solution?")
    ).toBeInTheDocument();
    expect(screen.getByText("Custom integrations")).toBeInTheDocument();
    expect(screen.getByText("Dedicated account manager")).toBeInTheDocument();
  });

  it("should display Save 20% badge on billing toggle", () => {
    render(<PlanSelection onSelectPlan={mockOnSelectPlan} />);

    expect(screen.getByText("Save 20%")).toBeInTheDocument();
  });
});
