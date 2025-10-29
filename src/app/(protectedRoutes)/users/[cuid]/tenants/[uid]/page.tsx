"use client";

import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { Skeleton } from "@components/Skeleton";
import React, { useState, useMemo } from "react";
import { Button } from "@components/FormElements";
import { TabItem } from "@components/Tab/interface";
import { TabContainer } from "@components/Tab/components";
import { PageHeader } from "@components/PageElements/Header";
import { UserProfileHeader } from "@components/UserManagement";
import { withPageAccess } from "@src/components/PageAccessHOC";
import { DocumentsTab, ContactTab } from "@components/UserDetail";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { withClientAccess } from "@hooks/permissionHOCs";
import { useDeactivateTenant, useGetClientTenant } from "@users/tenants/hooks";
import { DeactivateTenantModal } from "@users/tenants/components/DeactivateTenantModal";

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

const getIncludeParamsForTab = (tabId: string): string[] => {
  switch (tabId) {
    case "lease":
      return ["lease"];
    case "payments":
      return ["payments"];
    case "maintenance":
      return ["maintenance"];
    case "documents":
      return ["lease"];
    case "contact":
      return [];
    default:
      return ["all"];
  }
};

const TenantDetailPage = ({ params }: TenantDetailPageProps) => {
  const router = useRouter();
  const { cuid, uid } = React.use(params);
  const [activeTab, setActiveTab] = useState("lease");
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const { isAdmin } = useUnifiedPermissions();

  const includeParams = getIncludeParamsForTab(activeTab);
  const { tenant, isLoading } = useGetClientTenant(cuid, uid, includeParams);
  const deactivateTenantMutation = useDeactivateTenant(cuid, uid);

  const handleBack = () => {
    router.back();
  };

  const handleSendMessage = () => {
    console.log("Send message to tenant");
  };

  const handleViewPayments = () => {
    console.log("View tenant payments");
  };

  const handleDeactivateClick = () => {
    setShowDeactivateModal(true);
  };

  const handleConfirmDeactivate = async () => {
    try {
      await deactivateTenantMutation.mutateAsync();
      setShowDeactivateModal(false);
      router.push(`/users/${cuid}/tenants`);
    } catch (error) {
      console.error("Failed to deactivate tenant:", error);
      setShowDeactivateModal(false);
    }
  };

  const handleCancelDeactivate = () => {
    setShowDeactivateModal(false);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

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

  const activeLeases = tenant?.tenantInfo?.activeLeases || [];
  const hasActiveLease = activeLeases.length > 0;
  const activeLease = activeLeases[0];

  const tabItems: TabItem[] = useMemo(
    () =>
      tenant
        ? [
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
                          relationship:
                            tenant.tenantInfo.emergencyContact.relationship,
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
                    tenant.tenantInfo?.leaseHistory &&
                    tenant.tenantInfo.leaseHistory.length > 0
                      ? tenant.tenantInfo.leaseHistory.map(
                          (lease: any, index: number) => ({
                            id: `lease-${index}`,
                            title: `Lease Agreement - ${lease.propertyName}`,
                            type: "lease",
                            subtitle: `Unit ${lease.unitNumber} • ${
                              lease.status.charAt(0).toUpperCase() +
                              lease.status.slice(1)
                            } • ${new Date(
                              lease.leaseStart
                            ).toLocaleDateString()} - ${new Date(
                              lease.leaseEnd
                            ).toLocaleDateString()}`,
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
          ]
        : [],
    [tenant]
  );

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
          <div className="flex-row" style={{ gap: "0.5rem" }}>
            {isAdmin && (
              <Button
                className="btn btn-danger"
                label="Deactivate"
                icon={<i className="bx bx-user-x"></i>}
                onClick={handleDeactivateClick}
                disabled={deactivateTenantMutation.isPending}
              />
            )}
            <Button
              className="btn btn-default"
              label="Back"
              icon={<i className="bx bx-arrow-back"></i>}
              onClick={handleBack}
            />
          </div>
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

      <DeactivateTenantModal
        isOpen={showDeactivateModal}
        tenantName={tenant?.profile?.fullName || ""}
        onClose={handleCancelDeactivate}
        onConfirm={handleConfirmDeactivate}
        isSubmitting={deactivateTenantMutation.isPending}
      />
    </div>
  );
};

export default withClientAccess(
  withPageAccess(TenantDetailPage, {
    requiredPermission: (p) => p.isStaffOrAbove,
  })
);
