import React from "react";
import { IInvitationData } from "@src/interfaces";
import { fireEvent, render, screen } from "@testing-library/react";
import { AccountSetup } from "@app/(auth)/invite/[cuid]/components/AccountSetup";
import { AccountSetupFormValues } from "@src/validations/invitation.validations";

// Mock form components
jest.mock("@components/FormElements", () => ({
  CustomDropdown: ({ label, value, onChange, options }: any) => (
    <div>
      <label>{label}</label>
      <select
        data-testid={`dropdown-${label?.toLowerCase()?.replace(/\s+/g, "-")}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
  FormField: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-field">{children}</div>
  ),
  FormInput: ({ type, value, onChange, placeholder, required, name }: any) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      name={name}
      data-testid={`input-${name}`}
    />
  ),
  FormLabel: ({
    children,
    required,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <label>
      {children}
      {required && <span>*</span>}
    </label>
  ),
  Checkbox: ({ checked, onChange, label }: any) => (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        data-testid={`checkbox-${label?.toLowerCase()?.replace(/\s+/g, "-")}`}
      />
      <label>{label}</label>
    </div>
  ),
  Button: ({ children, onClick, disabled, variant, type }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      data-testid={`button-${variant || "default"}`}
    >
      {children}
    </button>
  ),
  Form: ({
    children,
    onSubmit,
  }: {
    children: React.ReactNode;
    onSubmit: any;
  }) => (
    <form onSubmit={onSubmit} data-testid="account-setup-form">
      {children}
    </form>
  ),
}));

const defaultProps = {
  invitationData: {
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+1234567890",
    },
    status: "pending",
    inviteeEmail: "test@example.com",
    role: "staff",
    metadata: {
      inviteMessage: "Welcome to Test Company",
    },
  } as IInvitationData,
  onBack: jest.fn(),
  handleSubmit: jest.fn(),
  handleFieldChange: jest.fn(() => jest.fn()),
  handleDropdownChange: jest.fn(),
  isSubmitting: false,
  isValid: true,
  values: {
    password: "Password123",
    confirmPassword: "Password123",
    phoneNumber: "",
    location: "Toronto, Canada",
    timeZone: "UTC",
    token: "test-token",
    cuid: "test-cuid",
    lang: "en",
    termsAccepted: false,
    newsletterOptIn: false,
  } as AccountSetupFormValues,
  errors: {},
  touched: jest.fn(() => false),
};

describe("AccountSetup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all form fields", () => {
    render(<AccountSetup {...defaultProps} />);

    expect(screen.getByTestId("account-setup-form")).toBeInTheDocument();
    expect(screen.getByTestId("input-password")).toBeInTheDocument();
    expect(screen.getByTestId("input-confirmPassword")).toBeInTheDocument();
    expect(screen.getByTestId("input-phoneNumber")).toBeInTheDocument();
    expect(screen.getByTestId("input-location")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-time-zone")).toBeInTheDocument();
    expect(
      screen.getByTestId("dropdown-preferred-language")
    ).toBeInTheDocument();
    expect(screen.getByTestId("checkbox-terms-accepted")).toBeInTheDocument();
    expect(
      screen.getByTestId("checkbox-newsletter-opt-in")
    ).toBeInTheDocument();
  });

  it("should render form fields with correct values", () => {
    render(<AccountSetup {...defaultProps} />);

    expect(screen.getByTestId("input-password")).toHaveValue("Password123");
    expect(screen.getByTestId("input-confirmPassword")).toHaveValue(
      "Password123"
    );
    expect(screen.getByTestId("input-location")).toHaveValue("Toronto, Canada");
    expect(screen.getByTestId("dropdown-time-zone")).toHaveValue("UTC");
    expect(screen.getByTestId("dropdown-preferred-language")).toHaveValue("en");
  });

  it("should call handleFieldChange when input values change", () => {
    const mockFieldChange = jest.fn(() => jest.fn());
    const props = {
      ...defaultProps,
      handleFieldChange: mockFieldChange,
    };

    render(<AccountSetup {...props} />);

    fireEvent.change(screen.getByTestId("input-password"), {
      target: { value: "NewPassword123" },
    });

    expect(mockFieldChange).toHaveBeenCalledWith("password");
  });

  it("should call handleDropdownChange when dropdown values change", () => {
    render(<AccountSetup {...defaultProps} />);

    fireEvent.change(screen.getByTestId("dropdown-time-zone"), {
      target: { value: "America/New_York" },
    });

    expect(defaultProps.handleDropdownChange).toHaveBeenCalledWith(
      "America/New_York",
      "timeZone"
    );
  });

  it("should handle checkbox changes", () => {
    const mockFieldChange = jest.fn(() => jest.fn());
    const props = {
      ...defaultProps,
      handleFieldChange: mockFieldChange,
    };

    render(<AccountSetup {...props} />);

    fireEvent.click(screen.getByTestId("checkbox-terms-accepted"));

    expect(mockFieldChange).toHaveBeenCalledWith("termsAccepted");
  });

  it("should call handleSubmit when form is submitted", () => {
    render(<AccountSetup {...defaultProps} />);

    fireEvent.submit(screen.getByTestId("account-setup-form"));

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });

  it("should call onBack when back button is clicked", () => {
    render(<AccountSetup {...defaultProps} />);

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it("should disable submit button when form is invalid", () => {
    const props = {
      ...defaultProps,
      isValid: false,
    };

    render(<AccountSetup {...props} />);

    const submitButton = screen.getByText("Create Account");
    expect(submitButton).toBeDisabled();
  });

  it("should show loading state when submitting", () => {
    const props = {
      ...defaultProps,
      isSubmitting: true,
    };

    render(<AccountSetup {...props} />);

    const submitButton = screen.getByText("Creating Account...");
    expect(submitButton).toBeDisabled();
  });

  it("should display form validation errors", () => {
    const props = {
      ...defaultProps,
      errors: {
        password: "Password is too weak",
        phoneNumber: "Invalid phone number format",
      },
    };

    render(<AccountSetup {...props} />);

    expect(screen.getByText("Password is too weak")).toBeInTheDocument();
    expect(screen.getByText("Invalid phone number format")).toBeInTheDocument();
  });

  it("should render all timezone options", () => {
    render(<AccountSetup {...defaultProps} />);

    const timezoneSelect = screen.getByTestId("dropdown-time-zone");
    expect(timezoneSelect).toBeInTheDocument();

    // Check if some key timezone options are present
    expect(screen.getByText("UTC")).toBeInTheDocument();
    expect(screen.getByText("Eastern Time (ET)")).toBeInTheDocument();
    expect(screen.getByText("Pacific Time (PT)")).toBeInTheDocument();
  });

  it("should render all language options", () => {
    render(<AccountSetup {...defaultProps} />);

    const languageSelect = screen.getByTestId("dropdown-preferred-language");
    expect(languageSelect).toBeInTheDocument();

    // Check if key language options are present
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Spanish")).toBeInTheDocument();
    expect(screen.getByText("French")).toBeInTheDocument();
  });

  it("should show required field indicators", () => {
    render(<AccountSetup {...defaultProps} />);

    // Check for required field asterisks (*)
    const requiredLabels = screen.getAllByText("*");
    expect(requiredLabels.length).toBeGreaterThan(0);
  });

  it("should handle terms acceptance properly", () => {
    const props = {
      ...defaultProps,
      values: {
        ...defaultProps.values,
        termsAccepted: true,
      },
    };

    render(<AccountSetup {...props} />);

    const termsCheckbox = screen.getByTestId("checkbox-terms-accepted");
    expect(termsCheckbox).toBeChecked();
  });
});
