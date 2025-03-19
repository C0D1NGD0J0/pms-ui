import React, { CSSProperties } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  style?: CSSProperties;
  icon?: React.ReactNode;
  renderChildren?: boolean;
  iconPosition?: "left" | "right";
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  style,
  onClick,
  disabled = false,
  children,
  className,
  ariaLabel,
  type = "button",
  renderChildren = false,
  iconPosition = "left", // Default icon position is left
}) => {
  return (
    <button
      type={type}
      style={style}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`${className ? className : ""}`}
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

export default Button;
