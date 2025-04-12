import React from "react";

export function PanelContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`panel-content ${className}`}>{children}</div>;
}
