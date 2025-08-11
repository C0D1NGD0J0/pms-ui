import React from "react";
import Link from "next/link";

interface AuthContentFooterProps {
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
}

export const AuthContentFooter = ({
  footerText,
  footerLink,
  footerLinkText,
}: AuthContentFooterProps) => {
  return (
    <div className="auth-page_content-footer mt-2">
      <p>
        {footerText && footerText}
        {footerLink && (
          <Link href={footerLink}>
            <strong>{footerLinkText}</strong>
          </Link>
        )}
      </p>
      <p className="termsAgreement">
        By continuing, you agree to accept our
        <Link href="/">
          <strong> Privacy & Terms of Service</strong>
        </Link>
      </p>
    </div>
  );
};
