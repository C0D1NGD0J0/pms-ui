import React from "react";

export const PageHeader = ({
  title,
  subtitle,
  headerBtn,
}: {
  title: string;
  subtitle?: string;
  headerBtn?: React.ReactNode;
}) => (
  <div className="page-header">
    <div className="page-header__title">
      <h2>{title}</h2>
      {subtitle && <small>{subtitle}</small>}
    </div>
    {headerBtn && <div className="page-header__actions">{headerBtn}</div>}
  </div>
);
