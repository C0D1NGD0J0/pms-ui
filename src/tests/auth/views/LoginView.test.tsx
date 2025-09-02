import { useForm } from "@mantine/form";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/test-utils";
import { LoginView } from "@app/(auth)/login/view";
import { ILoginForm } from "@interfaces/auth.interface";

const mockProps = {
  isSubmitting: false,
  isModalOpen: false,
  userAccounts: [] as { cuid: string; clientDisplayName: string }[],
  selectedClient: "",
  handleSubmit: jest.fn(),
  handleSelect: jest.fn(),
  toggleModal: jest.fn(),
  handleModalConfirm: jest.fn(),
};

function LoginViewWrapper(props: Partial<typeof mockProps> = {}) {
  const form = useForm<ILoginForm>({
    initialValues: {
      email: "test@example.com",
      password: "password",
      otpCode: "",
      rememberMe: false,
    },
  });

  return <LoginView form={form} {...mockProps} {...props} />;
}

describe("LoginView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render login form with correct fields", () => {
    render(<LoginViewWrapper />);

    expect(screen.getByPlaceholderText("Enter email...")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter password...")
    ).toBeInTheDocument();
    expect(screen.getByText("Remember me")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("should show processing state when submitting", () => {
    render(<LoginViewWrapper isSubmitting={true} />);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
    // Check if the button shows processing state
    expect(
      screen.getByRole("button", { name: /processing/i })
    ).toBeInTheDocument();
  });

  it("should render account selection modal when accounts exist", () => {
    const userAccounts = [
      { cuid: "123", clientDisplayName: "Account 1" },
      { cuid: "456", clientDisplayName: "Account 2" },
    ];

    render(
      <LoginViewWrapper
        isModalOpen={true}
        userAccounts={userAccounts}
        selectedClient="123"
      />
    );

    // Modal should be rendered with account selection
    expect(screen.getByText("Account 1")).toBeInTheDocument();
    expect(screen.getByText("Account 2")).toBeInTheDocument();
  });
});
