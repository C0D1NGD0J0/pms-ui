"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { Skeleton } from "@components/Skeleton";
import { Button } from "@components/FormElements";
import { TabItem } from "@components/Tab/interface";
import { TabContainer } from "@components/Tab/components";
import { PageHeader } from "@components/PageElements/Header";
import { UserProfileHeader } from "@components/UserManagement";
import { DocumentsTab, ContactTab } from "@components/UserDetail";

import { useGetTenant } from "../hooks";
import {
  PaymentHistoryTab,
  LeaseDetailsTab,
  MaintenanceTab,
} from "../components/tabs";

interface TenantDetailPageProps {
  params: Promise<{
    cuid: string;
    uid: string;
  }>;
}

export default function TenantDetailPage({ params }: TenantDetailPageProps) {
  const router = useRouter();
  const { cuid, uid } = React.use(params);
  const [activeTab, setActiveTab] = useState("lease");
  const { tenant, isLoading } = useGetTenant(cuid, uid);

  const handleBack = () => {
    router.back();
  };

  const handleSendMessage = () => {
    console.log("Send message to tenant");
    // TODO: Implement send message functionality
  };

  const handleViewPayments = () => {
    console.log("View tenant payments");
    // TODO: Implement view payments functionality
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Users", href: "#" },
    { title: "Tenants", href: `/users/${cuid}/tenants` },
    { title: tenant?.profile?.fullName || "Tenant Details" },
  ];

  if (isLoading) {
    return <Loading description="Loading tenant details..." size="regular" />;
  }

  if (!tenant) {
    const errorBreadcrumbItems = [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Users", href: "#" },
      { title: "Tenants", href: `/users/${cuid}/tenants` },
      { title: "Tenant Details" },
    ];

    return (
      <div className="page tenant-detail">
        <PageHeader
          title="Tenant Not Found"
          subtitle="Unable to load tenant details."
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
        <div className="tenant-container">
          <Skeleton type="card" paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString.toString();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // lease duration
  const leaseStartDate = new Date(tenant.leaseInfo.startDate);
  const leaseEndDate = tenant.leaseInfo.endDate
    ? new Date(tenant.leaseInfo.endDate)
    : null;
  const leaseDurationMonths = leaseEndDate
    ? Math.round(
        (leaseEndDate.getTime() - leaseStartDate.getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      )
    : 0;

  const tabItems: TabItem[] = [
    {
      id: "lease",
      label: "Lease Details",
      icon: <i className="bx bx-file-blank"></i>,
      content: <LeaseDetailsTab tenant={tenant} />,
    },
    {
      id: "payments",
      label: "Payment History",
      icon: <i className="bx bx-dollar"></i>,
      content: <PaymentHistoryTab tenant={tenant} />,
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: <i className="bx bx-wrench"></i>,
      content: <MaintenanceTab tenant={tenant} />,
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
              name: tenant.profile.fullName,
              phone: tenant.profile.phoneNumber,
              email: tenant.profile.email,
            },
            office: {
              address: tenant.unit.address,
              city: tenant.unit.propertyName,
              hours: "N/A",
            },
            manager: {
              name: "Property Management",
              phone: "",
              email: "",
              title: "Property Manager",
            },
          }}
        />
      ),
    },
    {
      id: "documents",
      label: "Documents",
      icon: <i className="bx bx-file"></i>,
      content: (
        <DocumentsTab
          userType="vendor"
          documents={
            tenant.documents
              ? tenant.documents.map((doc: any) => ({
                  id: doc.id,
                  title: doc.name,
                  type: doc.type,
                  subtitle: doc.size,
                  icon: "bx-file",
                  status: "valid" as const,
                }))
              : []
          }
        />
      ),
    },
  ];

  const tenantTags = [
    ...tenant.profile.roles.map((role: string) => ({
      type: "employment" as const,
      label: role.charAt(0).toUpperCase() + role.slice(1),
      icon: "bx bx-user-check",
    })),
    {
      type: "achievement" as const,
      label:
        tenant.leaseInfo.status.charAt(0).toUpperCase() +
        tenant.leaseInfo.status.slice(1),
      icon: "bx bx-check-circle",
    },
  ];

  const statistics = {
    "Monthly Rent": formatCurrency(tenant.leaseInfo.monthlyRent),
    "Lease Duration": `${leaseDurationMonths} months`,
    "Rent Status":
      tenant.rentStatus.charAt(0).toUpperCase() + tenant.rentStatus.slice(1),
    "Lease Start": formatDate(tenant.leaseInfo.startDate),
    "Lease End": tenant.leaseInfo.endDate
      ? formatDate(tenant.leaseInfo.endDate)
      : "N/A",
    "Maintenance Requests": tenant.maintenanceRequests?.length || 0,
  };

  return (
    <div className="page tenant-detail">
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

      <div className="tenant-container">
        <UserProfileHeader
          user={{
            personalInfo: {
              fullName: tenant.profile.fullName,
              initials: `${tenant.profile.firstName?.[0] || ""}${
                tenant.profile.lastName?.[0] || ""
              }`,
              avatar: tenant.profile.avatar?.url,
            },
            status: tenant.profile.isActive ? "active" : "inactive",
            metaInfo: {
              primary: tenant.unit.propertyName,
              secondary: `Unit ${tenant.unit.unitNumber}`,
              tertiary: `Tenant since ${formatDate(
                tenant.leaseInfo.startDate
              )}`,
            },
            tags: tenantTags,
            statistics: statistics,
          }}
          primaryAction={{
            label: "Send Message",
            icon: <i className="bx bx-message"></i>,
            onClick: handleSendMessage,
          }}
          secondaryAction={{
            label: "View Payments",
            icon: <i className="bx bx-dollar"></i>,
            onClick: handleViewPayments,
          }}
        />

        <div className="tenant-tabs">
          <TabContainer
            variant="profile"
            tabItems={tabItems}
            defaultTab={activeTab}
            onChange={handleTabChange}
            scrollOnChange={false}
            ariaLabel="Tenant information tabs"
          />
        </div>
      </div>
    </div>
  );
}
