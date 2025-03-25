import React from "react";
import Link from "next/link";

interface AuthContenFooterProps {
  footerText?: string;
  footerLink?: string;
  footerLinkText?: string;
}

export const AuthContenFooter = ({
  footerText,
  footerLink,
  footerLinkText,
}: AuthContenFooterProps) => {
  return (
    <div className="auth-page_content-footer mt-2">
      <p>
        {footerText && footerText}
        {footerLink && (
          <Link href="/">
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
