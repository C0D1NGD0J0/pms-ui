import React from "react";
import { Button } from "@components/FormElements/";

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
      <div className="btn-group">
        <Button
          label="Google"
          disabled={true}
          onClick={handleGoogleClick}
          loadingText="Signing in..."
          className="btn-outline btn-full"
          icon={<i className="bx danger bxl-google"></i>}
        />
        <Button
          label="Microsoft"
          disabled={true}
          onClick={handleMicrosoftClick}
          loadingText="Signing in..."
          className="btn-outline btn-full"
          icon={<i className="bx primary bxl-microsoft"></i>}
        />
      </div>
    </div>
  );
};
