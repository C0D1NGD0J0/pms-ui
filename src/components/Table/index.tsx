/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { ReactNode, useState } from "react";
import { PanelHeaderProps, PanelContent, PanelHeader } from "@components/Panel";
import {
  TableProps as AntTableProps,
  TablePaginationConfig,
  Table as AntTable,
} from "antd";

export interface TableColumn<T> {
  title: string;
  dataIndex: keyof T | string;
  key?: string;
  render?: (value: any, record: T) => ReactNode;
  isStatus?: boolean;
  sorter?: boolean | ((a: T, b: T) => number);
  width?: number | string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  dataSource: T[];
  headerTitle?: string;
  searchOpts?: PanelHeaderProps["searchOpts"] | null;
  filterOpts?: PanelHeaderProps["filterOpts"] | null;
  loading?: boolean;
  rowKey?: string;
  className?: string;
  emptyText?: string;
  antTableProps?: AntTableProps<T>;
  withHeader?: boolean;
  pagination?: boolean | Partial<TablePaginationConfig>;
  tableVariant?: "default" | "alt-2";
  rowSelection?: {
    type?: "checkbox" | "radio";
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean; name?: string };
  };
}

export function Table<T extends object>({
  columns,
  dataSource,
  loading = false,
  rowKey = "id",
  pagination = true,
  withHeader = false,
  headerTitle,
  emptyText = "No data found",
  antTableProps,
  searchOpts,
  filterOpts,
  rowSelection,
  tableVariant = "default",
}: TableProps<T>) {
  const [searchValue, setSearchValue] = useState(searchOpts?.value || "");

  const tableColumns = columns.map((column, index) => ({
    title: column.title,
    dataIndex: column.dataIndex as string,
    key: `${new Date()}-${index}`,
    sorter: column.sorter,
    width: column.width,
    render:
      column.render ||
      (column.isStatus ? (value: any) => renderStatusBadge(value) : undefined),
  }));

  const renderStatusBadge = (status: string) => {
    if (!status) return null;
    let statusClass = "muted";
    const statusLower = status.toLowerCase();

    if (
      statusLower.includes("active") ||
      statusLower.includes("available") ||
      statusLower.includes("vacant") ||
      statusLower.includes("success") ||
      statusLower.includes("resolved") ||
      statusLower.includes("confirmed")
    ) {
      statusClass = "success";
    } else if (
      statusLower.includes("pending") ||
      statusLower.includes("maintenance") ||
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

  const paginationConfig: false | TablePaginationConfig =
    pagination === false
      ? false
      : typeof pagination === "boolean"
      ? {
          position: ["bottomCenter"],
          className: "pagination",
        }
      : {
          total: pagination.total,
          pageSize: pagination.pageSize,
          current: pagination.current,
          onChange: pagination.onChange,
          position: ["bottomCenter"],
          className: "pagination",
          ...pagination,
        };
  const tableComponent = (
    <AntTable
      columns={tableColumns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      pagination={paginationConfig}
      locale={{ emptyText }}
      rowSelection={rowSelection}
      className="panel-content-table custom-table-wrapper"
      {...antTableProps}
      components={{
        table: (props) => (
          <table
            {...props}
            className={`${
              tableVariant === "alt-2" ? "table-alt-2" : "custom-table"
            }`}
          ></table>
        ),
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    searchOpts && searchOpts.onChange?.(e);
  };

  const handleFilterChange = (value: string) => {
    filterOpts && filterOpts.onFilterChange(value);
  };

  return (
    <>
      {withHeader && (
        <PanelHeader
          header={{
            title: headerTitle || "",
          }}
          searchOpts={{
            isVisible: searchOpts?.isVisible || false,
            placeholder: searchOpts?.placeholder || "Search...",
            value: searchValue,
            onChange: handleSearch,
          }}
          filterOpts={{
            value: filterOpts?.value || "all",
            isVisible: filterOpts?.isVisible || false,
            options: filterOpts?.options || [],
            onFilterChange: handleFilterChange,
            sortDirection: filterOpts?.sortDirection || "desc",
            onSortDirectionChange: filterOpts?.onSortDirectionChange,
          }}
        />
      )}
      <PanelContent>{tableComponent}</PanelContent>
    </>
  );
}

export type PaginationType = false | TablePaginationConfig;
