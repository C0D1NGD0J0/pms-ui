import React, { useEffect, useState } from "react";

import { AccordionContext } from "../hook";
import { PreviewDrawer } from "./PreviewDrawer";
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
  // Drawer props
  showPreviewDrawer = false,
  renderPreview,
  onPreviewToggle,
  previewData,
  previewTitle = "Preview",
  previewActions,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(
    defaultActiveId || items[0]?.id || null
  );
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(items.filter((item) => item.isCompleted).map((item) => item.id))
  );

  useEffect(() => {
    if (defaultActiveId && defaultActiveId !== activeId) {
      setActiveId(defaultActiveId);
    }
  }, [defaultActiveId]);

  useEffect(() => {
    if (activeId && onChange) {
      onChange(activeId);
    }
  }, [activeId, onChange]);

  const handleToggle = (id: string) => {
    if (allowMultipleOpen) {
      setActiveId(id);
    } else {
      setActiveId((prevId) => (prevId === id ? null : id));
    }
  };

  const markAsCompleted = (id: string) => {
    setCompletedIds((prev) => new Set(prev).add(id));
  };

  const handleSidebarClick = (id: string) => {
    setActiveId(id);
    const section = document.getElementById(`accordion-section-${id}`);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const completedCount = items.filter(
    (item) => item.isCompleted || completedIds.has(item.id)
  ).length;

  const activeItem = items.find((item) => item.id === activeId) || null;

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
    if (onPreviewToggle) {
      onPreviewToggle(previewData);
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <AccordionContext.Provider
      value={{ activeId, setActiveId, completedIds, markAsCompleted }}
    >
      <div
        className={`accordion-container ${
          showSidebar ? "with-sidebar" : ""
        } ${className}`}
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
                      type="button"
                      className={`accordion-nav-item ${
                        isActive ? "active" : ""
                      } ${isCompleted ? "completed" : ""} ${
                        item.hasError ? "has-error" : ""
                      }`}
                      onClick={() => handleSidebarClick(item.id)}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {item.icon && (
                        <span className="accordion-nav-icon">{item.icon}</span>
                      )}
                      <span className="accordion-nav-label">{item.label}</span>
                      {item.hasError && (
                        <span
                          className="error-indicator"
                          aria-label="This section has errors"
                        ></span>
                      )}
                      {isCompleted && !item.hasError && (
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

            {/* Preview Drawer Toggle Button */}
            {showPreviewDrawer && (
              <div className="accordion-preview-controls">
                <button
                  type="button"
                  className="accordion-preview-btn"
                  onClick={handleDrawerToggle}
                  aria-label="Toggle preview drawer"
                >
                  <i className="bx bx-show"></i>
                  <span>Preview</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="accordion-sections">
          {activeId ? (
            items
              .filter((item) => activeId === item.id)
              .map((item) => (
                <div key={item.id} id={`accordion-section-${item.id}`}>
                  <AccordionSection
                    item={item}
                    isActive={true}
                    onToggle={() => handleToggle(item.id)}
                  />
                </div>
              ))
          ) : (
            <div className="accordion-empty-state">
              <div className="accordion-empty-icon">
                <i className="bx bx-folder-open"></i>
              </div>
              <h3>Select a section to begin</h3>
              <p>
                Choose a section from the sidebar to view and edit its content
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Drawer */}
      {showPreviewDrawer && (
        <PreviewDrawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          title={previewTitle}
          actions={previewActions}
        >
          {renderPreview ? renderPreview(activeItem, activeId) : null}
        </PreviewDrawer>
      )}
    </AccordionContext.Provider>
  );
};
