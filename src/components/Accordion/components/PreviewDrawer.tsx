import React from "react";

export interface PreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const PreviewDrawer: React.FC<PreviewDrawerProps> = ({
  isOpen,
  onClose,
  title = "Preview",
  children,
  actions,
}) => {
  return (
    <div className={`preview-drawer ${isOpen ? "preview-drawer-open" : ""}`}>
      <div className="preview-drawer-overlay" onClick={onClose}></div>
      <div className="preview-drawer-content">
        <div className="preview-drawer-header">
          <h3>{title}</h3>
          <button className="preview-drawer-close" onClick={onClose}>
            <i className="bx bx-x"></i>
          </button>
        </div>
        <div className="preview-drawer-body">{children}</div>
        {actions && <div className="preview-drawer-footer">{actions}</div>}
      </div>
    </div>
  );
};
