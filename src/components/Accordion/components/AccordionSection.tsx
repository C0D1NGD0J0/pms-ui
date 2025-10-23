import React from "react";

import { useAccordionContext } from "../hook";
import { AccordionSectionProps } from "../interface";

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  item,
  isActive,
  onToggle,
}) => {
  const { completedIds } = useAccordionContext();
  const isCompleted = item.isCompleted || completedIds.has(item.id);

  return (
    <div
      className={`accordion-section ${isActive ? "active" : ""} ${
        isCompleted ? "completed" : ""
      } ${item.isDisabled ? "disabled" : ""}`}
    >
      <div
        className="accordion-header"
        onClick={item.isDisabled ? undefined : onToggle}
        role="button"
        aria-expanded={isActive}
        aria-controls={`accordion-content-${item.id}`}
        tabIndex={item.isDisabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!item.isDisabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="accordion-header-left">
          {item.icon && <div className="accordion-icon">{item.icon}</div>}
          <div className="accordion-title">
            <h3>{item.label}</h3>
            {item.subtitle && <p>{item.subtitle}</p>}
          </div>
        </div>
        <div className="accordion-toggle">
          {isCompleted ? (
            <i className="bx bx-check-circle"></i>
          ) : (
            <i className="bx bx-chevron-down"></i>
          )}
        </div>
      </div>

      {isActive && (
        <div
          className="accordion-content active"
          id={`accordion-content-${item.id}`}
          role="region"
          aria-labelledby={`accordion-header-${item.id}`}
        >
          <div className="accordion-content-inner">{item.content}</div>
        </div>
      )}
    </div>
  );
};
