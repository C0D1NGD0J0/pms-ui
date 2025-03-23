import React, { KeyboardEvent,useState } from "react";

// Define a type for the component's props
type ToggleProps = {
  className?: string;
  onChange: (newState: boolean) => void;
  initialState?: boolean;
};

export const Toggle: React.FC<ToggleProps> = ({
  className = "",
  onChange,
  initialState = false,
}) => {
  const [isToggled, setIsToggled] = useState<boolean>(initialState);

  const toggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    // Call the onChange handler with the new state
    if (onChange) {
      onChange(newState);
    }
  };

  // Specify the type for the keyboard event
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      toggle();
    }
  };

  return (
    <div
      className={`toggle-container ${className}`}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={isToggled}
    >
      <div className={`toggle ${isToggled ? "toggled" : ""}`}>
        <div className="toggle-handle"></div>
      </div>
    </div>
  );
};
