"use client";
import { Panel } from "@components/Panel";
import { Button } from "@components/FormElements";
import React, { ChangeEvent, useState } from "react";
import { TableColumn, Table } from "@components/Table";
import { FilteredUser } from "@interfaces/user.interface";
import { IPaginationQuery } from "@interfaces/utils.interface";

import { FilterOption } from "../hooks/useGetVendors";

interface VendorTableViewProps {
  vendors: FilteredUser[];
  filterOptions: FilterOption[];
  handlePageChange: (page: number) => void;
  handleSortByChange: (sortBy: string) => void;
  handleSortChange: (sort: "asc" | "desc") => void;
  isLoading?: boolean;
  onEdit: (vendor: FilteredUser) => void;
  onMessage: (vendor: FilteredUser) => void;
  onViewDetails: (vendor: FilteredUser) => void;
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

  const formatServiceType = (serviceType?: string) => {
    if (!serviceType) return "N/A";
    return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
  };

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
          {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }, (_, i) => (
            <i key={`empty-${i}`} className="bx bx-star"></i>
          ))}
        </div>
      </div>
    );
  };

  const vendorColumns: TableColumn<FilteredUser>[] = [
    {
      title: "Company",
      dataIndex: "company",
      render: (_, record) => (
        <div>
          <div className="table-primary-text">
            {record.vendorInfo?.companyName || record.displayName}
          </div>
          <div className="table-secondary-text">
            {formatServiceType(record.vendorInfo?.serviceType)}
          </div>
        </div>
      ),
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      render: (_, record) => (
        <div className="table-primary-text">
          {record.vendorInfo?.contactPerson || record.fullName || record.displayName}
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
            className="btn-sm btn-icon"
            onClick={() => onViewDetails(record)}
            title="View vendor details"
            label=""
            icon={<i className="bx bx-show"></i>}
          />
          <Button
            className="btn-sm btn-icon"
            onClick={() => onEdit(record)}
            title="Edit vendor information"
            label=""
            icon={<i className="bx bx-edit"></i>}
          />
          <Button
            className="btn-sm btn-icon"
            onClick={() => onMessage(record)}
            title="Send message to vendor"
            label=""
            icon={<i className="bx bx-envelope"></i>}
          />
        </div>
      ),
    },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="flex-row">
      <div className="panels">
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
            rowKey="id"
          />
        </Panel>
      </div>
    </div>
  );
};