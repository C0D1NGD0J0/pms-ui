import { useForm } from "@mantine/form";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/test-utils";
import { IResetPasswordForm } from "@interfaces/auth.interface";
import { ResetPasswordView } from "@app/(auth)/reset_password/[token]/view";

const mockProps = {
  isPending: false,
  handleSubmit: jest.fn(),
  token: "test-token",
};

function ResetPasswordViewWrapper(props: Partial<typeof mockProps> = {}) {
  const form = useForm<IResetPasswordForm>({
    initialValues: {
      password: "",
      cpassword: "",
      token: "test-token",
    },
  });

  return <ResetPasswordView form={form} {...mockProps} {...props} />;
}

describe("ResetPasswordView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render reset password form with correct elements", () => {
    render(<ResetPasswordViewWrapper />);

    expect(screen.getByText("Reset your password")).toBeInTheDocument();
    expect(
      screen.getByText("It happens to the best of us, enter your new password.")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New password...")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm password...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toBeInTheDocument();
  });

  it("should show loading when no token is provided", () => {
    render(<ResetPasswordViewWrapper token="" />);

    expect(screen.getByText("Broken url...")).toBeInTheDocument();
  });

  it("should show processing state when submitting", () => {
    render(<ResetPasswordViewWrapper isPending={true} />);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /processing/i })
    ).toBeInTheDocument();
  });

  it("should render footer link to login", () => {
    render(<ResetPasswordViewWrapper />);

    expect(
      screen.getByText("Already have an account? Log in")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Already have an account? Log in" })
    ).toHaveAttribute("href", "/login");
  });
});
