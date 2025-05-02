import React, { ChangeEvent, ReactNode } from "react";

export interface PanelHeaderProps {
  headerTitleComponent?: ReactNode;
  header?: {
    title?: string | ReactNode;
  };
  searchOpts?: {
    isVisible?: boolean;
    value: string;
    placeholder?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  } | null;
  filterOpts?: {
    value: string;
    isVisible?: boolean;
    sortDirection?: "asc" | "desc" | "";
    onFilterChange: (value: string) => void;
    options: { label: string; value: string }[];
    onSortDirectionChange?: (sort: "asc" | "desc") => void;
  } | null;
}

export function PanelHeader({
  headerTitleComponent,
  header,
  searchOpts,
  filterOpts,
}: PanelHeaderProps) {
  const isSeachVisible = (searchOpts && searchOpts?.isVisible) || false;
  const isFilterVisible = filterOpts?.isVisible || false;
  const [_sortBy, setSortBy] = React.useState<string>("");
  console.log(filterOpts);
  return (
    <div className="panel-header">
      <div className="panel-header__title">
        {headerTitleComponent ? headerTitleComponent : <h4>{header?.title}</h4>}
      </div>
      {(isSeachVisible || isFilterVisible) && (
        <div className="panel-header__menu">
          {isSeachVisible && (
            <div className="search-bar">
              <input
                type="text"
                placeholder={searchOpts?.placeholder || "Search..."}
                className="search-input"
                value={searchOpts?.value}
                onChange={searchOpts?.onChange}
              />
              <button className="search-btn">
                <i className="bx bx-search"></i>
              </button>
            </div>
          )}
          {isFilterVisible && filterOpts && filterOpts.options?.length > 0 && (
            <div className="filter-options">
              <select
                className="filter-select"
                onChange={(e) => {
                  setSortBy(e.target.value);
                  filterOpts?.onFilterChange(e.target.value);
                }}
              >
                {filterOpts?.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {_sortBy && filterOpts.sortDirection && (
                <button
                  className="sort-direction-btn"
                  onClick={() =>
                    filterOpts.onSortDirectionChange?.(
                      filterOpts.sortDirection === "asc" ? "desc" : "asc"
                    )
                  }
                >
                  <i
                    className={`bx ${
                      filterOpts.sortDirection === "asc"
                        ? "bx-up-arrow-alt"
                        : "bx-down-arrow-alt"
                    }`}
                  ></i>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
