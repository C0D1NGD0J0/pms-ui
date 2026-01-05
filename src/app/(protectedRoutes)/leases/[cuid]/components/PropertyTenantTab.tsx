import React from "react";
import Link from "next/link";
import { Table } from "@components/Table";
import { renderTruncatedText } from "@src/components/Utils";
import { PropertyTypeManager } from "@utils/propertyTypeManager";
import {
  LeasePropertyDetail,
  LeaseUnitDetails,
  LeaseDetailData,
} from "@src/interfaces/lease.interface";

interface PropertyTenantTabProps {
  tenantInfo?: LeaseDetailData["tenant"];
  unitInfo?: LeaseUnitDetails;
  propertyInfo: Partial<LeasePropertyDetail>;
  additionalOccupants?: LeaseDetailData["coTenants"];
}

export const PropertyTenantTab: React.FC<PropertyTenantTabProps> = ({
  tenantInfo,
  propertyInfo,
  additionalOccupants,
  unitInfo,
}) => {
  const isMultiUnit = PropertyTypeManager.supportsMultipleUnits(
    propertyInfo.propertyType || ""
  );

  const property = [
    {
      label: "Property Name",
      value: renderTruncatedText(propertyInfo.name || "", "150px"),
    },
    ...(isMultiUnit && unitInfo
      ? [
          {
            label: "Unit Number",
            value: renderTruncatedText(unitInfo.unitNumber || "N/A", "150px"),
          },
        ]
      : []),
    {
      label: "Property Type",
      value: renderTruncatedText(propertyInfo.propertyType || "", "150px"),
    },
    {
      label: "Bedrooms / Bathrooms",
      value:
        isMultiUnit && unitInfo
          ? `${unitInfo.specifications?.rooms || 0} / ${
              unitInfo.specifications?.bathrooms || 0
            }`
          : `${propertyInfo.specifications?.bedrooms || 0} / ${
              propertyInfo.specifications?.bathrooms || 0
            }`,
    },
    {
      label: "Square Footage",
      value:
        isMultiUnit && unitInfo
          ? unitInfo.specifications?.totalArea || 0
          : propertyInfo.specifications?.totalArea || 0,
    },
    { label: "Furnished", value: "No" },
  ];

  return (
    <>
      <h3 className="section-title">Property Information</h3>
      <div className="info-grid">
        {property.map((item, idx) => (
          <div key={idx} className="info-row">
            <div className="info-label">{item.label}:</div>
            <div className="info-value">{item.value}</div>
          </div>
        ))}
      </div>
      {tenantInfo ? (
        <>
          <h3 className="section-title">Primary Tenant</h3>
          <div className="info-grid">
            <div className="info-row">
              <div className="info-label">Name:</div>
              <div className="info-value">{tenantInfo.fullname}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Email:</div>
              <div className="info-value">
                <Link href={`mailto:${tenantInfo.email}`}>
                  {tenantInfo.email}
                </Link>
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">Phone:</div>
              <div className="info-value">
                <Link href={`tel:${tenantInfo.phone}`}>{tenantInfo.phone}</Link>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <h3 className="section-title">Additional Occupants</h3>
      <Table
        dataSource={additionalOccupants || []}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <strong>{text}</strong>,
          },
          {
            title: "Relationship",
            dataIndex: "relationship",
            key: "relationship",
            render: (text: string) => {
              return <strong>{text || "N/A"}</strong>;
            },
          },
          {
            title: "Contact",
            dataIndex: "phone",
            key: "phone",
            render: (text: string, record: any) => {
              return (
                <>
                  <Link href={`tel:${record.phone}`} className="text-sm">
                    {record.phone}
                  </Link>
                  <br />
                  <Link href={`mailto:${record.email}`} className="text-sm">
                    {record.email}
                  </Link>
                </>
              );
            },
          },
          {
            title: "Occupation",
            dataIndex: "occupation",
            key: "occupation",
            render: (job: string) => {
              return <strong>{job || "N/A"}</strong>;
            },
          },
        ]}
        rowKey="email"
        pagination={false}
      />
    </>
  );
};
