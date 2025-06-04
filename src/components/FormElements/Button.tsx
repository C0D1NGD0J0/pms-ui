import React, { CSSProperties } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  key?: string;
  disabled?: boolean;
  style?: CSSProperties;
  icon?: React.ReactNode;
  formId?: string;
  renderChildren?: boolean;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  style,
  onClick,
  disabled = false,
  children,
  className,
  formId = "",
  ariaLabel,
  key = new Date().getTime().toString(),
  type = "button",
  renderChildren = false,
  iconPosition = "left",
}) => {
  return (
    <button
      type={type}
      style={style}
      key={key}
      {...(formId && formId.trim() !== "" && { form: formId })}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`btn ${className ? className : ""}`}
    >
      {renderChildren ? (
        children
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="btn-icon">{icon}</span>
          )}
          {label}
          {icon && iconPosition === "right" && (
            <span className="btn-icon">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};
