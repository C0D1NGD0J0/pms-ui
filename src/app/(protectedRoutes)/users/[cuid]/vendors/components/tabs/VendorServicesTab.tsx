import React from "react";
import { TableColumn, Table } from "@components/Table";
import { VendorDetailResponse } from "@interfaces/user.interface";

interface ServiceData {
  id: string;
  service: string;
  category: string;
  rate: string;
  availability: string;
  responseTime: string;
}

interface VendorServicesTabProps {
  vendor: VendorDetailResponse;
}

export const VendorServicesTab: React.FC<VendorServicesTabProps> = ({
  vendor,
}) => {
  const formatServiceName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const servicesOffered = vendor.vendorInfo?.servicesOffered
    ? Object.entries(vendor.vendorInfo.servicesOffered)
        .filter(([, value]) => value === true)
        .map(([key]) => formatServiceName(key))
    : [];

  // Prepare service data for the Table component
  const serviceData: ServiceData[] =
    servicesOffered.length > 0
      ? servicesOffered.map((service, index) => ({
          id: `service-${index}`,
          service: service,
          category: service,
          rate: "Contact for Quote",
          availability: "Business Hours",
          responseTime: "Same Day",
        }))
      : [
          {
            id: "service-default",
            service: "General Maintenance",
            category: "General",
            rate: "Contact for Quote",
            availability: "Business Hours",
            responseTime: "Same Day",
          },
        ];

  // Define table columns for services
  const serviceColumns: TableColumn<ServiceData>[] = [
    {
      title: "Service",
      dataIndex: "service",
      render: (service: string) => <strong>{service}</strong>,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category: string) => (
        <span className="service-badge">
          <i className="bx bx-wrench"></i> {category}
        </span>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (rate: string) => <span className="price">{rate}</span>,
    },
    {
      title: "Availability",
      dataIndex: "availability",
    },
    {
      title: "Response Time",
      dataIndex: "responseTime",
    },
  ];

  return (
    <div className="services-tab">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Services & Pricing
      </h3>
      <Table
        columns={serviceColumns}
        dataSource={serviceData}
        rowKey="id"
        pagination={false}
        tableVariant="default"
      />
    </div>
  );
};

VendorServicesTab.displayName = "VendorServicesTab";
