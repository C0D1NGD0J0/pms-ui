import React from "react";

interface AuthBrandPanelProps {
  children: React.ReactNode;
}

export const AuthBrandPanel: React.FC<AuthBrandPanelProps> = ({ children }) => {
  return (
    <div className="auth-brand-panel">
      <div className="auth-brand-panel__content">{children}</div>
    </div>
  );
};
