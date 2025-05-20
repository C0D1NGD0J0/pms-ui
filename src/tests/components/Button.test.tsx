import React from "react";
import { Button } from "@components/FormElements/Button";
import { fireEvent, render, screen } from "@tests/utils/test-utils";

describe("Button Component", () => {
  it("renders correctly with default props", () => {
    render(<Button label="Click Me">Click Me</Button>);
    const button = screen.getByText("Click Me");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("handles disabled state", () => {
    render(
      <Button label="Click Me" disabled>
        Click Me
      </Button>
    );
    const button = screen.getByText("Click Me");
    expect(button).toBeDisabled();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(
      <Button label="Click Me" onClick={handleClick}>
        Click Me
      </Button>
    );
    const button = screen.getByText("Click Me");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with custom className", () => {
    render(
      <Button label="Click Me" className="custom-class">
        Click Me
      </Button>
    );
    const button = screen.getByText("Click Me");
    expect(button).toHaveClass("custom-class");
  });
});
