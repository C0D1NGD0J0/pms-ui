import React from "react";

interface ModernAuthLayoutProps {
  children: React.ReactNode;
  brandContent: React.ReactNode;
}

export const ModernAuthLayout: React.FC<ModernAuthLayoutProps> = ({
  children,
  brandContent,
}) => {
  return (
    <div className="auth-wrapper">
      {brandContent}
      {children}
    </div>
  );
};
