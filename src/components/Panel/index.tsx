import React, { ChangeEvent, ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  header?: {
    title?: string | ReactNode;
  };
  searchOpts?: {
    value: string;
    placeholder?: string;
    onSearchChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  } | null;
  filterOpts?: {
    options: { label: string; value: string }[];
    onFilterChange: (value: string) => void;
  } | null;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className = "",
  header,
  filterOpts = null,
  searchOpts = null,
}) => {
  return (
    <div className={`panel ${className}`}>
      <div className="panel-header">
        <div className="panel-header__title">
          <h4>{header?.title}</h4>
        </div>
        {(searchOpts || filterOpts) && (
          <div className="panel-header__menu">
            {searchOpts && (
              <div className="search-bar">
                <input
                  type="text"
                  placeholder={searchOpts.placeholder || "Search..."}
                  className="search-input"
                  value={searchOpts.value}
                  onChange={searchOpts.onSearchChange}
                />
                <button className="search-btn">
                  <i className="bx bx-search"></i>
                </button>
              </div>
            )}
            {filterOpts && filterOpts.options.length > 0 && (
              <div className="filter-options">
                <select
                  className="filter-select"
                  onChange={(e) => filterOpts.onFilterChange(e.target.value)}
                >
                  {filterOpts.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="panel-content">{children}</div>
    </div>
  );
};
