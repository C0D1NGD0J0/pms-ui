import React from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "primary" | "secondary";
  text: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  text,
  className = "",
}) => {
  return <span className={`badge ${variant} ${className}`}>{text}</span>;
};
