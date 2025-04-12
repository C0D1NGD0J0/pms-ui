"use client";
import Link from "next/link";
import { Table } from "@components/Table";
import React, { ChangeEvent, useState } from "react";
import { PageHeader } from "@components/PageElements";
import { PanelsWrapper, Panel } from "@components/Panel";
import {
  statusFilterOptions,
  propertyColumns,
  properties,
  Property,
} from "@/src/test-data";

export default function Properties() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selected: React.Key[], selectedRows: Property[]) => {
      console.log(`Selected row keys: ${selected}`);
      console.log("Selected rows: ", selectedRows);
      setSelectedRowKeys(selected);
    },
    type: "checkbox" as const,
  };

  const handleBulkAction = () => {
    console.log(`Performing bulk action on: ${selectedRowKeys.join(", ")}`);
    // Implement bulk action logic here
  };

  return (
    <div className="page properties">
      <PageHeader
        title="Property portfolio"
        subtitle="/properties/new"
        headerBtn={
          <Link href="/properties/new" className="btn btn-primary">
            <i className="bx bx-plus-circle"></i>
            Add New Property
          </Link>
        }
      />

      <div className="flex-row">
        <PanelsWrapper>
          {/* {selectedRowKeys.length > 0 && (
            <div className="bulk-actions mb-3">
              <button className="btn btn-secondary" onClick={handleBulkAction}>
                <i className="bx bx-cog"></i>
                Bulk Action ({selectedRowKeys.length})
              </button>
              <button
                className="btn btn-text ml-2"
                onClick={() => setSelectedRowKeys([])}
              >
                Clear Selection
              </button>
            </div>
          )} */}
          <Panel>
            <Table
              columns={propertyColumns}
              dataSource={properties}
              searchOpts={{
                isVisible: true,
                value: "",
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  console.log("Search value:", e.target.value);
                },
              }}
              filterOpts={{
                value: "all",
                isVisible: true,
                options: statusFilterOptions,
                onFilterChange: (value: string) => {
                  console.log("Filter value:", value);
                },
              }}
              pagination={{ pageSize: 10 }}
              rowKey="id"
              withHeader
              rowSelection={rowSelection}
            />
          </Panel>
        </PanelsWrapper>
      </div>
    </div>
  );
}
