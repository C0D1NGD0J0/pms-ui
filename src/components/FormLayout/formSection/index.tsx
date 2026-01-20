import storage from "@utils/storage";
import React, { ReactNode, useEffect, useState } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  collapsable?: boolean;
  defaultCollapsed?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  description,
  className = "",
  collapsable = false,
  defaultCollapsed = false,
}) => {
  const storageKey = `form-section-${title.toLowerCase().replace(/\s+/g, "-")}`;

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (!collapsable) return false;
    const saved = storage.get<boolean>(storageKey, "local");
    return saved !== null ? saved : defaultCollapsed;
  });

  useEffect(() => {
    if (collapsable) {
      storage.set(storageKey, isCollapsed, "local");
    }
  }, [isCollapsed, storageKey, collapsable]);

  const toggleCollapse = () => {
    if (collapsable) {
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
    collapsable ? "form-section--collapsible" : "",
    isCollapsed ? "form-section--collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sectionClasses}>
      <div
        className="form-section_header"
        onClick={collapsable ? toggleCollapse : undefined}
      >
        <h4 className="form-section_header-title">{title}</h4>
        {description && <p>{description}</p>}
        {collapsable && (
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
      <div className="form-section_content">{children}</div>
    </div>
  );
};
