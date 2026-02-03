import { useForm } from "@mantine/form";
import { render } from "@tests/utils/test-utils";
import { ISignupForm } from "@interfaces/auth.interface";
import { RegisterView } from "@app/(auth)/register/view";
import { fireEvent, screen } from "@testing-library/react";

const mockProps = {
  isPending: false,
  currentStep: 0,
  nextStep: jest.fn(),
  prevStep: jest.fn(),
  accountType: null as "business" | "individual" | null,
  goToPlanSelection: jest.fn(),
  goToAccountTypeSelection: jest.fn(),
  handleSelectAccountType: jest.fn(),
  handleOnChange: jest.fn(),
  handleSubmit: jest.fn(),
  selectedPlan: null as string | null,
  handleSelectPlan: jest.fn(),
  plansData: [],
  isLoadingPlans: false,
  isPlansError: false,
};

function RegisterViewWrapper(props: Partial<typeof mockProps> = {}) {
  const form = useForm<ISignupForm>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      cpassword: "",
      location: "",
      accountType: {
        planId: "",
        isEnterpriseAccount: false,
        billingInterval: "monthly",
      },
      phoneNumber: "",
      displayName: "",
      companyProfile: {
        tradingName: "",
        legalEntityName: "",
        website: "",
        companyEmail: "",
        companyPhone: "",
      },
    },
  });

  return <RegisterView form={form} {...mockProps} {...props} />;
}

describe("RegisterView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render plan selection step (Step 0) by default", () => {
    render(<RegisterViewWrapper currentStep={0} />);

    expect(screen.getByText("Choose Your Perfect Plan")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Professional")).toBeInTheDocument();
  });

  it("should call handleSelectPlan when a plan is clicked", () => {
    const handleSelectPlanMock = jest.fn();
    const { container } = render(
      <RegisterViewWrapper
        currentStep={0}
        handleSelectPlan={handleSelectPlanMock}
      />
    );

    const starterCard = container.querySelector('[data-plan="starter"]');
    const starterButton = starterCard?.querySelector("button");

    if (starterButton) {
      fireEvent.click(starterButton);
    }

    expect(handleSelectPlanMock).toHaveBeenCalledTimes(1);
    expect(handleSelectPlanMock.mock.calls[0][0]).toBe("starter");
    expect(handleSelectPlanMock.mock.calls[0][1]).toBe(null); // pricingId
    expect(handleSelectPlanMock.mock.calls[0][2]).toBe(null); // lookUpKey
  });

  it("should render user info step (Step 1)", () => {
    render(<RegisterViewWrapper currentStep={1} />);

    expect(
      screen.getByRole("heading", { name: "Create Your Account" })
    ).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
  });

  it("should show selected plan in subtitle when plan is selected", () => {
    render(<RegisterViewWrapper currentStep={1} selectedPlan="starter" />);

    expect(screen.getByText("Selected Plan: Starter")).toBeInTheDocument();
  });

  it("should show processing state when submitting", () => {
    render(<RegisterViewWrapper isPending={true} currentStep={1} />);

    expect(screen.getByText("Creating account...")).toBeInTheDocument();
  });

  it("should render company info step (Step 2) for corporate accounts", () => {
    function CorporateRegisterWrapper() {
      const form = useForm<ISignupForm>({
        initialValues: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          cpassword: "",
          location: "",
          accountType: {
            planId: "growth",
            isEnterpriseAccount: true,
            billingInterval: "monthly",
          },
          phoneNumber: "",
          displayName: "",
          companyProfile: {
            tradingName: "",
            legalEntityName: "",
            website: "",
            companyEmail: "",
            companyPhone: "",
          },
        },
      });

      return (
        <RegisterView
          form={form}
          {...mockProps}
          currentStep={2}
          selectedPlan="growth"
        />
      );
    }

    render(<CorporateRegisterWrapper />);

    expect(
      screen.getByRole("heading", { name: "Company Information" })
    ).toBeInTheDocument();
    expect(screen.getByText("Registered Name")).toBeInTheDocument();
    expect(screen.getByText("Trading Name")).toBeInTheDocument();
    expect(screen.getByText("Business Email")).toBeInTheDocument();
  });

  it("should show Next button on Step 1 for corporate accounts", () => {
    function CorporateRegisterWrapper() {
      const form = useForm<ISignupForm>({
        initialValues: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          cpassword: "",
          location: "",
          accountType: {
            planId: "growth",
            isEnterpriseAccount: true,
            billingInterval: "monthly",
          },
          phoneNumber: "",
          displayName: "",
          companyProfile: {
            tradingName: "",
            legalEntityName: "",
            website: "",
            companyEmail: "",
            companyPhone: "",
          },
        },
      });

      return (
        <RegisterView
          form={form}
          {...mockProps}
          currentStep={1}
          selectedPlan="growth"
        />
      );
    }

    render(<CorporateRegisterWrapper />);

    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("should show Back and Create Account buttons on Step 2 for corporate accounts", () => {
    function CorporateRegisterWrapper() {
      const form = useForm<ISignupForm>({
        initialValues: {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          cpassword: "",
          location: "",
          accountType: {
            planId: "growth",
            isEnterpriseAccount: true,
            billingInterval: "monthly",
          },
          phoneNumber: "",
          displayName: "",
          companyProfile: {
            tradingName: "",
            legalEntityName: "",
            website: "",
            companyEmail: "",
            companyPhone: "",
          },
        },
      });

      return (
        <RegisterView
          form={form}
          {...mockProps}
          currentStep={2}
          selectedPlan="growth"
        />
      );
    }

    render(<CorporateRegisterWrapper />);

    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" })
    ).toBeInTheDocument();
  });
});
