"use client";
import { Panel } from "@components/Panel";
import { Button } from "@components/FormElements";
import React, { ChangeEvent, useState } from "react";
import { TableColumn, Table } from "@components/Table";
import { FilteredUserTableData } from "@interfaces/user.interface";
import { IPaginationQuery, FilterOption } from "@interfaces/utils.interface";

interface VendorTableViewProps {
  vendors: FilteredUserTableData[];
  filterOptions: FilterOption[];
  handlePageChange: (page: number) => void;
  handleSortByChange: (sortBy: string) => void;
  handleSortChange: (sort: "asc" | "desc") => void;
  isLoading?: boolean;
  onEdit: (vendor: FilteredUserTableData) => void;
  onMessage: (vendor: FilteredUserTableData) => void;
  onViewDetails: (vendor: FilteredUserTableData) => void;
  pagination: IPaginationQuery;
  totalCount: number;
}

export const VendorTableView: React.FC<VendorTableViewProps> = ({
  vendors,
  filterOptions,
  handlePageChange,
  handleSortByChange,
  handleSortChange,
  isLoading = false,
  onEdit,
  onMessage,
  onViewDetails,
  pagination,
  totalCount,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const formatPhone = (phone?: string) => {
    if (!phone) return "N/A";
    return phone;
  };

  const renderRating = (rating?: number) => {
    if (!rating) return <span className="text-muted">No rating</span>;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="vendor-rating">
        <div className="stars">
          {Array.from({ length: fullStars }, (_, i) => (
            <i key={i} className="bx bxs-star"></i>
          ))}
          {hasHalfStar && <i className="bx bxs-star-half"></i>}
          {Array.from(
            { length: 5 - fullStars - (hasHalfStar ? 1 : 0) },
            (_, i) => (
              <i key={`empty-${i}`} className="bx bx-star"></i>
            )
          )}
        </div>
      </div>
    );
  };

  const vendorColumns: TableColumn<FilteredUserTableData>[] = [
    {
      title: "Company",
      dataIndex: "company",
      render: (_, record) => (
        <div>
          <div className="table-primary-text">
            {record.vendorInfo?.companyName || record.displayName}
          </div>
        </div>
      ),
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      render: (_, record) => (
        <div className="table-primary-text">
          {record.vendorInfo?.contactPerson ||
            record.fullName ||
            record.displayName}
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (_, record) => formatPhone(record.phoneNumber),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (_, record) => (
        <div className="table-secondary-text">{record.email}</div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (_, record) => renderRating(record.vendorInfo?.rating),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="table-actions vendor-actions">
          <Button
            className="btn-sm btn-default"
            onClick={() => onViewDetails(record)}
            title="View vendor details"
            label="View"
          />
          <Button
            className="btn-sm btn-primary"
            onClick={() => onEdit(record)}
            title="Edit vendor information"
            label="Edit"
          />
          <Button
            className="btn-sm btn-secondary"
            onClick={() => onMessage(record)}
            title="Send message to vendor"
            label="Message"
          />
        </div>
      ),
    },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <Panel variant="alt-2">
      <Table
        columns={vendorColumns}
        dataSource={vendors}
        loading={isLoading}
        withHeader={true}
        headerTitle="Vendor Directory"
        searchOpts={{
          value: searchValue,
          isVisible: true,
          placeholder: "Search vendors...",
          onChange: handleSearchChange,
        }}
        filterOpts={{
          value: pagination.sortBy ?? "",
          isVisible: true,
          options: filterOptions,
          filterPlaceholder: "All Vendors",
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
        tableVariant="alt-2"
        rowKey="uid"
      />
    </Panel>
  );
};
