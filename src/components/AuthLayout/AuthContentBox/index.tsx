import React from "react";

interface AuthContentBoxProps {
  className: "auth-page_right-box" | "auth-page_left-box";
  children: React.ReactNode;
}

export const AuthContentBox = ({
  className,
  children,
}: AuthContentBoxProps) => {
  return (
    <div className={className}>
      <div className="auth-page_content">{children}</div>
    </div>
  );
};
