import React, { KeyboardEvent, useState } from "react";

type ToggleProps = {
  id?: string;
  className?: string;
  onChange: (newState: boolean, name?: string) => void;
  initialState?: boolean;
  name?: string;
  disabled?: boolean;
};

export const Toggle: React.FC<ToggleProps> = ({
  className = "",
  onChange,
  initialState = false,
  id,
  name,
  disabled = false,
}) => {
  const [isToggled, setIsToggled] = useState(initialState);

  const toggle = () => {
    if (disabled) return; // Prevent toggling when disabled

    const newState = !isToggled;
    setIsToggled(newState);
    if (onChange) {
      onChange(newState, name);
    }
  };

  // Specify the type for the keyboard event
  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return; // Prevent keyboard toggling when disabled

    if (e.key === "Enter" || e.key === " ") {
      toggle();
    }
  };

  return (
    <div className="toggle-wrapper">
      <div
        id={id}
        className={`toggle ${isToggled ? "toggled" : ""} ${
          disabled ? "disabled" : ""
        } ${className}`}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="switch"
        aria-checked={isToggled}
        aria-disabled={disabled}
        data-name={name}
      >
        <div className="toggle-handle"></div>
      </div>
      <i className="bx bx-lock-alt toggle-lock-icon" aria-hidden="true"></i>
    </div>
  );
};
