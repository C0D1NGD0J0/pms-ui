import React from "react";

interface ButtonSpinnerProps {
  size?: "sm" | "md";
  className?: string;
}

export const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({
  size = "sm",
  className = "",
}) => {
  return (
    <div className={`btn-spinner ${size === "sm" ? "btn-spinner-sm" : "btn-spinner-md"} ${className}`}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  );
};