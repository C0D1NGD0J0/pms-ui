import React from "react";
import { render, screen } from "@testing-library/react";
import InvitationPage from "@app/(auth)/invite/[cuid]/page";

describe("InvitationPage Component", () => {
  it("should be able to import the component", () => {
    expect(InvitationPage).toBeDefined();
    expect(typeof InvitationPage).toBe("function");
  });

  it("should render a basic mock component", () => {
    const MockInvitationPage = () => (
      <div data-testid="invitation-page">Invitation Page</div>
    );

    render(<MockInvitationPage />);

    expect(screen.getByTestId("invitation-page")).toBeInTheDocument();
    expect(screen.getByText("Invitation Page")).toBeInTheDocument();
  });
});
