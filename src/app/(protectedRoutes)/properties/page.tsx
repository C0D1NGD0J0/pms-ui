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
  } = useGetAllProperties(client?.cuid || "");


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
          <Panel variant="alt-2">
            <Table
              tableVariant="alt-2"
              columns={generatePropertyColumn()}
              dataSource={properties}
              searchOpts={{
                isVisible: true,
                value: "",
                onChange: (e: ChangeEvent<HTMLInputElement>) => void e,
                placeholder: "Search by name, city, or property type",
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
              rowSelection={{
                selectedRowKeys,
                onChange: (keys) => setSelectedRowKeys(keys),
                type: "checkbox",
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
