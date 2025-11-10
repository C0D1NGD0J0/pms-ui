"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Table } from "@components/Table";
import { useParams } from "next/navigation";
import { TabContainer } from "@components/Tab";
import { StatusBadge } from "@components/Badge";
import { TabItem } from "@components/Tab/interface";
import { PageHeader } from "@components/PageElements";
import { PanelsWrapper, PanelContent, Panel } from "@components/Panel";

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
    name: "Signed Lease Agreement",
    type: "PDF",
    size: "2.4 MB",
    date: "Dec 15, 2023",
  },
  {
    name: "Move-in Checklist",
    type: "PDF",
    size: "856 KB",
    date: "Jan 1, 2024",
  },
  {
    name: "Property Inspection Report",
    type: "PDF",
    size: "3.2 MB",
    date: "Jan 1, 2024",
  },
  {
    name: "Tenant Insurance Certificate",
    type: "PDF",
    size: "654 KB",
    date: "Jan 5, 2024",
  },
  { name: "Pet Agreement", type: "PDF", size: "428 KB", date: "Dec 15, 2023" },
  {
    name: "Parking Agreement",
    type: "PDF",
    size: "312 KB",
    date: "Dec 15, 2023",
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
  const params = useParams();
  const cuid = params?.cuid as string;
  const lid = params?.lid as string;

  const breadcrumbItems = [
    { title: "Dashboard", href: `/dashboard/${cuid}` },
    { title: "Leases", href: `/leases/${cuid}` },
    { title: `Lease #${dummyLeaseData.luid}` },
  ];

  // Tab content components (inline)
  const LeaseDetailsTab = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "2.4rem",
      }}
    >
      {[
        { label: "Lease Number", value: dummyLeaseData.luid },
        { label: "Lease Type", value: dummyLeaseData.leaseType },
        { label: "Start Date", value: dummyLeaseData.startDate },
        { label: "End Date", value: dummyLeaseData.endDate },
        { label: "Duration", value: dummyLeaseData.duration },
        { label: "Notice Period", value: dummyLeaseData.noticePeriod },
        { label: "Renewal Option", value: dummyLeaseData.renewalOption },
        { label: "Signed Date", value: dummyLeaseData.signedDate },
        { label: "Move-in Date", value: dummyLeaseData.moveInDate },
        { label: "Occupancy Limit", value: dummyLeaseData.occupancyLimit },
        { label: "Pets Allowed", value: dummyLeaseData.petsAllowed },
        { label: "Parking Spaces", value: dummyLeaseData.parkingSpaces },
      ].map((item, idx) => (
        <div
          key={idx}
          style={{ paddingBottom: "1.6rem", borderBottom: "1px solid #f0f8ff" }}
        >
          <div
            style={{
              fontSize: "1.1rem",
              color: "#7d8da1",
              fontWeight: 500,
              marginBottom: "0.6rem",
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </div>
          <div
            style={{ fontSize: "1.3rem", color: "#124e66", fontWeight: 600 }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );

  const PropertyTenantTab = () => (
    <div>
      <h3
        style={{ fontSize: "1.8rem", color: "#124e66", marginBottom: "2rem" }}
      >
        Property Information
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "2.4rem",
          marginBottom: "3rem",
        }}
      >
        {[
          { label: "Property Name", value: "Sunset Apartments" },
          { label: "Unit Number", value: "304" },
          { label: "Property Type", value: "Apartment" },
          { label: "Bedrooms / Bathrooms", value: "2 Bed / 2 Bath" },
          { label: "Square Footage", value: "1,150 sq ft" },
          { label: "Furnished", value: "Unfurnished" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              paddingBottom: "1.6rem",
              borderBottom: "1px solid #f0f8ff",
            }}
          >
            <div
              style={{
                fontSize: "1.1rem",
                color: "#7d8da1",
                fontWeight: 500,
                marginBottom: "0.6rem",
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </div>
            <div
              style={{ fontSize: "1.3rem", color: "#124e66", fontWeight: 600 }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <h3
        style={{ fontSize: "1.8rem", color: "#124e66", margin: "3rem 0 2rem" }}
      >
        Primary Tenant
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.6rem",
          padding: "2rem",
          background: "#f9fafb",
          borderRadius: "1.2rem",
          border: "1px solid #f0f8ff",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            width: "6rem",
            height: "6rem",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #124e66 0%, #0d3a4d 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.4rem",
            fontWeight: 700,
          }}
        >
          {dummyLeaseData.tenant.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#124e66",
              marginBottom: "0.4rem",
            }}
          >
            {dummyLeaseData.tenant.name}
          </div>
          <div
            style={{
              fontSize: "1.3rem",
              color: "#7d8da1",
              marginBottom: "0.2rem",
            }}
          >
            <i className="bx bx-envelope"></i> {dummyLeaseData.tenant.email}
          </div>
          <div style={{ fontSize: "1.3rem", color: "#7d8da1" }}>
            <i className="bx bx-phone"></i> {dummyLeaseData.tenant.phone}
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button
            style={{
              padding: "0.8rem 1.2rem",
              borderRadius: "0.6rem",
              border: "1px solid #f0f8ff",
              background: "white",
              cursor: "pointer",
            }}
          >
            <i className="bx bx-message"></i>
          </button>
          <button
            style={{
              padding: "0.8rem 1.2rem",
              borderRadius: "0.6rem",
              border: "1px solid #f0f8ff",
              background: "white",
              cursor: "pointer",
            }}
          >
            <i className="bx bx-phone"></i>
          </button>
        </div>
      </div>

      <h3
        style={{ fontSize: "1.8rem", color: "#124e66", margin: "3rem 0 2rem" }}
      >
        Additional Occupants
      </h3>
      <Table
        dataSource={dummyAdditionalOccupants}
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
          },
          { title: "Contact", dataIndex: "contact", key: "contact" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
              <StatusBadge
                status={status === "approved" ? "active" : "pending"}
              >
                {status}
              </StatusBadge>
            ),
          },
        ]}
        pagination={false}
      />
    </div>
  );

  const FinancialTab = () => (
    <div>
      <h3
        style={{ fontSize: "1.8rem", color: "#124e66", marginBottom: "2rem" }}
      >
        Rent Details
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "2.4rem",
          marginBottom: "3rem",
        }}
      >
        {[
          { label: "Base Rent", value: "$2,200" },
          { label: "Pet Fee", value: "$50/month" },
          { label: "Parking Fee", value: "$100/month (2 spaces)" },
          { label: "Storage Unit", value: "$100/month" },
          { label: "Total Monthly Rent", value: "$2,450", highlight: true },
          { label: "Rent Due Date", value: "1st of each month" },
          { label: "Grace Period", value: "5 Days" },
          { label: "Late Fee", value: "$75 after grace period" },
          { label: "Security Deposit", value: "$3,675" },
          { label: "Payment Method", value: "ACH Auto-pay" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              paddingBottom: "1.6rem",
              borderBottom: "1px solid #f0f8ff",
            }}
          >
            <div
              style={{
                fontSize: "1.1rem",
                color: "#7d8da1",
                fontWeight: 500,
                marginBottom: "0.6rem",
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: item.highlight ? "2rem" : "1.3rem",
                color: item.highlight ? "#00be1c" : "#124e66",
                fontWeight: 600,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <h3
        style={{ fontSize: "1.8rem", color: "#124e66", margin: "3rem 0 2rem" }}
      >
        Payment History (Last 6 Months)
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {dummyPaymentHistory.map((payment, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1.4rem",
              borderRadius: "1rem",
              background: "#f9fafb",
              border: "1px solid #f0f8ff",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}
            >
              <div
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "0.8rem",
                  background:
                    "linear-gradient(135deg, #e6ffe9 0%, #d1ffd6 100%)",
                  color: "#00be1c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                }}
              >
                <i className="bx bx-check"></i>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: "#124e66",
                  }}
                >
                  {payment.date}
                </div>
                <div style={{ fontSize: "1.2rem", color: "#7d8da1" }}>
                  {payment.method}
                </div>
              </div>
            </div>
            <div
              style={{ fontSize: "1.6rem", fontWeight: 700, color: "#00be1c" }}
            >
              {payment.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      {dummyDocuments.map((doc, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.4rem",
            padding: "1.4rem",
            borderRadius: "1rem",
            background: "#f9fafb",
            border: "1px solid #f0f8ff",
          }}
        >
          <div
            style={{
              width: "4.2rem",
              height: "4.2rem",
              borderRadius: "0.8rem",
              background: "linear-gradient(135deg, #124e66 0%, #0d3a4d 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            <i className="bx bx-file-blank"></i>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "#124e66",
                marginBottom: "0.2rem",
              }}
            >
              {doc.name}
            </div>
            <div style={{ fontSize: "1.2rem", color: "#7d8da1" }}>
              {doc.type} • {doc.size} • Uploaded {doc.date}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <button
              style={{
                width: "3.2rem",
                height: "3.2rem",
                borderRadius: "0.6rem",
                border: "none",
                background: "white",
                color: "#124e66",
                cursor: "pointer",
                fontSize: "1.6rem",
              }}
            >
              <i className="bx bx-show"></i>
            </button>
            <button
              style={{
                width: "3.2rem",
                height: "3.2rem",
                borderRadius: "0.6rem",
                border: "none",
                background: "white",
                color: "#124e66",
                cursor: "pointer",
                fontSize: "1.6rem",
              }}
            >
              <i className="bx bx-download"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const ActivityTab = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
      {dummyActivity.map((activity, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            gap: "1.4rem",
            paddingBottom: "1.6rem",
            borderBottom:
              idx < dummyActivity.length - 1 ? "1px solid #f0f8ff" : "none",
          }}
        >
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              background: "#f0f8ff",
              color: "#124e66",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              flexShrink: 0,
            }}
          >
            <i className={`bx ${activity.icon}`}></i>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "1.4rem",
                color: "#124e66",
                marginBottom: "0.4rem",
              }}
            >
              {activity.text}
            </div>
            <div style={{ fontSize: "1.2rem", color: "#7d8da1" }}>
              {activity.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const tabItems: TabItem[] = [
    {
      id: "details",
      label: "Lease Details",
      icon: <i className="bx bx-info-circle"></i>,
      content: <LeaseDetailsTab />,
    },
    {
      id: "property",
      label: "Property & Tenant",
      icon: <i className="bx bx-building"></i>,
      content: <PropertyTenantTab />,
    },
    {
      id: "financial",
      label: "Financial",
      icon: <i className="bx bx-dollar"></i>,
      content: <FinancialTab />,
    },
    {
      id: "documents",
      label: "Documents",
      icon: <i className="bx bx-file"></i>,
      content: <DocumentsTab />,
    },
    {
      id: "activity",
      label: "Activity",
      icon: <i className="bx bx-time"></i>,
      content: <ActivityTab />,
    },
  ];

  return (
    <div className="page lease-show">
      <PageHeader
        title={`Lease #${dummyLeaseData.luid}`}
        subtitle={`${dummyLeaseData.propertyName} | ${dummyLeaseData.propertyAddress}`}
        withBreadcrumb={true}
        breadcrumbItems={breadcrumbItems}
        headerBtn={
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href={`/leases/${cuid}`}>
              <button className="btn btn-outline">
                <i className="bx bx-arrow-back"></i> Back
              </button>
            </Link>
            <button className="btn btn-primary">
              <i className="bx bx-edit"></i> Edit Lease
            </button>
            <button className="btn btn-outline">
              <i className="bx bx-download"></i> Download
            </button>
            <button className="btn btn-outline">
              <i className="bx bx-printer"></i> Print
            </button>
          </div>
        }
      />

      {/* Header with status badge */}
      <div
        style={{
          background: "linear-gradient(135deg, #124e66 0%, #0d3a4d 100%)",
          color: "white",
          padding: "3rem",
          borderRadius: "1.6rem",
          marginBottom: "2.4rem",
          boxShadow: "0 8px 24px rgba(18, 78, 102, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.8rem",
                fontWeight: 700,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
              }}
            >
              Lease #{dummyLeaseData.luid}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.8rem 1.6rem",
                  borderRadius: "5rem",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #00be1c 0%, #00a018 100%)",
                }}
              >
                <i className="bx bx-check-circle"></i>
                Active
              </span>
            </h1>
            <p
              style={{
                fontSize: "1.5rem",
                opacity: 0.9,
                marginBottom: "0.5rem",
              }}
            >
              <i className="bx bx-building-house"></i>{" "}
              {dummyLeaseData.propertyName}
            </p>
            <p style={{ fontSize: "1.5rem", opacity: 0.9 }}>
              <i className="bx bx-map"></i> {dummyLeaseData.propertyAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(22rem, 1fr))",
          gap: "2rem",
          marginBottom: "3rem",
        }}
      >
        {[
          {
            icon: "bx-calendar-check",
            iconBg: "linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%)",
            iconColor: "#124e66",
            label: "Lease Start",
            value: dummyLeaseData.startDate,
            meta: "6 months ago",
          },
          {
            icon: "bx-calendar-x",
            iconBg: "linear-gradient(135deg, #fff8e6 0%, #ffedd1 100%)",
            iconColor: "#ff9900",
            label: "Lease End",
            value: dummyLeaseData.endDate,
            meta: "6 months remaining",
          },
          {
            icon: "bx-dollar-circle",
            iconBg: "linear-gradient(135deg, #e6ffe9 0%, #d1ffd6 100%)",
            iconColor: "#00be1c",
            label: "Monthly Rent",
            value: `$${dummyLeaseData.monthlyRent.toLocaleString()}`,
            meta: "Due on 1st of month",
          },
          {
            icon: "bx-shield",
            iconBg: "linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%)",
            iconColor: "#124e66",
            label: "Security Deposit",
            value: `$${dummyLeaseData.securityDeposit.toLocaleString()}`,
            meta: "1.5x monthly rent",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              background: "white",
              padding: "2.4rem",
              borderRadius: "1.6rem",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
              border: "1px solid rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                width: "5.6rem",
                height: "5.6rem",
                borderRadius: "1.4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.4rem",
                marginBottom: "1.6rem",
                background: card.iconBg,
                color: card.iconColor,
              }}
            >
              <i className={`bx ${card.icon}`}></i>
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                color: "#7d8da1",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.1rem",
                marginBottom: "0.8rem",
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: "2.6rem",
                fontWeight: 700,
                color: "#124e66",
                marginBottom: "0.4rem",
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: "1.3rem", color: "#7d8da1" }}>
              {card.meta}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content with Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 35rem",
          gap: "2.4rem",
        }}
      >
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

        {/* Sidebar */}
        <div>
          {/* Timeline */}
          <div
            style={{
              background: "white",
              borderRadius: "1.6rem",
              padding: "2.4rem",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
              marginBottom: "2rem",
            }}
          >
            <h4
              style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "#124e66",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <i className="bx bx-time-five"></i> Lease Timeline
            </h4>
            <div style={{ position: "relative", paddingLeft: "3rem" }}>
              <div
                style={{
                  position: "absolute",
                  left: "0.8rem",
                  top: 0,
                  bottom: 0,
                  width: "2px",
                  background:
                    "linear-gradient(180deg, #124e66 0%, #e9ecef 100%)",
                }}
              ></div>
              {[
                {
                  date: "Jan 1, 2024",
                  title: "Lease Started",
                  desc: "Move-in completed",
                  completed: true,
                },
                {
                  date: "Oct 1, 2024",
                  title: "Renewal Decision",
                  desc: "Notice required by",
                  completed: false,
                },
                {
                  date: "Dec 31, 2024",
                  title: "Lease Ends",
                  desc: "End of term",
                  completed: false,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{ position: "relative", marginBottom: "2.4rem" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-2.4rem",
                      top: "0.4rem",
                      width: "1.6rem",
                      height: "1.6rem",
                      borderRadius: "50%",
                      background: item.completed ? "#00be1c" : "white",
                      border: `3px solid ${
                        item.completed ? "#00be1c" : "#e9ecef"
                      }`,
                      zIndex: 1,
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: "1.2rem",
                      color: "#7d8da1",
                      fontWeight: 600,
                      marginBottom: "0.4rem",
                    }}
                  >
                    {item.date}
                  </div>
                  <div
                    style={{
                      fontSize: "1.4rem",
                      color: "#124e66",
                      fontWeight: 600,
                      marginBottom: "0.2rem",
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: "1.3rem", color: "#7d8da1" }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              background: "white",
              borderRadius: "1.6rem",
              padding: "2.4rem",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h4
              style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "#124e66",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <i className="bx bx-rocket"></i> Quick Actions
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {[
                { icon: "bx-message", label: "Send Message to Tenant" },
                { icon: "bx-file-blank", label: "Generate Invoice" },
                { icon: "bx-wrench", label: "Create Maintenance Request" },
                { icon: "bx-calendar", label: "Schedule Inspection" },
                { icon: "bx-edit", label: "Renew/Terminate Lease" },
              ].map((action, idx) => (
                <button
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.4rem 1.6rem",
                    borderRadius: "1rem",
                    fontSize: "1.4rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    border: "2px solid #f0f8ff",
                    background: "white",
                    color: "#124e66",
                  }}
                >
                  <span>
                    <i
                      className={`bx ${action.icon}`}
                      style={{ marginRight: "1rem", fontSize: "1.8rem" }}
                    ></i>
                    {action.label}
                  </span>
                  <i className="bx bx-chevron-right"></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
