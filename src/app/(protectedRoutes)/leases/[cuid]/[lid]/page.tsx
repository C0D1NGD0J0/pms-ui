"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { TabContainer } from "@components/Tab";
import { TabItem } from "@components/Tab/interface";
import { PageHeader } from "@components/PageElements";
import { Button } from "@components/FormElements";
import { DocumentsTab } from "@components/UserDetail";
import { PanelsWrapper, PanelContent, Panel } from "@components/Panel";

import { LeaseHeader } from "./components/LeaseHeader";
import { ActivityTab } from "./components/ActivityTab";
import { FinancialTab } from "./components/FinancialTab";
import { LeaseSidebar } from "./components/LeaseSidebar";
import { LeaseDetailsTab } from "./components/LeaseDetailsTab";
import { PropertyTenantTab } from "./components/PropertyTenantTab";
import { LeaseOverviewCards } from "./components/LeaseOverviewCards";

// Dummy data
const dummyLeaseData = {
  luid: "LS-2024-0145",
  status: "active",
  propertyName: "Sunset Apartments - Unit 304",
  propertyAddress: "123 Main Street, Los Angeles, CA 90001",
  startDate: "Jan 1, 2024",
  endDate: "Dec 31, 2024",
  monthlyRent: 2450,
  securityDeposit: 3675,
  currency: "USD",
  leaseType: "Fixed-Term Residential",
  duration: "12 Months",
  noticePeriod: "60 Days",
  renewalOption: "Auto-renewal with 90-day notice",
  signedDate: "December 15, 2023",
  moveInDate: "January 1, 2024",
  occupancyLimit: "3 Persons",
  petsAllowed: "Yes - 1 Dog (under 30 lbs)",
  parkingSpaces: "2 - Spaces #45, #46",
  tenant: {
    name: "Sarah Johnson",
    initials: "SJ",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
  },
};

const dummyPaymentHistory = [
  {
    date: "June 1, 2024",
    method: "ACH - Auto-pay",
    amount: "$2,450.00",
    status: "paid",
  },
  {
    date: "May 1, 2024",
    method: "ACH - Auto-pay",
    amount: "$2,450.00",
    status: "paid",
  },
  {
    date: "April 1, 2024",
    method: "ACH - Auto-pay",
    amount: "$2,450.00",
    status: "paid",
  },
  {
    date: "March 1, 2024",
    method: "ACH - Auto-pay",
    amount: "$2,450.00",
    status: "paid",
  },
  {
    date: "February 1, 2024",
    method: "ACH - Auto-pay",
    amount: "$2,450.00",
    status: "paid",
  },
  {
    date: "January 1, 2024",
    method: "ACH - Auto-pay",
    amount: "$2,450.00",
    status: "paid",
  },
];

const dummyDocuments = [
  {
    id: "doc-1",
    title: "Signed Lease Agreement",
    type: "lease",
    subtitle: "Original lease document • PDF • 2.4 MB • Uploaded Dec 15, 2023",
    icon: "lease",
    status: "valid" as const,
  },
  {
    id: "doc-2",
    title: "Move-in Checklist",
    type: "document",
    subtitle: "Property condition report • PDF • 856 KB • Uploaded Jan 1, 2024",
    icon: "document",
    status: "valid" as const,
  },
  {
    id: "doc-3",
    title: "Property Inspection Report",
    type: "report",
    subtitle: "Annual inspection • PDF • 3.2 MB • Uploaded Jan 1, 2024",
    icon: "report",
    status: "valid" as const,
  },
  {
    id: "doc-4",
    title: "Tenant Insurance Certificate",
    type: "insurance",
    subtitle: "Current policy • PDF • 654 KB • Uploaded Jan 5, 2024",
    icon: "insurance",
    status: "valid" as const,
  },
  {
    id: "doc-5",
    title: "Pet Agreement",
    type: "pet",
    subtitle: "Pet addendum • PDF • 428 KB • Uploaded Dec 15, 2023",
    icon: "pet",
    status: "valid" as const,
  },
  {
    id: "doc-6",
    title: "Parking Agreement",
    type: "document",
    subtitle: "Parking spaces #45, #46 • PDF • 312 KB • Uploaded Dec 15, 2023",
    icon: "document",
    status: "valid" as const,
  },
];

const dummyActivity = [
  {
    icon: "bx-dollar-circle",
    text: "Payment received - Monthly rent of $2,450.00 received",
    time: "June 1, 2024 at 9:30 AM",
  },
  {
    icon: "bx-wrench",
    text: "Maintenance request completed - Fixed leaking faucet in bathroom",
    time: "May 28, 2024 at 2:15 PM",
  },
  {
    icon: "bx-message",
    text: "Message sent - Reminder about upcoming property inspection",
    time: "May 25, 2024 at 10:00 AM",
  },
  {
    icon: "bx-dollar-circle",
    text: "Payment received - Monthly rent of $2,450.00 received",
    time: "May 1, 2024 at 9:30 AM",
  },
];

const dummyAdditionalOccupants = [
  {
    name: "Michael Johnson",
    relationship: "Spouse",
    contact: "michael.j@email.com",
    status: "approved",
  },
  {
    name: "Emma Johnson",
    relationship: "Dependent",
    contact: "Minor",
    status: "approved",
  },
];

export default function LeaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cuid = params?.cuid as string;

  const handleBack = () => {
    router.back();
  };

  const breadcrumbItems = [
    { title: "Dashboard", href: `/dashboard/${cuid}` },
    { title: "Leases", href: `/leases/${cuid}` },
    { title: `Lease #${dummyLeaseData.luid}` },
  ];

  const tabItems: TabItem[] = [
    {
      id: "details",
      label: "Lease Details",
      icon: <i className="bx bx-info-circle"></i>,
      content: <LeaseDetailsTab leaseData={dummyLeaseData} />,
    },
    {
      id: "property",
      label: "Property & Tenant",
      icon: <i className="bx bx-building"></i>,
      content: (
        <PropertyTenantTab
          tenant={dummyLeaseData.tenant}
          additionalOccupants={dummyAdditionalOccupants}
        />
      ),
    },
    {
      id: "financial",
      label: "Financial",
      icon: <i className="bx bx-dollar"></i>,
      content: <FinancialTab paymentHistory={dummyPaymentHistory} />,
    },
    {
      id: "documents",
      label: "Documents",
      icon: <i className="bx bx-file"></i>,
      content: <DocumentsTab userType="tenant" documents={dummyDocuments} />,
    },
    {
      id: "activity",
      label: "Activity",
      icon: <i className="bx bx-time"></i>,
      content: <ActivityTab activities={dummyActivity} />,
    },
  ];

  return (
    <div className="page lease-show">
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

      <LeaseHeader
        luid={dummyLeaseData.luid}
        status={dummyLeaseData.status}
        propertyName={dummyLeaseData.propertyName}
        propertyAddress={dummyLeaseData.propertyAddress}
      />

      <LeaseOverviewCards
        startDate={dummyLeaseData.startDate}
        endDate={dummyLeaseData.endDate}
        monthlyRent={dummyLeaseData.monthlyRent}
        securityDeposit={dummyLeaseData.securityDeposit}
      />

      <div className="lease-content-grid">
        <div>
          <PanelsWrapper>
            <Panel>
              <PanelContent>
                <TabContainer
                  variant="profile"
                  tabItems={tabItems}
                  defaultTab="details"
                  scrollOnChange={false}
                />
              </PanelContent>
            </Panel>
          </PanelsWrapper>
        </div>

        <LeaseSidebar />
      </div>
    </div>
  );
}
