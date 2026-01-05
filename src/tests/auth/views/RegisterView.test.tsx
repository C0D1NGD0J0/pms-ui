import { useForm } from "@mantine/form";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/test-utils";
import { RegisterView } from "@app/(auth)/register/view";
import { ISignupForm } from "@interfaces/auth.interface";

const mockProps = {
  isPending: false,
  currentStep: 0,
  nextStep: jest.fn(),
  prevStep: jest.fn(),
  handleOnChange: jest.fn(),
  handleSubmit: jest.fn(),
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
        planName: "",
        isCorporate: false,
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

  it("should render user info step by default", () => {
    render(<RegisterViewWrapper />);

    expect(
      screen.getByRole("heading", { name: "Register" })
    ).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("First name")).toBeInTheDocument();
    expect(screen.getByText("Last name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("should show processing state when submitting", () => {
    render(<RegisterViewWrapper isPending={true} />);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("should render company info step for corporate accounts", () => {
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
            planId: "corporate",
            planName: "corporate",
            isCorporate: true,
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

      return <RegisterView form={form} {...mockProps} currentStep={1} />;
    }

    render(<CorporateRegisterWrapper />);

    expect(screen.getByText("Registered name")).toBeInTheDocument();
    expect(screen.getByText("Trading name")).toBeInTheDocument();
    expect(screen.getByText("Business Email")).toBeInTheDocument();
  });
});
