/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Panel } from "@components/Panel";
import React, { ReactNode, useState } from "react";
import {
  TableProps as AntTableProps,
  TablePaginationConfig,
  Table as AntTable,
} from "antd";

// Define column configuration
export interface TableColumn<T> {
  title: string;
  dataIndex: keyof T | string;
  key?: string;
  render?: (value: any, record: T) => ReactNode;
  isStatus?: boolean;
  sorter?: boolean | ((a: T, b: T) => number);
  width?: number | string;
}

// Define table props
export interface TableProps<T> {
  columns: TableColumn<T>[];
  dataSource: T[];
  title?: string | ReactNode;
  searchOpts?: {
    value: string;
    onChange: (value: string) => void;
  } | null;
  filterOpts?: {
    value: string;
    options: { label: string; value: string }[];
    onFilterChange: (value: string) => void;
  } | null;
  loading?: boolean;
  rowKey?: string;
  className?: string;
  emptyText?: string;
  antTableProps?: AntTableProps<T>;
  variant?: "withoutHeader" | "withHeader";
  pagination?: boolean | { pageSize?: number; showSizeChanger?: boolean };
}

export function Table<T extends object>({
  columns,
  dataSource,
  title,
  searchOpts,
  filterOpts,
  loading = false,
  rowKey = "id",
  pagination = true,
  className = "",
  emptyText = "No data found",
  antTableProps,
  variant = "withoutHeader",
}: TableProps<T>) {
  const [searchValue, setSearchValue] = useState(searchOpts?.value || "");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    searchOpts && searchOpts.onChange(value);
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
    filterOpts && filterOpts.onFilterChange(value);
  };

  // Define column configurations for Ant Table
  const tableColumns = columns.map((column) => ({
    title: column.title,
    dataIndex: column.dataIndex as string,
    key: column.key || (column.dataIndex as string),
    sorter: column.sorter,
    width: column.width,
    render:
      column.render ||
      (column.isStatus ? (value: any) => renderStatusBadge(value) : undefined),
  }));

  // Render status badges
  const renderStatusBadge = (status: string) => {
    if (!status) return null;

    let statusClass = "muted";
    const statusLower = status.toLowerCase();

    if (
      statusLower.includes("active") ||
      statusLower.includes("vacant") ||
      statusLower.includes("success") ||
      statusLower.includes("resolved") ||
      statusLower.includes("confirmed")
    ) {
      statusClass = "success";
    } else if (
      statusLower.includes("pending") ||
      statusLower.includes("warning") ||
      statusLower.includes("low")
    ) {
      statusClass = "warning";
    } else if (
      statusLower.includes("error") ||
      statusLower.includes("occupied") ||
      statusLower.includes("urgent") ||
      statusLower.includes("danger") ||
      statusLower.includes("open") ||
      statusLower.includes("not renewing")
    ) {
      statusClass = "danger";
    }

    return <span className={`status ${statusClass}`}>{status}</span>;
  };

  // Configure pagination - fixed to match Ant Design's expected types
  const paginationConfig: false | TablePaginationConfig =
    pagination === false
      ? false
      : typeof pagination === "boolean"
      ? {
          position: ["bottomCenter"],
          className: "pagination",
        }
      : {
          pageSize: pagination?.pageSize || 10,
          showSizeChanger: pagination?.showSizeChanger || false,
          position: ["bottomCenter"],
          className: "pagination",
        };
  const tableComponent = (
    <AntTable
      columns={tableColumns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      pagination={paginationConfig}
      locale={{ emptyText }}
      className="panel-content-table custom-table-wrapper"
      {...antTableProps}
      // Override the default Ant Design styles with our custom styles
      components={{
        table: (props) => <table {...props} className="custom-table"></table>,
        header: {
          wrapper: (props) => (
            <thead {...props} className="custom-thead"></thead>
          ),
          row: (props) => <tr {...props} className="custom-tr"></tr>,
          cell: (props) => <th {...props} className="custom-th"></th>,
        },
        body: {
          wrapper: (props) => (
            <tbody {...props} className="custom-tbody"></tbody>
          ),
          row: (props) => <tr {...props} className="custom-tr"></tr>,
          cell: (props) => <td {...props} className="custom-td"></td>,
        },
      }}
    />
  );

  if (variant === "withHeader") {
    return (
      <Panel
        header={{
          title,
        }}
        searchOpts={{
          value: searchValue,
          onSearchChange: handleSearch,
        }}
        filterOpts={{
          options: filterOpts?.options || [],
          onFilterChange: handleFilterChange,
        }}
      >
        {tableComponent}
      </Panel>
    );
  }

  return (
    <div className={`panel ${className}`}>
      <div className="panel-content">{tableComponent}</div>
    </div>
  );
}

// Export pagination type for reuse
export type PaginationType = false | TablePaginationConfig;
