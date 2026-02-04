import React from "react";

interface AuthFormPanelProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export const AuthFormPanel: React.FC<AuthFormPanelProps> = ({
  children,
  title,
  subtitle,
  footer,
}) => {
  return (
    <div className="auth-form-panel">
      <div className="auth-form-panel__container">
        {(title || subtitle) && (
          <div className="auth-form-panel__header">
            {title && <h1 className="auth-form-panel__title">{title}</h1>}
            {subtitle && (
              <p className="auth-form-panel__subtitle">{subtitle}</p>
            )}
          </div>
        )}
        <div className="auth-form-panel__form">{children}</div>
        {footer && <div className="auth-form-panel__footer">{footer}</div>}
      </div>
    </div>
  );
};
