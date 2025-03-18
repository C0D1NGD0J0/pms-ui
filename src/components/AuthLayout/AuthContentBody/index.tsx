import React from "react";

interface AuthContentBodyProps {
  children: React.ReactNode;
}

export const AuthContentBody = ({ children }: AuthContentBodyProps) => {
  return <div className="auth-page_content-body">{children}</div>;
};
