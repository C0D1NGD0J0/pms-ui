"use client";
import Link from "next/link";
import { Table } from "@components/Table";
import { useAuth } from "@store/auth.store";
import { Button } from "@components/FormElements";
import React, { ChangeEvent, useState } from "react";
import { PageHeader } from "@components/PageElements";
import { CsvUploadModal } from "@properties/components";
import { useGetAllProperties } from "@properties/hooks";
import { PanelsWrapper, Panel } from "@components/Panel";
import { PropertyChangesModal } from "@components/Property";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";

export default function Properties() {
  const { client } = useAuth();
  const permissions = useUnifiedPermissions();
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);

  const {
    filterOptions,
    properties,
    totalCount,
    pagination,
    handleSortDirectionChange,
    handlePageChange,
    handleSortByChange,
    refetch,
  } = useGetAllProperties(client?.cuid || "");
  const openCsvModal = () => {
    setIsCsvModalOpen(true);
  };

  const closeCsvModal = () => {
    setIsCsvModalOpen(false);
  };

  const openChangesModal = (property: any) => {
    setSelectedProperty(property);
    setIsChangesModalOpen(true);
  };

  const closeChangesModal = () => {
    setSelectedProperty(null);
    setIsChangesModalOpen(false);
  };

  const handleModalSuccess = () => {
    closeChangesModal();
    refetch(); // Refresh the properties list
  };

  if(!client?.cuid) {
    return <div className="page properties">No client selected.</div>;
  };
  
  const propertyColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Property Type",
      dataIndex: "propertyType",
      render: (type: string) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (address: any) => {
        if (address.state !== address.city) {
          return `${address.street}, ${address.city}, ${address.state}, ${address.country}`;
        }
        return `${address.street}, ${address.city}, ${address.country}`;
      },
    },
    {
      title: "Details",
      dataIndex: "specifications",
      render: (specs: any, record: any) => {
        if (
          record.propertyType === "commercial" ||
          record.propertyType === "industrial"
        ) {
          return `${specs?.totalArea || 0} sq ft`;
        }
        return `${specs?.bedrooms || 0} bed, ${specs?.bathrooms || 0} bath, ${
          specs?.totalArea || 0
        } sq ft`;
      },
    },
    { title: "Status", dataIndex: "status", isStatus: true },
    ...(permissions.isManagerOrAbove
      ? [
          {
            title: "Review",
            dataIndex: "pendingChangesPreview",
            render: (pendingChanges: any, record: any) => {
              if (!pendingChanges || !permissions.isManagerOrAbove)
                return "N/A";
              return (
                <div className="flex items-center gap-2">
                  <i
                    className="bx bx-search-alt"
                    onClick={() => openChangesModal(record)}
                  ></i>
                </div>
              );
            },
          },
        ]
      : []),
    {
      title: "Action",
      dataIndex: "pid",
      render: (pid: string, record: any) => {
        const show =
          permissions.isManagerOrAbove ||
          permissions.isOwner("sub", record.createdBy);
        return (
          <div className="action-icons">
            <Link
              href={`/properties/${client.cuid}/${pid}`}
              className="action-icon view-icon"
              title="View Property"
            >
              <i className="bx bx-show"></i>
            </Link>
            {show && client?.cuid && (
              <Link
                href={`/properties/${client.cuid}/${pid}/edit`}
                className="action-icon edit-icon"
                title="Edit Property"
              >
                <i className="bx bx-edit"></i>
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="page properties">
      <PageHeader
        title="Property portfolio"
        headerBtn={
          <>
            {permissions.isManagerOrAbove && (
              <Button
                label="Import CSV"
                onClick={openCsvModal}
                icon={<i className="bx bx-upload"></i>}
                className="btn btn-secondary mr-2"
              />
            )}

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
              columns={propertyColumns}
              dataSource={properties}
              showRowNumbers={true}
              searchOpts={{
                isVisible: true,
                value: "",
                onChange: (e: ChangeEvent<HTMLInputElement>) => void e,
                placeholder: "Search by name, city, or property type",
              }}
              filterOpts={{
                value: pagination.sortBy || "",
                isVisible: true,
                options: filterOptions,
                onFilterChange: (value: string) => {
                  handleSortByChange(value);
                },
                sortDirection: pagination.order,
                onSortDirectionChange: handleSortDirectionChange,
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
      {selectedProperty && (
        <PropertyChangesModal
          visible={isChangesModalOpen}
          property={selectedProperty}
          permission={permissions}
          pendingChanges={selectedProperty.pendingChangesPreview}
          requesterName={
            selectedProperty.approvalDetails?.requestedBy?.name ||
            "Unknown User"
          }
          onSuccess={handleModalSuccess}
          onCancel={closeChangesModal}
        />
      )}
    </div>
  );
}
