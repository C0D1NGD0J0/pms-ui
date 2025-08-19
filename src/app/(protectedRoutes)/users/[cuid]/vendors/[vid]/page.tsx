"use client";

import React, { useState } from "react";
import { UserProfileHeader, UserAction } from "@components/UserManagement";
import { TabPanelContent } from "@components/Tab/components/TabPanelContent";
import { TabContainer, TabListItem, TabList } from "@components/Tab/components";

import { useGetVendor } from "../hooks";
import {
  VendorPerformanceTab,
  VendorServicesTab,
  VendorProjectsTab,
  VendorReviewsTab,
  VendorContactTab,
} from "../components/tabs";

interface VendorDetailPageProps {
  params: Promise<{
    cuid: string;
    vid: string;
  }>;
}

export default function VendorDetailPage({
  params,
}: VendorDetailPageProps) {
  const { cuid, vid } = React.use(params);
  const [activeTab, setActiveTab] = useState("services");

  const { vendor, isLoading, error } = useGetVendor(cuid, vid);

  const handleSendMessage = () => {
    console.log("Send message to vendor");
    // TODO: Implement send message functionality
  };

  const handleViewContract = () => {
    console.log("View vendor contract");
    // TODO: Implement view contract functionality
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner">Loading vendor details...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !vendor) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Vendor Not Found</h2>
          <p>{error || "Unable to load vendor details."}</p>
        </div>
      </div>
    );
  }

  // Transform vendor data for UserProfileHeader
  const headerUser = {
    personalInfo: {
      fullName: vendor.vendorInfo.companyName,
      initials: vendor.personalInfo.initials,
    },
    status: vendor.vendorInfo.status,
    metaInfo: {
      primary: vendor.vendorInfo.businessType,
      secondary: undefined, // No department for vendors
      tertiary: undefined, // No tenure for vendors
    },
    tags: vendor.tags.map((tag: any) => ({
      type: tag.type as 'employment' | 'achievement' | 'permission',
      label: tag.label,
      icon: tag.icon,
    })),
    statistics: vendor.statistics,
  };

  const primaryAction: UserAction = {
    label: "Send Message",
    icon: <i className="bx bx-message-dots"></i>,
    onClick: handleSendMessage,
  };

  const secondaryAction: UserAction = {
    label: "View Contract",
    icon: <i className="bx bx-file-doc"></i>,
    onClick: handleViewContract,
  };

  const vendorRating = {
    rating: vendor.vendorInfo.rating,
    reviewCount: vendor.vendorInfo.reviewCount,
  };

  const tabItems = [
    {
      id: "services",
      label: "Services",
      icon: <i className="bx bx-cog"></i>,
      content: <VendorServicesTab vendor={vendor} />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <i className="bx bx-task"></i>,
      content: <VendorProjectsTab vendor={vendor} />,
    },
    {
      id: "performance",
      label: "Performance",
      icon: <i className="bx bx-trending-up"></i>,
      content: <VendorPerformanceTab vendor={vendor} />,
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <i className="bx bx-star"></i>,
      content: <VendorReviewsTab vendor={vendor} />,
    },
    {
      id: "contact",
      label: "Contact",
      icon: <i className="bx bx-phone"></i>,
      content: <VendorContactTab vendor={vendor} />,
    },
  ];

  return (
    <div className="page-container">
      <div className="employee-container">
        {/* Vendor Profile Header */}
        <UserProfileHeader
          user={headerUser}
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          showRating={vendorRating}
        />

        {/* Vendor Tabs */}
        <div className="employee-tabs">
          <TabContainer
            variant="profile"
            defaultTab={activeTab}
            onChange={handleTabChange}
            scrollOnChange={false}
            ariaLabel="Vendor information tabs"
          >
            <TabList variant="profile">
              {tabItems.map((tab) => (
                <TabListItem
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  icon={tab.icon}
                />
              ))}
            </TabList>

            {tabItems.map((tab) => (
              <TabPanelContent key={tab.id} id={tab.id}>
                {tab.content}
              </TabPanelContent>
            ))}
          </TabContainer>
        </div>
      </div>
    </div>
  );
}