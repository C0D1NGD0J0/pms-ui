import React, { KeyboardEvent, useState } from "react";

type ToggleProps = {
  id?: string;
  className?: string;
  onChange: (newState: boolean, name?: string) => void;
  initialState?: boolean;
  name?: string;
};

export const Toggle: React.FC<ToggleProps> = ({
  className = "",
  onChange,
  initialState = false,
  id,
  name,
}) => {
  const [isToggled, setIsToggled] = useState(initialState);

  const toggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    if (onChange) {
      onChange(newState, name);
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
      id={id}
      className={`toggle ${isToggled ? "toggled" : ""} ${className}`}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="switch"
      aria-checked={isToggled}
      data-name={name}
    >
      <div className="toggle-handle"></div>
    </div>
  );
};
