"use client";

import Link from "next/link";
import { Table } from "@components/Table";
import { InsightCard } from "@components/Cards";
import { PageHeader } from "@components/PageElements";
import { PanelsWrapper, Panel } from "@components/Panel";

interface LeasesListViewProps {
  cuid: string;
  leases: any[];
  totalCount: number;
  isLoading: boolean;
  pagination: any;
  filters: any;
  filterOptions: any[];
  handleSortDirectionChange: (direction: "asc" | "desc") => void;
  handlePageChange: (page: number, pageSize?: number) => void;
  handleFilterChange: (key: string, value: any) => void;
  insightData: any[];
  leaseColumns: any[];
}

export function LeasesListView({
  cuid,
  leases,
  totalCount,
  isLoading,
  pagination,
  filters,
  filterOptions,
  handleSortDirectionChange,
  handlePageChange,
  handleFilterChange,
  insightData,
  leaseColumns,
}: LeasesListViewProps) {
  return (
    <div className="page leases">
      <PageHeader
        title="Leases"
        headerBtn={
          <Link href={`/leases/${cuid}/new`} className="btn btn-primary">
            <i className="bx bx-plus"></i>
            New Lease
          </Link>
        }
      />

      <div className="insights">
        {insightData.map((card) => (
          <InsightCard
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            description={card.description}
          />
        ))}
      </div>

      <div className="flex-row">
        <PanelsWrapper>
          <Panel variant="alt-2">
            <Table
              tableVariant="alt-2"
              columns={leaseColumns}
              dataSource={leases}
              loading={isLoading}
              showRowNumbers={true}
              searchOpts={null}
              filterOpts={{
                isVisible: true,
                value: filters?.status || "",
                options: filterOptions,
                onFilterChange: (value: string) => {
                  handleFilterChange("status", value);
                },
                sortDirection:
                  (pagination?.order as "asc" | "desc" | "") || "desc",
                onSortDirectionChange: () => {
                  const newDirection = pagination?.order === "asc" ? "desc" : "asc";
                  handleSortDirectionChange(newDirection);
                },
              }}
              pagination={{
                current: pagination?.page || 1,
                pageSize: pagination?.limit || 10,
                total: totalCount,
                onChange: handlePageChange,
              }}
              rowKey="luid"
              withHeader
              headerTitle="Lease Portfolio"
            />
          </Panel>
        </PanelsWrapper>
      </div>
    </div>
  );
}
