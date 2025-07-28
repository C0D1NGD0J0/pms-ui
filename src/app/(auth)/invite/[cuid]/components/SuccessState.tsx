import React from "react";
import { Button } from "@components/FormElements";

interface SuccessStateProps {
  onRedirect: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({ onRedirect }) => {
  return (
    <div className="success-state">
      <div className="success-icon">
        <i className="bx bx-check-circle"></i>
      </div>
      <div className="success-title">Welcome Aboard!</div>
      <div className="success-message">
        Your account has been activated successfully. You&apos;ll be redirected
        to your dashboard in a few seconds.
      </div>
      <div className="action-fields">
        <Button
          label="Go to Dashboard"
          className="btn btn-primary"
          onClick={onRedirect}
          icon={<i className="bx bx-home"></i>}
        />
      </div>
    </div>
  );
};
