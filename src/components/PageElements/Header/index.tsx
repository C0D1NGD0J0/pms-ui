import React from "react";
import { Breadcrumb } from "@components/Breadcrumb";

export const PageHeader = ({
  title,
  subtitle,
  headerBtn,
  breadcrumbItems,
  withBreadcrumb = true,
}: {
  title: string;
  subtitle?: string;
  withBreadcrumb?: boolean;
  headerBtn?: React.ReactNode;
  breadcrumbItems?: Array<{ title: React.ReactNode; href?: string }>;
}) => (
  <div className="page-header">
    <div className="page-header__title">
      <h2>{title}</h2>
      {subtitle && <small>{subtitle}</small>}
      {withBreadcrumb && <Breadcrumb items={breadcrumbItems} />}
    </div>
    {headerBtn && <div className="page-header__actions">{headerBtn}</div>}
  </div>
);
