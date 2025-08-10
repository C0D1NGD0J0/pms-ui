"use client";
import React from "react";
import { useTheme } from "@src/theme/theme.config";
import {
  SkeletonProps as AntSkeletonProps,
  Skeleton as AntSkeleton,
} from "antd";

export interface SkeletonProps extends AntSkeletonProps {
  className?: string;
  type?: "default" | "card" | "list" | "form";
}

const SkeletonComponent: React.FC<SkeletonProps> = ({
  className = "",
  type = "default",
  active = true,
  ...props
}) => {
  const { theme } = useTheme();

  const baseClass = "pms-skeleton";
  const typeClass = `${baseClass}--${type}`;
  const themeClass = `${baseClass}--${theme}`;
  const customClass = [baseClass, typeClass, themeClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={customClass}>
      <AntSkeleton active={active} {...props} />
    </div>
  );
};

// Create a namespace to properly export the component with sub-components
export const Skeleton = Object.assign(SkeletonComponent, {
  Button: AntSkeleton.Button,
  Avatar: AntSkeleton.Avatar,
  Input: AntSkeleton.Input,
  Image: AntSkeleton.Image,
});
