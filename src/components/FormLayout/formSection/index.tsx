import React, { ReactNode, useEffect, useState } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  description,
  className = "",
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const storageKey = `form-section-${title.toLowerCase().replace(/\s+/g, "-")}`;

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (!collapsible) return false;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultCollapsed;
  });

  useEffect(() => {
    if (collapsible) {
      localStorage.setItem(storageKey, JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, storageKey, collapsible]);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCollapse();
  };

  const sectionClasses = [
    "form-section",
    className,
    collapsible ? "form-section--collapsible" : "",
    isCollapsed ? "form-section--collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sectionClasses}>
      <div
        className="form-section_header"
        onClick={collapsible ? toggleCollapse : undefined}
      >
        <h4 className="form-section_header-title">{title}</h4>
        {description && <p>{description}</p>}
        {collapsible && (
          <button
            type="button"
            className="form-section_toggle"
            onClick={handleToggleClick}
            aria-label={isCollapsed ? "Expand section" : "Collapse section"}
          >
            <svg
              className="form-section_chevron"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M4.427 9.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 9H4.604a.25.25 0 00-.177.427z" />
            </svg>
          </button>
        )}
      </div>
      <div
        className="form-section_content"
        style={
          {
            // opacity: isCollapsed ? 0 : 1,
            // display: isCollapsed ? "none" : "block",
            // transition: "opacity 1s ease-in-out",
          }
        }
      >
        {children}
      </div>
    </div>
  );
};
