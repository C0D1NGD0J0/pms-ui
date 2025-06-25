"use client";
import Link from "next/link";
import { Table } from "@components/Table";
import { useAuth } from "@store/auth.store";
import { Button } from "@components/FormElements";
import React, { ChangeEvent, useState } from "react";
import { PageHeader } from "@components/PageElements";
import { useGetAllProperties } from "@properties/hooks";
import { CsvUploadModal } from "@properties/components";
import { PanelsWrapper, Panel } from "@components/Panel";

import { generatePropertyColumn } from "./utils/index";

export default function Properties() {
  const { client } = useAuth();
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const {
    filterOptions,
    properties,
    totalCount,
    pagination,
    handleSortChange,
    handlePageChange,
    handleSortByChange,
  } = useGetAllProperties(client?.csub || "");

  const rowSelection = {
    selectedRowKeys,
    onChange: (selected: React.Key[], selectedRows: IProperty[]) => {
      console.log(`Selected row keys: ${selected}`);
      console.log("Selected rows: ", selectedRows);
      setSelectedRowKeys(selected);
    },
    type: "checkbox" as const,
  };

  const openCsvModal = () => {
    setIsCsvModalOpen(true);
  };

  const closeCsvModal = () => {
    setIsCsvModalOpen(false);
  };

  return (
    <div className="page properties">
      <PageHeader
        title="Property portfolio"
        subtitle="/properties/new"
        headerBtn={
          <>
            <Button
              label="Import CSV"
              onClick={openCsvModal}
              icon={<i className="bx bx-upload"></i>}
              className="btn btn-secondary mr-2"
            />
            <Link href="/properties/new" className="btn btn-primary">
              <i className="bx bx-plus-circle"></i>
              Add New Property
            </Link>
          </>
        }
      />

      <div className="flex-row">
        <PanelsWrapper>
          <Panel>
            <Table
              tableVariant="default"
              columns={generatePropertyColumn()}
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
                options: filterOptions,
                onFilterChange: (value: string) => {
                  handleSortByChange(value);
                },
                sortDirection: pagination.sort,
                onSortDirectionChange: (sort: "asc" | "desc") => {
                  handleSortChange(sort);
                },
              }}
              pagination={{
                total: totalCount,
                current: pagination.page,
                pageSize: pagination.limit,
                onChange: (page: number) => {
                  handlePageChange(page);
                },
              }}
              rowKey="pid"
              withHeader
            />
          </Panel>
        </PanelsWrapper>
      </div>
      <CsvUploadModal isOpen={isCsvModalOpen} onClose={closeCsvModal} />
    </div>
  );
}
