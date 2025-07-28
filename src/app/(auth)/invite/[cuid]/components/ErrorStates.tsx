import React from "react";
import { Button } from "@components/FormElements";

interface ErrorStatesProps {
  errorType: "expired" | "invalid" | "accepted";
  onContactSupport: () => void;
  onRedirectToLogin?: () => void;
}

export const ErrorStates: React.FC<ErrorStatesProps> = ({
  errorType,
  onContactSupport,
  onRedirectToLogin,
}) => {
  const getErrorContent = () => {
    switch (errorType) {
      case "expired":
        return {
          icon: "bx-time",
          title: "Invitation Expired",
          message:
            "This invitation has expired. Please contact your administrator to request a new invitation.",
          showSupportButton: true,
          showLoginButton: false,
        };
      case "invalid":
        return {
          icon: "bx-error",
          title: "Invalid Invitation",
          message:
            "This invitation link is invalid or has already been used. Please check your email for the correct link or contact support.",
          showSupportButton: true,
          showLoginButton: false,
        };
      case "accepted":
        return {
          icon: "bx-check-circle",
          title: "Already Accepted",
          message:
            "This invitation has already been accepted. If you need to access your account, please use the login page.",
          showSupportButton: false,
          showLoginButton: true,
        };
      default:
        return {
          icon: "bx-error",
          title: "Error",
          message: "An unexpected error occurred.",
          showSupportButton: true,
          showLoginButton: false,
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="error-state">
      <div className="error-icon">
        <i className={`bx ${errorContent.icon}`}></i>
      </div>
      <div className="error-title">{errorContent.title}</div>
      <div className="error-message">{errorContent.message}</div>
      <div className="action-fields">
        {errorContent.showSupportButton && (
          <Button
            label="Contact Support"
            className="btn btn-outline"
            onClick={onContactSupport}
            icon={<i className="bx bx-support"></i>}
          />
        )}
        {errorContent.showLoginButton && onRedirectToLogin && (
          <Button
            label="Go to Login"
            className="btn btn-primary"
            onClick={onRedirectToLogin}
            icon={<i className="bx bx-log-in"></i>}
          />
        )}
      </div>
    </div>
  );
};
