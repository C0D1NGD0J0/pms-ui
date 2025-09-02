import { useForm } from "@mantine/form";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/test-utils";
import { ISignupForm } from "@interfaces/auth.interface";
import CompanyInfo from "@app/(auth)/register/view/CompanyInfo";

function CompanyInfoWrapper() {
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

  const handleOnChange = jest.fn();

  return <CompanyInfo formContext={form} onChange={handleOnChange} />;
}

describe("CompanyInfo Component", () => {
  it("should render all required company info fields", () => {
    render(<CompanyInfoWrapper />);

    expect(screen.getByText("Registered name")).toBeInTheDocument();
    expect(screen.getByText("Trading name")).toBeInTheDocument();
    expect(screen.getByText("Business Email")).toBeInTheDocument();
    expect(screen.getByText("Business phone number")).toBeInTheDocument();
    expect(screen.getByText("Business website")).toBeInTheDocument();
  });

  it("should show required indicators for mandatory fields", () => {
    render(<CompanyInfoWrapper />);

    // Check for required fields by their input elements
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThan(3); // Should have multiple input fields

    // Check for asterisk indicators
    const asterisks = screen.getAllByText("*");
    expect(asterisks.length).toBeGreaterThan(3); // Should have required field indicators
  });
});
