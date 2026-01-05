import React from "react";

import { Toggle } from "./Toggle";

interface ToggleListItemProps {
  title: string;
  description: string;
  icon?: string;
  initialState: boolean;
  onChange: (newState: boolean) => void;
  name: string;
  disabled?: boolean;
}

export const ToggleListItem: React.FC<ToggleListItemProps> = ({
  title,
  description,
  icon,
  initialState,
  onChange,
  name,
  disabled = false,
}) => {
  return (
    <div className="toggle-container">
      <div className="toggle-label">
        <div className="toggle-title">
          {icon && <i className={`bx ${icon}`} />}
          <h4>{title}</h4>
        </div>
        <p>{description}</p>
      </div>
      <Toggle
        initialState={initialState}
        onChange={onChange}
        name={name}
        disabled={disabled}
      />
    </div>
  );
};
