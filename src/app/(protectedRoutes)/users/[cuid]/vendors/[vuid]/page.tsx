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
import { PerformanceTab, ContactTab } from "@components/UserDetail";

import { useGetVendor } from "../hooks";
import {
  VendorDocumentsTab,
  VendorProjectsTab,
  VendorServicesTab,
  VendorReviewsTab,
  VendorUsersTab,
} from "../components/tabs";

interface VendorDetailPageProps {
  params: Promise<{
    cuid: string;
    vuid: string;
  }>;
}

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const router = useRouter();
  const { cuid, vuid } = React.use(params);
  const [activeTab, setActiveTab] = useState("services");
  const { vendor, isLoading, error } = useGetVendor(cuid, vuid);

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

  const tabItems: TabItem[] = [
    {
      id: "services",
      label: "Services & Pricing",
      icon: <i className="bx bx-wrench"></i>,
      content: <VendorServicesTab vendor={vendor} />,
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
      id: "users",
      label: "Team Members",
      icon: <i className="bx bx-users"></i>,
      content: <VendorUsersTab />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <i className="bx bx-briefcase"></i>,
      content: <VendorProjectsTab vendor={vendor} />,
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <i className="bx bx-star"></i>,
      content: <VendorReviewsTab />,
    },
    {
      id: "documents",
      label: "Documents",
      icon: <i className="bx bx-file"></i>,
      content: <VendorDocumentsTab />,
    },
  ];

  const vendorTags = [
    ...vendor.profile?.roles.map((role: string) => ({
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
            status: vendor.profile.isActive ? "active" : "inactive",
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
