import { useForm } from "@mantine/form";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/test-utils";
import { ISignupForm } from "@interfaces/auth.interface";
import UserInfo from "@app/(auth)/register/view/UserInfo";

function UserInfoWrapper() {
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

  const handleOnChange = jest.fn();

  return <UserInfo formContext={form} onChange={handleOnChange} />;
}

describe("UserInfo Component", () => {
  it("should render all required user info fields", () => {
    render(<UserInfoWrapper />);

    expect(screen.getByText("First name")).toBeInTheDocument();
    expect(screen.getByText("Last name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Display name")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Phone number")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Confirm password")).toBeInTheDocument();
  });

  it("should render account type dropdown", () => {
    render(<UserInfoWrapper />);

    expect(screen.getByText("Acount type")).toBeInTheDocument();
  });
});
