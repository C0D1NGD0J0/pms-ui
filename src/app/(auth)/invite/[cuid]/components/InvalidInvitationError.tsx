import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@components/FormElements";

interface InvalidInvitationErrorProps {
  errorType?: "missing-token" | "expired" | "invalid" | "accepted";
  title?: string;
  subtitle?: string;
  message?: string;
  onContactSupport?: () => void;
  onRedirectToLogin?: () => void;
  showSupportButton?: boolean;
  showLoginButton?: boolean;
}

export const InvalidInvitationError: React.FC<InvalidInvitationErrorProps> = ({
  errorType = "missing-token",
  title,
  subtitle,
  message,
  onContactSupport,
  onRedirectToLogin,
  showSupportButton,
  showLoginButton,
}) => {
  console.log("Rendering InvalidInvitationError with type:", errorType);
  const router = useRouter();
  const getErrorContent = () => {
    switch (errorType) {
      case "missing-token":
        return {
          icon: "bx-error-alt",
          title: title || "Invalid Invitation Link",
          subtitle:
            subtitle ||
            "This invitation link appears to be incomplete or invalid",
          message:
            message ||
            "The invitation link you followed is missing required information. Please check your email for the correct link or contact support for assistance.",
          showSupportButton:
            showSupportButton !== undefined ? showSupportButton : true,
          showLoginButton:
            showLoginButton !== undefined ? showLoginButton : true,
        };
      case "expired":
        return {
          icon: "bx-time",
          title: title || "Invitation Expired",
          subtitle: subtitle || "This invitation link has expired",
          message:
            message ||
            "This invitation has expired. Please contact your administrator to request a new invitation.",
          showSupportButton:
            showSupportButton !== undefined ? showSupportButton : true,
          showLoginButton:
            showLoginButton !== undefined ? showLoginButton : false,
        };
      case "invalid":
        return {
          icon: "bx-error",
          title: title || "Invalid Invitation",
          subtitle: subtitle || "This invitation link is invalid",
          message:
            message ||
            "This invitation link is invalid or has already been used. Please check your email for the correct link or contact support.",
          showSupportButton:
            showSupportButton !== undefined ? showSupportButton : true,
          showLoginButton:
            showLoginButton !== undefined ? showLoginButton : false,
        };
      case "accepted":
        return {
          icon: "bx-check-circle",
          title: title || "Already Accepted",
          subtitle: subtitle || "This invitation has already been accepted",
          message:
            message ||
            "This invitation has already been accepted. If you need to access your account, please use the login page.",
          showSupportButton:
            showSupportButton !== undefined ? showSupportButton : false,
          showLoginButton:
            showLoginButton !== undefined ? showLoginButton : true,
        };
      default:
        return {
          icon: "bx-error",
          title: title || "Error",
          subtitle: subtitle || "An error occurred",
          message: message || "An unexpected error occurred.",
          showSupportButton:
            showSupportButton !== undefined ? showSupportButton : true,
          showLoginButton:
            showLoginButton !== undefined ? showLoginButton : false,
        };
    }
  };

  const errorContent = getErrorContent();

  const handleContactSupport = () => {
    if (onContactSupport) {
      onContactSupport();
    } else {
      // Default behavior: open email
      window.open(
        "mailto:support@propertymanagement.com?subject=Invitation%20Issue"
      );
    }
  };

  const handleRedirectToLogin = () => {
    if (onRedirectToLogin) {
      onRedirectToLogin();
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="invitation-workflow">
      <div className="auth-page_content">
        <div className="auth-page_content-body">
          <div className="error-state">
            <div className="error-icon">
              <i className={`bx ${errorContent.icon}`}></i>
            </div>
            <div className="error-message">{errorContent.message}</div>
            <div className="flex-row flex-center">
              {errorContent.showSupportButton && (
                <Button
                  label="Contact Support"
                  className="btn btn-outline"
                  onClick={handleContactSupport}
                  icon={<i className="bx bx-support"></i>}
                />
              )}
              {errorContent.showLoginButton && (
                <Button
                  label="Go to Login"
                  className="btn btn-primary"
                  onClick={handleRedirectToLogin}
                  icon={<i className="bx bx-log-in"></i>}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
