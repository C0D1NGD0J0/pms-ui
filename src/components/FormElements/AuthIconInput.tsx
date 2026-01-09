import React, { ChangeEvent, useState } from "react";

interface AuthIconInputProps {
  type: string;
  icon: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  rightIcon?: string;
  onRightIconClick?: () => void;
  error?: string;
  name?: string;
  autoComplete?: string;
  label?: string;
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
    type === "password" && showPassword && !onRightIconClick
      ? "text"
      : type;

  const displayRightIcon =
    rightIcon ||
    (type === "password" ? (showPassword ? "bx-show" : "bx-hide") : undefined);

  return (
    <div className="auth-icon-input">
      {label && <label className="auth-icon-input__label">{label}</label>}
      <div className="auth-icon-input__wrapper">
        <i className={`bx ${icon} auth-icon-input__icon`}></i>
        <input
          type={inputType}
          className={`auth-icon-input__field ${
            displayRightIcon ? "auth-icon-input__field--with-right-icon" : ""
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          autoComplete={autoComplete}
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
