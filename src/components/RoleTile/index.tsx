import React from "react";

interface RoleTileProps {
  title: string;
  subtitle: string;
  icon: string; // boxicons class
  isSelected: boolean;
  onClick: () => void;
  value: string;
  className?: string;
  disabled?: boolean;
}

export const RoleTile: React.FC<RoleTileProps> = ({
  title,
  subtitle,
  icon,
  isSelected,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <div
      className={`role-tile ${isSelected ? "selected" : ""} ${disabled ? "disabled" : ""} ${className}`}
      onClick={disabled ? undefined : onClick}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div className="role-tile-icon">
        <i className={icon}></i>
      </div>
      <div className="role-tile-title">{title}</div>
      <div className="role-tile-subtitle">{subtitle}</div>
    </div>
  );
};
