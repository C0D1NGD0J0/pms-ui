import React from "react";

interface SocialLoginButtonsProps {
  onGoogleClick?: () => void;
  onMicrosoftClick?: () => void;
  disabled?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleClick,
  onMicrosoftClick,
  disabled = false,
}) => {
  const handleGoogleClick = () => {
    if (onGoogleClick) {
      onGoogleClick();
    } else {
      // Placeholder: No-op for now
      console.log("Google OAuth not implemented");
    }
  };

  const handleMicrosoftClick = () => {
    if (onMicrosoftClick) {
      onMicrosoftClick();
    } else {
      // Placeholder: No-op for now
      console.log("Microsoft OAuth not implemented");
    }
  };

  return (
    <div className="social-login">
      <div className="social-login__divider">
        <span>Or continue with</span>
      </div>
      <div className="social-login__buttons">
        <button
          type="button"
          className="social-login__button social-login__button--google"
          onClick={handleGoogleClick}
          disabled={disabled}
        >
          <i className="bx bxl-google"></i>
          Google
        </button>
        <button
          type="button"
          className="social-login__button social-login__button--microsoft"
          onClick={handleMicrosoftClick}
          disabled={disabled}
        >
          <i className="bx bxl-microsoft"></i>
          Microsoft
        </button>
      </div>
    </div>
  );
};
