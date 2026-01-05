import { useForm } from "@mantine/form";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/test-utils";
import { ForgotPasswordView } from "@app/(auth)/forgot_password/view";
import { ForgotPasswordForm } from "@app/(auth)/forgot_password/hook/useForgotPasswordLogic";

const mockProps = {
  isPending: false,
  handleSubmit: jest.fn(),
};

function ForgotPasswordViewWrapper(props: Partial<typeof mockProps> = {}) {
  const form = useForm<ForgotPasswordForm>({
    initialValues: {
      email: "",
    },
  });

  return <ForgotPasswordView form={form} {...mockProps} {...props} />;
}

describe("ForgotPasswordView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render forgot password form with correct elements", () => {
    render(<ForgotPasswordViewWrapper />);

    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "It happens to the best of us. Just enter your email address."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your email address...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send reset link" })
    ).toBeInTheDocument();
  });

  it("should show processing state when submitting", () => {
    render(<ForgotPasswordViewWrapper isPending={true} />);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /processing/i })
    ).toBeInTheDocument();
  });

  it("should render footer link to login", () => {
    render(<ForgotPasswordViewWrapper />);

    expect(
      screen.getByText("Already have an account? Log in")
    ).toBeInTheDocument();
  });
});
