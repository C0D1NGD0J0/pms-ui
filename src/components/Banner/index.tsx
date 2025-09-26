"use client";
import React from "react";
import { Button } from "@components/FormElements/Button";

interface BannerAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline";
}

interface BannerProps {
  type?: "warning" | "success" | "error" | "info";
  title: string;
  description?: string | React.ReactNode;
  icon?: string; // boxicon class name (e.g., "bx-time-five")
  actions?: BannerAction[];
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  type = "info",
  title,
  description,
  icon,
  actions = [],
  dismissible = false,
  onDismiss,
  className = "",
}) => {
  return (
    <div
      className={`banner banner-${type} ${className}`}
      role="banner"
      aria-live="polite"
    >
      <div className="banner-content">
        {icon && (
          <div className="banner-content__icon">
            <i className={`bx ${icon}`}></i>
          </div>
        )}

        <div className="banner-content__info">
          <div className="title">
            <strong>{title}</strong>
          </div>
          {description && <div className="description">{description}</div>}
        </div>

        <div className="banner-content__actions">
          {actions.map((action, index) => (
            <Button
              key={index}
              label={action.label}
              onClick={action.onClick}
              className={`btn-${action.variant || "secondary"}`}
            />
          ))}

          {dismissible && (
            <button
              type="button"
              className="dismiss-btn"
              onClick={onDismiss}
              aria-label="Dismiss banner"
            >
              <i className="bx bx-x"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
