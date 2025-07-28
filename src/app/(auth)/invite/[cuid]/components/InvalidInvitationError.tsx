import React from "react";

interface InvalidInvitationErrorProps {
  title?: string;
  subtitle?: string;
  message?: string;
  showSupportButton?: boolean;
  showLoginButton?: boolean;
}

export const InvalidInvitationError: React.FC<InvalidInvitationErrorProps> = ({
  title = "Invalid Invitation Link",
  subtitle = "This invitation link appears to be incomplete or invalid",
  message = "The invitation link you followed is missing required information. Please check your email for the correct link or contact support for assistance.",
  showSupportButton = true,
  showLoginButton = true,
}) => {
  return (
    <div className="invitation-workflow">
      <div className="auth-page_content">
        <div className="auth-page_content-header">
          <h2>{title}</h2>
          <p className="header-subtitle">{subtitle}</p>
        </div>

        <div className="auth-page_content-body">
          <div className="error-state">
            <div className="error-icon">
              <i className="bx bx-error-alt"></i>
            </div>
            <div className="error-message">{message}</div>
            <div className="error-actions">
              {showSupportButton && (
                <a href="/contact" className="btn btn-outline">
                  Contact Support
                </a>
              )}
              {showLoginButton && (
                <a href="/login" className="btn btn-primary">
                  Go to Login
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
