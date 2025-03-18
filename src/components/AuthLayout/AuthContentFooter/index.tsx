import Link from "next/link";
import React from "react";

interface AuthContenFooterProps {
  footerText: string;
  footerLink?: string;
  footerLinkText?: string;
}

export const AuthContenFooter = ({
  footerText,
  footerLink,
  footerLinkText,
}: AuthContenFooterProps) => {
  return (
    <div className="auth-page_content-footer">
      <p>
        {footerText}{" "}
        {footerLink && (
          <Link href={footerLink}>
            <strong>{footerLinkText}</strong>
          </Link>
        )}
      </p>
    </div>
  );
};
