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
  showRowNumbers?: boolean;
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
  showRowNumbers = false,
}: TableProps<T>) {
  const [searchValue, setSearchValue] = useState(searchOpts?.value || "");

  const renderStatusBadge = (status: string) => {
    if (!status) return null;
    let statusClass = "muted";
    const statusLower = status.toLowerCase();

    if (
      statusLower.includes("active") ||
      statusLower.includes("available") ||
      statusLower.includes("vacant") ||
      statusLower.includes("sent") ||
      statusLower.includes("success") ||
      statusLower.includes("resolved") ||
      statusLower.includes("confirmed")
    ) {
      statusClass = "success";
    } else if (
      statusLower.includes("pending") ||
      statusLower.includes("maintenance") ||
      statusLower.includes("warning") ||
      statusLower.includes("low") ||
      statusLower.includes("draft")
    ) {
      statusClass = "warning";
    } else if (
      statusLower.includes("error") ||
      statusLower.includes("occupied") ||
      statusLower.includes("urgent") ||
      statusLower.includes("danger") ||
      statusLower.includes("open") ||
      statusLower.includes("revoked") ||
      statusLower.includes("not renewing")
    ) {
      statusClass = "danger";
    }

    return <span className={`status ${statusClass}`}>{status}</span>;
  };

  let tableColumns = columns.map((column, index) => ({
    title: column.title,
    dataIndex: column.dataIndex as string,
    key: `${new Date()}-${index}`,
    sorter: column.sorter,
    width: column.width,
    render:
      column.render ||
      (column.isStatus
        ? (value: string) => renderStatusBadge(value)
        : undefined),
  }));

  if (showRowNumbers) {
    const rowNumberColumn = {
      title: "#",
      dataIndex: "rowIndex",
      key: "rowIndex",
      width: 60,
      sorter: undefined,
      render: (value: unknown, record: T, index?: number) => {
        let rowNum = index !== undefined ? index + 1 : 1;

        if (
          pagination &&
          typeof pagination !== "boolean" &&
          pagination.current &&
          pagination.pageSize &&
          index !== undefined
        ) {
          rowNum = (pagination.current - 1) * pagination.pageSize + index + 1;
        }

        return rowNum;
      },
    };

    tableColumns = [rowNumberColumn, ...tableColumns];
  }

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

  const CustomTable = React.forwardRef<HTMLTableElement, any>(
    function CustomTable(props, ref) {
      return (
        <table
          {...props}
          ref={ref}
          className={`${
            tableVariant === "alt-2" ? "table-alt-2" : "custom-table"
          }`}
        />
      );
    }
  );

  const HeaderWrapper = React.forwardRef<HTMLTableSectionElement, any>(
    function HeaderWrapper(props, ref) {
      return <thead {...props} ref={ref} className="custom-thead" />;
    }
  );

  const HeaderRow = React.forwardRef<HTMLTableRowElement, any>(
    function HeaderRow(props, ref) {
      return <tr {...props} ref={ref} className="custom-tr" />;
    }
  );

  const HeaderCell = React.forwardRef<HTMLTableCellElement, any>(
    function HeaderCell(props, ref) {
      return <th {...props} ref={ref} className="custom-th" />;
    }
  );

  const BodyWrapper = React.forwardRef<HTMLTableSectionElement, any>(
    function BodyWrapper(props, ref) {
      return <tbody {...props} ref={ref} className="custom-tbody" />;
    }
  );

  const BodyRow = React.forwardRef<HTMLTableRowElement, any>(function BodyRow(
    props,
    ref
  ) {
    return <tr {...props} ref={ref} className="custom-tr" />;
  });

  const BodyCell = React.forwardRef<HTMLTableCellElement, any>(
    function BodyCell(props, ref) {
      return <td {...props} ref={ref} className="custom-td" />;
    }
  );

  CustomTable.displayName = "CustomTable";
  HeaderWrapper.displayName = "HeaderWrapper";
  HeaderRow.displayName = "HeaderRow";
  HeaderCell.displayName = "HeaderCell";
  BodyWrapper.displayName = "BodyWrapper";
  BodyRow.displayName = "BodyRow";
  BodyCell.displayName = "BodyCell";

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
        table: CustomTable,
        header: {
          wrapper: HeaderWrapper,
          row: HeaderRow,
          cell: HeaderCell,
        },
        body: {
          wrapper: BodyWrapper,
          row: BodyRow,
          cell: BodyCell,
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
            filterPlaceholder: filterOpts?.filterPlaceholder || "Filter by...",
            onSortDirectionChange: filterOpts?.onSortDirectionChange,
            ...filterOpts,
          }}
        />
      )}
      <PanelContent>{tableComponent}</PanelContent>
    </>
  );
}

Table.displayName = "Table";

export type PaginationType = false | TablePaginationConfig;
