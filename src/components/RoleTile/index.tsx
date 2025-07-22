import React from "react";

interface RoleTileProps {
  title: string;
  subtitle: string;
  icon: string; // boxicons class
  isSelected: boolean;
  onClick: () => void;
  value: string;
  className?: string;
}

export const RoleTile: React.FC<RoleTileProps> = ({
  title,
  subtitle,
  icon,
  isSelected,
  onClick,
  className = "",
}) => {
  return (
    <div
      className={`role-tile ${isSelected ? "selected" : ""} ${className}`}
      onClick={onClick}
    >
      <div className="role-tile-icon">
        <i className={icon}></i>
      </div>
      <div className="role-tile-title">{title}</div>
      <div className="role-tile-subtitle">{subtitle}</div>
    </div>
  );
};
