"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { Skeleton } from "@components/Skeleton";
import { ListItem } from "@components/ListItem";
import { Button } from "@components/FormElements";
import { TabItem } from "@components/Tab/interface";
import { TableColumn, Table } from "@components/Table";
import { TabContainer } from "@components/Tab/components";
import { PageHeader } from "@components/PageElements/Header";
import { UserProfileHeader } from "@components/UserManagement";
import { PerformanceTab, ContactTab } from "@components/UserDetail";

import { useGetVendor } from "../hooks";

interface VendorDetailPageProps {
  params: Promise<{
    cuid: string;
    uid: string;
  }>;
}

interface ServiceData {
  id: string;
  service: string;
  category: string;
  rate: string;
  availability: string;
  responseTime: string;
}

interface ProjectData {
  id: string;
  project: string;
  property: string;
  date: string;
  status: "completed" | "in-progress" | "available";
  amount: string;
}

interface DocumentData {
  id: string;
  title: string;
  type: string;
  subtitle: string;
  icon: string;
  status: "valid" | "expiring" | "expired";
  expiryDate?: string;
}

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const router = useRouter();
  const { cuid, uid } = React.use(params);
  const [activeTab, setActiveTab] = useState("services");
  const { vendor, isLoading, error } = useGetVendor(cuid, uid);

  const handleBack = () => {
    router.back();
  };

  const handleCreateWorkOrder = () => {
    console.log("Create work order for vendor");
  };

  const handleSendMessage = () => {
    console.log("Send message to vendor");
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Users", href: "#" },
    { title: "Vendors", href: `/users/${cuid}/vendors` },
    { title: vendor?.profile?.fullName || "Vendor Details" },
  ];

  if (isLoading) {
    return <Loading description="Loading vendor details..." size="regular" />;
  }

  if (!vendor) {
    const errorBreadcrumbItems = [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Users", href: "#" },
      { title: "Vendors", href: `/users/${cuid}/vendors` },
      { title: "Vendor Details" },
    ];

    return (
      <div className="page vendor-detail">
        <PageHeader
          title="Vendor Not Found"
          subtitle={error?.message || "Unable to load vendor details."}
          withBreadcrumb={true}
          breadcrumbItems={errorBreadcrumbItems}
          headerBtn={
            <Button
              className="btn btn-default"
              label="Back"
              icon={<i className="bx bx-arrow-back"></i>}
              onClick={handleBack}
            />
          }
        />
        <div className="employee-container">
          <Skeleton type="card" paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  // Helper functions for cleaner code
  const getVendorProperty = (path: string, fallback: any = "N/A"): any => {
    return (
      path.split(".").reduce((obj: any, key) => obj?.[key], vendor) || fallback
    );
  };

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

  // Prepare project data for the Table component
  const projectData: ProjectData[] =
    vendor.tasks && vendor.tasks.length > 0
      ? vendor.tasks.slice(0, 5).map((task: any, index: number) => ({
          id: `project-${index}`,
          project: task.title || `Project ${index + 1}`,
          property: task.property || "Various Properties",
          date: task.date || "Recent",
          status: task.status === "completed" ? "completed" : "in-progress",
          amount: task.amount || "Contact for Quote",
        }))
      : [
          {
            id: "project-default",
            project: "General Maintenance Projects",
            property: "Various Properties",
            date: "Ongoing",
            status: "available" as const,
            amount: "Contact for Quote",
          },
        ];

  // Prepare document data for the Table component
  const documentData: DocumentData[] = [
    {
      id: "doc-1",
      title: "Business License",
      type: "License",
      subtitle: "Valid until: December 31, 2025",
      icon: "bx-certification",
      status: "valid",
      expiryDate: "2025-12-31",
    },
    {
      id: "doc-2",
      title: "Insurance Certificate",
      type: "Insurance",
      subtitle: "Coverage: $2M • Expires: June 30, 2025",
      icon: "bx-shield",
      status: "valid",
      expiryDate: "2025-06-30",
    },
    {
      id: "doc-3",
      title: "Service Agreement Template",
      type: "Agreement",
      subtitle: "Updated: November 15, 2024",
      icon: "bx-file",
      status: "valid",
    },
    {
      id: "doc-4",
      title: "Safety Certification",
      type: "Certification",
      subtitle: "OSHA Compliant • Valid until: March 2025",
      icon: "bx-award",
      status: "expiring",
      expiryDate: "2025-03-31",
    },
    {
      id: "doc-5",
      title: "Tax ID Documentation",
      type: "Tax",
      subtitle: "EIN: 12-3456789 • Filed: 2024",
      icon: "bx-id-card",
      status: "valid",
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

  // Define table columns for projects
  const projectColumns: TableColumn<ProjectData>[] = [
    {
      title: "Project",
      dataIndex: "project",
      render: (project: string) => <strong>{project}</strong>,
    },
    {
      title: "Property",
      dataIndex: "property",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: ProjectData["status"]) => {
        const statusConfig = {
          completed: { className: "completed", label: "Completed" },
          "in-progress": { className: "in-progress", label: "In Progress" },
          available: { className: "completed", label: "Available" },
        };
        const config = statusConfig[status];
        return (
          <span className={`status-badge ${config.className}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount: string) => <span className="price">{amount}</span>,
    },
  ];

  // Define table columns for documents
  const documentColumns: TableColumn<DocumentData>[] = [
    {
      title: "Document",
      dataIndex: "title",
      render: (title: string, record: DocumentData) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "hsl(194, 66%, 24%)",
              color: "hsl(0, 0%, 100%)",
              borderRadius: "0.3rem",
            }}
          >
            <i className={`bx ${record.icon}`} style={{ fontSize: "1.2rem" }} />
          </div>
          <div>
            <strong>{title}</strong>
            <div style={{ fontSize: "0.9rem", color: "hsl(213, 14%, 56%)" }}>
              {record.subtitle}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: DocumentData["status"]) => {
        const statusConfig = {
          valid: { className: "completed", label: "Valid" },
          expiring: { className: "warning", label: "Expiring Soon" },
          expired: { className: "danger", label: "Expired" },
        };
        const config = statusConfig[status];
        return (
          <span className={`status-badge ${config.className}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "id",
      render: (id: string, record: DocumentData) => (
        <Button
          className="btn btn-sm btn-outline-primary"
          label="Download"
          icon={<i className="bx bx-download"></i>}
          onClick={() => console.log(`Download ${record.title}`)}
        />
      ),
    },
  ];

  const tabItems: TabItem[] = [
    {
      id: "services",
      label: "Services & Pricing",
      icon: <i className="bx bx-wrench"></i>,
      content: (
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
      ),
    },
    {
      id: "contact",
      label: "Contact",
      icon: <i className="bx bx-phone"></i>,
      content: (
        <ContactTab
          userType="vendor"
          contactInfo={{
            primary: {
              name: getVendorProperty("profile.fullName"),
              phone: getVendorProperty("profile.phoneNumber"),
              email: getVendorProperty("profile.email"),
            },
            office: {
              address: getVendorProperty("vendorInfo.businessAddress"),
              city: getVendorProperty("vendorInfo.serviceAreas.baseLocation"),
              hours: getVendorProperty("vendorInfo.businessHours"),
            },
            emergency: vendor.vendorInfo?.contactPerson
              ? {
                  name: getVendorProperty("vendorInfo.contactPerson.name"),
                  phone: getVendorProperty("vendorInfo.contactPerson.phone"),
                  relationship: getVendorProperty(
                    "vendorInfo.contactPerson.jobTitle"
                  ),
                }
              : undefined,
            manager: {
              name: "Property Management",
              title: "Service Coordinator",
              phone: "",
              email: "",
            },
          }}
        />
      ),
    },
    {
      id: "performance",
      label: "Performance",
      icon: <i className="bx bx-trending-up"></i>,
      content: (
        <PerformanceTab
          userType="vendor"
          metrics={{
            taskCompletionRate: getVendorProperty(
              "vendorInfo.stats.onTimeRate"
            ),
            satisfaction: getVendorProperty(
              "vendorInfo.rating",
              "N/A"
            ).toString(),
            responseTime: getVendorProperty("vendorInfo.stats.responseTime"),
            qualityRating: getVendorProperty(
              "vendorInfo.rating",
              "N/A"
            ).toString(),
          }}
          monthlyData={[]}
        />
      ),
    },
    {
      id: "projects",
      label: "Projects",
      icon: <i className="bx bx-briefcase"></i>,
      content: (
        <div className="projects-tab">
          <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
            Project History
          </h3>
          <Table
            columns={projectColumns}
            dataSource={projectData}
            rowKey="id"
            pagination={false}
            tableVariant="default"
          />
        </div>
      ),
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <i className="bx bx-star"></i>,
      content: (
        <div className="reviews-tab">
          <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
            Customer Reviews
          </h3>
          <ListItem
            icon="bx-user"
            title="Property Manager"
            subtitle="Recent Project"
            variant="review"
            rating={5}
            reviewText="Excellent work and professional service. The team was efficient and completed the project on time."
            onAction={() => console.log("View review details")}
            actionIcon="bx-chevron-right"
          />
          <ListItem
            icon="bx-building"
            title="Building Management"
            subtitle="Maintenance Service"
            variant="review"
            rating={4}
            reviewText="Quick response time and quality work. Very satisfied with the service provided."
            onAction={() => console.log("View review details")}
            actionIcon="bx-chevron-right"
          />
        </div>
      ),
    },
    {
      id: "documents",
      label: "Documents",
      icon: <i className="bx bx-file"></i>,
      content: (
        <div className="documents-tab">
          <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
            Documents & Certifications
          </h3>
          <Table
            columns={documentColumns}
            dataSource={documentData}
            rowKey="id"
            pagination={false}
            tableVariant="default"
          />
        </div>
      ),
    },
  ];

  const vendorTags = [
    ...vendor.user.roles.map((role: string) => ({
      type: "employment" as const,
      label: role.charAt(0).toUpperCase() + role.slice(1),
      icon: "bx bx-user-check",
    })),
    ...(vendor.vendorInfo?.tags || []).map((tag: string) => ({
      type: "achievement" as const,
      label: tag,
      icon: "bx bx-award",
    })),
  ];

  const statistics: Record<string, string | number> = vendor.vendorInfo
    ? {
        "Total Revenue": getVendorProperty("vendorInfo.totalRevenue", "$0"),
        "Total Projects": getVendorProperty("vendorInfo.totalProjects", "0"),
        "Active Projects": getVendorProperty("vendorInfo.activeProjects", "0"),
        "On Time Rate": getVendorProperty("vendorInfo.stats.onTimeRate"),
        "Response Time": getVendorProperty("vendorInfo.stats.responseTime"),
        "Repeat Rate": getVendorProperty("vendorInfo.stats.repeatRate"),
      }
    : {
        "Completed Jobs": "0",
        "Active Jobs": "0",
        "Response Time": "N/A",
        "On Time Rate": "N/A",
        Rating: "N/A",
        "Years in Business": "N/A",
      };

  return (
    <div className="page vendor-detail">
      <PageHeader
        title=""
        subtitle=""
        withBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
        headerBtn={
          <Button
            className="btn btn-default"
            label="Back"
            icon={<i className="bx bx-arrow-back"></i>}
            onClick={handleBack}
          />
        }
      />

      <div className="employee-container">
        <UserProfileHeader
          user={{
            personalInfo: {
              fullName: vendor.profile.fullName,
              initials: `${vendor.profile.firstName?.[0] || ""}${
                vendor.profile.lastName?.[0] || ""
              }`,
              avatar: vendor.profile.avatar?.url,
            },
            status: vendor.user.isActive ? "active" : "inactive",
            metaInfo: {
              primary: getVendorProperty(
                "vendorInfo.companyName",
                getVendorProperty("profile.fullName", "Vendor")
              ),
              secondary:
                getVendorProperty("vendorInfo.businessType", "service provider")
                  .charAt(0)
                  .toUpperCase() +
                getVendorProperty(
                  "vendorInfo.businessType",
                  "service provider"
                ).slice(1),
              tertiary: `Reg #: ${getVendorProperty(
                "vendorInfo.registrationNumber"
              )} • ${getVendorProperty(
                "vendorInfo.yearsInBusiness",
                "0"
              )} Years in Business`,
            },
            tags: vendorTags,
            statistics: statistics,
          }}
          primaryAction={{
            label: "Create Work Order",
            icon: <i className="bx bx-plus"></i>,
            onClick: handleCreateWorkOrder,
          }}
          secondaryAction={{
            label: "Send Message",
            icon: <i className="bx bx-message"></i>,
            onClick: handleSendMessage,
          }}
          showRating={{
            rating: parseFloat(
              getVendorProperty("vendorInfo.rating", "0").toString()
            ),
            reviewCount: getVendorProperty("vendorInfo.reviewCount", 0),
          }}
        />

        <div className="employee-tabs">
          <TabContainer
            variant="profile"
            tabItems={tabItems}
            defaultTab={activeTab}
            onChange={handleTabChange}
            scrollOnChange={false}
            ariaLabel="Vendor information tabs"
          />
        </div>
      </div>
    </div>
  );
}
