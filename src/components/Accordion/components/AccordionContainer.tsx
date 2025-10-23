import React, { useState, useEffect } from "react";
import { AccordionContext } from "../hook";
import { AccordionSection } from "./AccordionSection";
import { AccordionContainerProps } from "../interface";

export const AccordionContainer: React.FC<AccordionContainerProps> = ({
  items,
  defaultActiveId,
  onChange,
  showSidebar = true,
  allowMultipleOpen = false,
  className = "",
  ariaLabel = "Accordion",
}) => {
  const [activeId, setActiveId] = useState<string | null>(
    defaultActiveId || items[0]?.id || null
  );
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(items.filter((item) => item.isCompleted).map((item) => item.id))
  );

  useEffect(() => {
    if (activeId && onChange) {
      onChange(activeId);
    }
  }, [activeId, onChange]);

  const handleToggle = (id: string) => {
    if (allowMultipleOpen) {
      // For multiple open mode (future enhancement)
      setActiveId(id);
    } else {
      // Single open mode - toggle current section
      setActiveId((prevId) => (prevId === id ? null : id));
    }
  };

  const markAsCompleted = (id: string) => {
    setCompletedIds((prev) => new Set(prev).add(id));
  };

  const handleSidebarClick = (id: string) => {
    setActiveId(id);
    // Scroll to section
    const section = document.getElementById(`accordion-section-${id}`);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const completedCount = items.filter(
    (item) => item.isCompleted || completedIds.has(item.id)
  ).length;

  return (
    <AccordionContext.Provider
      value={{ activeId, setActiveId, completedIds, markAsCompleted }}
    >
      <div
        className={`accordion-container ${showSidebar ? "with-sidebar" : ""} ${className}`}
        role="region"
        aria-label={ariaLabel}
      >
        {showSidebar && (
          <div className="accordion-sidebar">
            <h4 className="accordion-sidebar-title">Progress</h4>
            <nav className="accordion-nav">
              {items
                .filter((item) => !item.isDisabled)
                .map((item) => {
                  const isCompleted =
                    item.isCompleted || completedIds.has(item.id);
                  const isActive = activeId === item.id;

                  return (
                    <button
                      key={item.id}
                      className={`accordion-nav-item ${
                        isActive ? "active" : ""
                      } ${isCompleted ? "completed" : ""}`}
                      onClick={() => handleSidebarClick(item.id)}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {item.icon && (
                        <span className="accordion-nav-icon">{item.icon}</span>
                      )}
                      <span className="accordion-nav-label">{item.label}</span>
                      {isCompleted && (
                        <i className="bx bx-check-circle accordion-nav-check"></i>
                      )}
                    </button>
                  );
                })}
            </nav>

            <div className="accordion-stats">
              <div className="accordion-stat">
                <span className="accordion-stat-label">Completed</span>
                <span className="accordion-stat-value">
                  {completedCount}/{items.length}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="accordion-sections">
          {items.map((item) => (
            <div key={item.id} id={`accordion-section-${item.id}`}>
              <AccordionSection
                item={item}
                isActive={activeId === item.id}
                onToggle={() => handleToggle(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </AccordionContext.Provider>
  );
};
