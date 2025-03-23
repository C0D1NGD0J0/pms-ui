import React from "react";

export const AuthLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="auth-container">
      <div className="auth-page">{children}</div>
      <div className="curve-container">
        <div className="curve-secondary"></div>
      </div>
    </div>
  );
};
