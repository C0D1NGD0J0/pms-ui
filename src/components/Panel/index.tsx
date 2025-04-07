import React, { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  header?: {
    title?: string | ReactNode;
    menu?: ReactNode;
  };
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className = "",
  header,
}) => {
  return (
    <div className={`panel ${className}`}>
      {header && (
        <div className="panel-header">
          {header.title && (
            <div className="panel-header__title">
              {typeof header.title === "string" ? (
                <h4>{header.title}</h4>
              ) : (
                header.title
              )}
            </div>
          )}
          {header.menu && (
            <div className="panel-header__menu">{header.menu}</div>
          )}
        </div>
      )}
      <div className="panel-content">{children}</div>
    </div>
  );
};

export const PanelHeaderTitle: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <div className="panel-header__title">
    {typeof children === "string" ? <h4>{children}</h4> : children}
  </div>
);

export const PanelHeaderMenu: React.FC<{ children: ReactNode }> = ({
  children,
}) => <div className="panel-header__menu">{children}</div>;
