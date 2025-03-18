import Link from "next/link";
import React from "react";

interface AuthContentBoxProps {
  title: string;
  subtitle: string;
  headerLink?: string;
  headerLinkText?: string;
}

export const AuthContentHeader = ({
  title,
  subtitle,
  headerLink,
  headerLinkText,
}: AuthContentBoxProps) => {
  return (
    <div className="auth-page_content-header">
      <h2 className="header-title">{title}</h2>
      <hr className="hr" />
      <p className="header-subtitle">
        {subtitle}{" "}
        {headerLink && (
          <Link href={headerLink}>
            <strong>{headerLinkText}</strong>
          </Link>
        )}
      </p>
    </div>
  );
};
