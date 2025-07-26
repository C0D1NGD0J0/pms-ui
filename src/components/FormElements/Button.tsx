import React, { CSSProperties } from "react";
import { ButtonSpinner } from "@components/ButtonSpinner";

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
  loading?: boolean;
  loadingText?: string;
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
  loading = false,
  loadingText,
}) => {
  const isDisabled = disabled || loading;
  const displayText = loading && loadingText ? loadingText : label;
  return (
    <button
      type={type}
      style={style}
      key={key}
      {...(formId && formId.trim() !== "" && { form: formId })}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel || displayText}
      className={`btn ${className ? className : ""} ${loading ? "btn-loading" : ""}`}
    >
      {renderChildren ? (
        children
      ) : (
        <>
          {loading && iconPosition === "left" && (
            <span className="btn-icon btn-spinner-icon">
              <ButtonSpinner size="sm" />
            </span>
          )}
          {!loading && icon && iconPosition === "left" && (
            <span className="btn-icon">{icon}</span>
          )}
          <span className={loading ? "btn-text-loading" : ""}>{displayText}</span>
          {loading && iconPosition === "right" && (
            <span className="btn-icon btn-spinner-icon">
              <ButtonSpinner size="sm" />
            </span>
          )}
          {!loading && icon && iconPosition === "right" && (
            <span className="btn-icon">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};
