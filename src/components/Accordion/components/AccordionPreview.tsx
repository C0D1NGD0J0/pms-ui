import React, { ReactNode } from "react";

export interface AccordionPreviewProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const AccordionPreview: React.FC<AccordionPreviewProps> = ({
  title,
  subtitle,
  children,
  className = "",
}) => {
  return (
    <div className={`accordion-preview ${className}`}>
      {(title || subtitle) && (
        <div className="accordion-preview-header">
          {title && <h3 className="accordion-preview-title">{title}</h3>}
          {subtitle && <p className="accordion-preview-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="accordion-preview-content">{children}</div>
    </div>
  );
};
