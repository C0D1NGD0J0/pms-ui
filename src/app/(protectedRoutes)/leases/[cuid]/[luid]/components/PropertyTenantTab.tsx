import React from "react";
import { Table } from "@components/Table";
import { StatusBadge } from "@components/Badge";

interface PropertyTenantTabProps {
  tenant: {
    name: string;
    initials: string;
    email: string;
    phone: string;
  };
  additionalOccupants: Array<{
    name: string;
    relationship: string;
    contact: string;
    status: string;
  }>;
}

export const PropertyTenantTab: React.FC<PropertyTenantTabProps> = ({
  tenant,
  additionalOccupants,
}) => {
  const propertyInfo = [
    { label: "Property Name", value: "Sunset Apartments" },
    { label: "Unit Number", value: "304" },
    { label: "Property Type", value: "Apartment" },
    { label: "Bedrooms / Bathrooms", value: "2 Bed / 2 Bath" },
    { label: "Square Footage", value: "1,150 sq ft" },
    { label: "Furnished", value: "Unfurnished" },
  ];

  return (
    <div>
      <h3 className="section-title">Property Information</h3>
      <div className="info-grid">
        {propertyInfo.map((item, idx) => (
          <div key={idx} className="info-item">
            <div className="info-item__label">{item.label}</div>
            <div className="info-item__value">{item.value}</div>
          </div>
        ))}
      </div>

      <h3 className="section-title">Primary Tenant</h3>
      <div className="tenant-card">
        <div className="tenant-card__avatar">{tenant.initials}</div>
        <div className="tenant-card__info">
          <div className="tenant-card__name">{tenant.name}</div>
          <div className="tenant-card__contact">
            <i className="bx bx-envelope"></i> {tenant.email}
          </div>
          <div className="tenant-card__contact">
            <i className="bx bx-phone"></i> {tenant.phone}
          </div>
        </div>
        <div className="tenant-card__actions">
          <button className="icon-btn" title="Message">
            <i className="bx bx-message"></i>
          </button>
          <button className="icon-btn" title="Call">
            <i className="bx bx-phone"></i>
          </button>
        </div>
      </div>

      <h3 className="section-title">Additional Occupants</h3>
      <Table
        dataSource={additionalOccupants}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <strong>{text}</strong>,
          },
          { title: "Relationship", dataIndex: "relationship", key: "relationship" },
          { title: "Contact", dataIndex: "contact", key: "contact" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
              <StatusBadge status={status === "approved" ? "active" : "pending"}>
                {status}
              </StatusBadge>
            ),
          },
        ]}
        pagination={false}
      />
    </div>
  );
};
