import { Select } from "@components/FormElements";
import React, { ChangeEvent, useCallback, ReactNode } from "react";

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
    filterPlaceholder?: string;
    sortDirection?: "asc" | "desc" | "";
    onFilterChange: (value: string) => void;
    options: { label: string; value: string }[];
    onSortDirectionChange?: (sort: "asc" | "desc") => void;
  } | null;
}

const PanelHeaderComponent = ({
  headerTitleComponent,
  header,
  searchOpts,
  filterOpts,
}: PanelHeaderProps) => {
  const isSeachVisible = (searchOpts && searchOpts?.isVisible) || false;
  const isFilterVisible = filterOpts?.isVisible || false;
  const [_sortBy, setSortBy] = React.useState<string>("");

  const handleFilterChange = useCallback(
    (value: string | React.ChangeEvent<HTMLSelectElement>) => {
      const actualValue =
        typeof value === "string" ? value : value.target.value;
      setSortBy(actualValue);
      filterOpts?.onFilterChange(actualValue);
    },
    [filterOpts]
  );
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
              <Select
                id="filter-select"
                name="filter"
                className="filter-select"
                value={filterOpts.value}
                options={filterOpts.options}
                onChange={handleFilterChange}
                placeholder={filterOpts.filterPlaceholder || "Filter by..."}
              />
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
};

export const PanelHeader = React.memo(PanelHeaderComponent);
