import { useForm } from "@mantine/form";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/test-utils";
import { IAccountActivationForm } from "@interfaces/auth.interface";
import { AccountActivationView } from "@app/(auth)/account_activation/[cid]/view";

const mockProps = {
  isPending: false,
  handleSubmit: jest.fn(),
  token: "test-token",
  email: "",
  setEmail: jest.fn(),
  emailError: "",
  isSuccess: false,
  isPopoverOpen: false,
  setIsPopoverOpen: jest.fn(),
  showResendActivation: false,
  handleResendActivation: jest.fn(),
  setEmailError: jest.fn(),
};

function AccountActivationViewWrapper(props: Partial<typeof mockProps> = {}) {
  const form = useForm<IAccountActivationForm>({
    initialValues: {
      token: "test-token",
      cuid: "test-cuid",
    },
  });

  return <AccountActivationView form={form} {...mockProps} {...props} />;
}

describe("AccountActivationView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render account verification form", () => {
    render(<AccountActivationViewWrapper />);

    expect(screen.getByText("Account verification")).toBeInTheDocument();
    expect(
      screen.getByText("Complete registration by verifying your account")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Verification code")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("should show loading when no token is provided", () => {
    render(<AccountActivationViewWrapper token={undefined} />);

    expect(screen.getByText("Broken url...")).toBeInTheDocument();
  });

  it("should show success message when activation is successful", () => {
    render(<AccountActivationViewWrapper isSuccess={true} />);

    expect(
      screen.getByText(/Congratulations, account has now been activated/)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });

  it("should show resend activation option when needed", () => {
    render(<AccountActivationViewWrapper showResendActivation={true} />);

    expect(screen.getByText("Request new code")).toBeInTheDocument();
  });

  it("should show processing state when submitting", () => {
    render(<AccountActivationViewWrapper isPending={true} />);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /processing/i })
    ).toBeInTheDocument();
  });
});
