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

import { useGetClientTenant } from "../hooks";
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
  const { tenant, isLoading } = useGetClientTenant(cuid, uid);

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
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Extract active lease info (if available)
  const activeLeases = tenant.tenantInfo?.activeLeases || [];
  const hasActiveLease = activeLeases.length > 0;

  // Get first active lease data (will be from Lease entity when implemented)
  // For now, this will be empty arrays as lease data comes from separate service
  const activeLease = activeLeases[0];

  console.log("Tenant data:", tenant);

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
          userType="tenant"
          contactInfo={{
            primary: {
              name: tenant.profile?.fullName,
              phone: tenant.profile?.phoneNumber,
              email: tenant.profile?.email,
            },
            emergency: tenant.tenantInfo?.emergencyContact
              ? {
                  name: tenant.tenantInfo.emergencyContact.name,
                  phone: tenant.tenantInfo.emergencyContact.phone,
                  relationship: tenant.tenantInfo.emergencyContact.relationship,
                }
              : undefined,
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
          userType="tenant"
          documents={
            tenant.tenantInfo?.leaseHistory && tenant.tenantInfo.leaseHistory.length > 0
              ? tenant.tenantInfo.leaseHistory.map(
                  (lease: any, index: number) => ({
                    id: `lease-${index}`,
                    title: `Lease Agreement - ${lease.propertyName}`,
                    type: "lease",
                    subtitle: `Unit ${lease.unitNumber} • ${lease.status.charAt(0).toUpperCase() + lease.status.slice(1)} • ${new Date(lease.leaseStart).toLocaleDateString()} - ${new Date(lease.leaseEnd).toLocaleDateString()}`,
                    icon: "lease", // Will be mapped to bx-home
                    status:
                      lease.status === "active"
                        ? ("valid" as const)
                        : lease.status === "completed"
                        ? ("expired" as const)
                        : ("expired" as const),
                    expiryDate: lease.leaseEnd,
                  })
                )
              : undefined
          }
        />
      ),
    },
  ];

  // Build tenant tags based on real data
  const tenantTags = [
    {
      type: "employment" as const,
      label: "Tenant",
      icon: "bx bx-user-check",
    },
    ...(tenant.tenantMetrics?.currentRentStatus &&
    tenant.tenantMetrics.currentRentStatus !== "no_lease"
      ? [
          {
            type: "achievement" as const,
            label:
              tenant.tenantMetrics.currentRentStatus.charAt(0).toUpperCase() +
              tenant.tenantMetrics.currentRentStatus.slice(1).replace("_", " "),
            icon:
              tenant.tenantMetrics.currentRentStatus === "current"
                ? "bx bx-check-circle"
                : "bx bx-error-circle",
          },
        ]
      : []),
    ...(tenant.tenantInfo?.backgroundChecks &&
    tenant.tenantInfo.backgroundChecks.length > 0
      ? [
          {
            type: "achievement" as const,
            label:
              "Background Check: " +
              tenant.tenantInfo.backgroundChecks[0].status
                .charAt(0)
                .toUpperCase() +
              tenant.tenantInfo.backgroundChecks[0].status.slice(1),
            icon: "bx bx-shield-check",
          },
        ]
      : []),
  ];

  // Build statistics based on real API data
  const statistics = {
    "Tenant Since": formatDate(tenant.joinedDate),
    "Total Rent Paid": formatCurrency(tenant.tenantMetrics?.totalRentPaid || 0),
    "On-Time Rate": `${tenant.tenantMetrics?.onTimePaymentRate || 0}%`,
    "Avg Payment Delay": `${
      tenant.tenantMetrics?.averagePaymentDelay || 0
    } days`,
    "Maintenance Requests": tenant.tenantMetrics?.totalMaintenanceRequests || 0,
    "Active Leases": activeLeases.length,
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
              avatar: tenant.profile.avatar,
            },
            status: tenant.status?.toLowerCase() || "inactive",
            metaInfo: {
              primary: hasActiveLease ? "Active Lease" : "No Active Lease",
              secondary:
                hasActiveLease && activeLease?.leaseId
                  ? `Lease ID: ${activeLease.leaseId}`
                  : "Lease details available when lease system is implemented",
              tertiary: `Tenant since ${formatDate(tenant.joinedDate)}`,
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
