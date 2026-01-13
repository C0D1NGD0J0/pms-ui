import React from "react";
import { IconProps, Icon } from "@components/Icon";

interface EmptyStateProps {
  icon?: React.ReactNode | Omit<IconProps, "size">;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  textVariant?: "light" | "dark";
  type?: "empty" | "error" | "info";
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = "No Data",
  description,
  action,
  type = "empty",
  textVariant = "dark",
}) => {
  const defaultIcons: Record<string, Omit<IconProps, "size">> = {
    empty: { name: "bx-folder-open", variant: "boxicon" },
    error: { name: "bx-error-circle", variant: "boxicon" },
    info: { name: "bx-info-circle", variant: "boxicon" },
  };

  const renderIcon = () => {
    if (!icon && !defaultIcons[type]) return null;

    // If icon is provided and it's a React element, render it directly
    if (icon && React.isValidElement(icon)) {
      return icon;
    }

    // If icon is IconProps object, use it
    if (icon && typeof icon === "object" && "name" in icon) {
      return <Icon {...icon} size="15rem" />;
    }

    // Use default icon for the type
    return <Icon {...defaultIcons[type]} size="15rem" color="white" />;
  };

  return (
    <div className="empty-state">
      <div className="empty-state__content">
        <div className="empty-state__icon">{renderIcon()}</div>
        <h3
          className={`empty-state__title ${textVariant === "light" ? "text-light" : ""}`}
        >
          {title}
        </h3>
        {description && (
          <p
            className={`empty-state__description ${textVariant === "light" ? "text-light" : ""}`}
          >
            {description}
          </p>
        )}
        {action && <div className="empty-state__action">{action}</div>}
      </div>
    </div>
  );
};
