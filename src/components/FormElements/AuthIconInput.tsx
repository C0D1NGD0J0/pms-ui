import React, { ChangeEvent, useState } from "react";

interface AuthIconInputProps {
  type: string;
  icon: string;
  placeholder: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  rightIcon?: string;
  onRightIconClick?: () => void;
  error?: string;
  name?: string;
  autoComplete?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export const AuthIconInput: React.FC<AuthIconInputProps> = ({
  type,
  icon,
  placeholder,
  value,
  onChange,
  rightIcon,
  onRightIconClick,
  error,
  name,
  autoComplete,
  label,
  disabled = false,
  readOnly = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    if (onRightIconClick) {
      onRightIconClick();
    } else {
      setShowPassword(!showPassword);
    }
  };

  const inputType =
    type === "password" && showPassword && !onRightIconClick ? "text" : type;

  const displayRightIcon =
    rightIcon ||
    (type === "password" ? (showPassword ? "bx-show" : "bx-hide") : undefined);

  const inputClasses = [
    "auth-icon-input__field",
    displayRightIcon ? "auth-icon-input__field--with-right-icon" : "",
    disabled ? "input-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="auth-icon-input">
      {label && <label className="auth-icon-input__label">{label}</label>}
      <div className="auth-icon-input__wrapper">
        <i className={`bx ${icon} auth-icon-input__icon`}></i>
        <input
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={readOnly ? () => "" : onChange}
          name={name}
          autoComplete={autoComplete}
          disabled={disabled}
          readOnly={readOnly}
        />
        {displayRightIcon && (
          <i
            className={`bx ${displayRightIcon} auth-icon-input__right-icon`}
            onClick={
              type === "password" || onRightIconClick
                ? handleTogglePassword
                : undefined
            }
          ></i>
        )}
      </div>
      {error && <span className="auth-icon-input__error">{error}</span>}
    </div>
  );
};
