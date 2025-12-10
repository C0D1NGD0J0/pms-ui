"use client";

import Link from "next/link";
import { InsightCard } from "@components/Cards";
import { PageHeader } from "@components/PageElements";
import { TableColumn, Table } from "@components/Table";
import { PanelsWrapper, Panel } from "@components/Panel";
import { FilterOption } from "@interfaces/common.interface";
import { LeaseListItem } from "@interfaces/lease.interface";

interface LeasesListViewProps {
  cuid: string;
  leases: LeaseListItem[];
  totalCount: number;
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total?: number;
    order?: "asc" | "desc" | "";
  };
  filters: Record<string, unknown>;
  filterOptions: FilterOption[];
  handleSortDirectionChange: (direction: "asc" | "desc") => void;
  handlePageChange: (page: number, pageSize?: number) => void;
  handleFilterChange: (key: string, value: unknown) => void;
  insightData: Array<{
    id?: string;
    title: string;
    value: string | number;
    icon?: React.ReactElement | string;
    description?: React.ReactElement;
    trend?: string;
  }>;
  leaseColumns: TableColumn<LeaseListItem>[];
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
                value: (filters?.status as string) || "",
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
