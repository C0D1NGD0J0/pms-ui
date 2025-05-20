import React, { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  description,
  className = "",
}) => {
  return (
    <div className={`form-section ${className}`}>
      <div className="form-section_header">
        <h3 className="form-section_header-title">{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
};
