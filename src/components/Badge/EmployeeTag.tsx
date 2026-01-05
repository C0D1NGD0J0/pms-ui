import React from "react";
import { Tag } from "antd";
import { TagProps } from "antd/lib/tag";

export interface EmployeeTagProps extends TagProps {
  variant?:
    | "skill"
    | "employment"
    | "achievement"
    | "permission"
    | "department";
  size?: "small" | "default" | "large";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const EmployeeTag: React.FC<EmployeeTagProps> = ({
  variant = "skill",
  size = "default",
  icon,
  className = "",
  children,
  ...props
}) => {
  // Get custom class names for styling
  const getTagClass = () => {
    return `employee-tag employee-tag-${variant} employee-tag-${size}`;
  };

  const combinedClassName = `${getTagClass()} ${className}`.trim();

  return (
    <Tag
      {...props}
      className={combinedClassName}
      role="status"
      aria-label={`${variant}: ${children}`}
    >
      {icon && <span className="employee-tag-icon">{icon}</span>}
      <span className="employee-tag-text">{children}</span>
    </Tag>
  );
};

// Predefined variants for common use cases
export const SkillTag: React.FC<Omit<EmployeeTagProps, "variant">> = (
  props
) => <EmployeeTag {...props} variant="skill" />;

export const EmploymentTag: React.FC<Omit<EmployeeTagProps, "variant">> = (
  props
) => <EmployeeTag {...props} variant="employment" />;

export const AchievementTag: React.FC<Omit<EmployeeTagProps, "variant">> = (
  props
) => <EmployeeTag {...props} variant="achievement" />;

export const PermissionTag: React.FC<Omit<EmployeeTagProps, "variant">> = (
  props
) => <EmployeeTag {...props} variant="permission" />;

export const DepartmentTag: React.FC<Omit<EmployeeTagProps, "variant">> = (
  props
) => <EmployeeTag {...props} variant="department" />;

EmployeeTag.displayName = "EmployeeTag";
