import React from "react";

interface FieldActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
  label: string;
  type?: "button" | "submit" | "reset";
}

export const FieldActionButton: React.FC<FieldActionButtonProps> = ({
  onClick,
  disabled = false,
  icon,
  label,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="auth-icon-input__action-button"
    >
      {icon && <i className={`bx ${icon}`}></i>}
      {label}
    </button>
  );
};
