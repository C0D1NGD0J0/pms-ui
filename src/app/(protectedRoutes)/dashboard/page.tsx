"use client";
import React from "react";
import Link from "next/link";
import { Table } from "@components/Table";
import { InsightCard } from "@components/Cards";
import { PageHeader } from "@components/PageElements";

import { InsightCardData } from "./interfaces";

interface ServiceRequest {
  id: string;
  type: string;
  property: string;
  priority: string;
  status: string;
}
interface Payment {
  id: string;
  property: string;
  tenant: string;
  dueDate: string;
  amount: number;
}
interface LeaseStatus {
  id: string;
  property: string;
  tenant: string;
  endDate: string;
  daysRemaining: number;
  status: string;
}

const statusFilterOptions = [
  { label: "All", value: "all" },
  { label: "Vacant", value: "vacant" },
  { label: "Rented", value: "rented" },
];

const insightCardsData: InsightCardData[] = [
  {
    id: "properties",
    title: "Properties",
    value: 12,
    icon: <i className="bx bx-building-house"></i>,
    trend: {
      value: "8%",
      direction: "up",
      period: "vs last month",
    },
  },
  {
    id: "tenants",
    title: "Tenants",
    value: 32,
    icon: <i className="bx bx-building-house"></i>,
    trend: {
      value: "12%",
      direction: "up",
      period: "vs last month",
    },
  },
  {
    id: "service-requests",
    title: "Service Requests",
    value: 12,
    icon: <i className="bx bx-help-circle"></i>,
    description: (
      <>
        <i className="bx bx-time"></i> 2 mins ago
      </>
    ),
  },
  {
    id: "recent-payment",
    title: "Recent Payment",
    value: "$2,800.00",
    icon: <i className="bx bx-money"></i>,
    description: (
      <>
        <i className="bx bx-time"></i> 45mins ago
      </>
    ),
  },
];

const serviceRequestColumns = [
  { title: "Service Type", dataIndex: "type" },
  { title: "Property", dataIndex: "property" },
  { title: "Priority", dataIndex: "priority", isStatus: true },
  { title: "Status", dataIndex: "status", isStatus: true },
  {
    title: "Action",
    dataIndex: "id",
    render: (id: string) => (
      <div className="status primary">
        <i className="bx bx-glasses"></i>
      </div>
    ),
  },
];
const paymentColumns = [
  { title: "Property", dataIndex: "property" },
  { title: "Tenant", dataIndex: "tenant" },
  { title: "Due Date", dataIndex: "dueDate" },
  {
    title: "Amount Due",
    dataIndex: "amount",
    render: (amount: number) => `${amount.toFixed(2)}`,
  },
  {
    title: "Action",
    dataIndex: "id",
    render: (id: string) => (
      <div className="status primary">
        <i className="bx bx-glasses"></i>
      </div>
    ),
  },
];
const leaseStatusColumns = [
  { title: "Property", dataIndex: "property" },
  { title: "Tenant", dataIndex: "tenant" },
  { title: "Lease End Date", dataIndex: "endDate" },
  { title: "Days Remaining", dataIndex: "daysRemaining" },
  { title: "Renewal Status", dataIndex: "status", isStatus: true },
  {
    title: "Action",
    dataIndex: "id",
    render: (id: string) => (
      <div className="status primary">
        <i className="bx bx-glasses"></i>
        <i className="bx bx-envelope"></i>
      </div>
    ),
  },
];

const serviceRequests: ServiceRequest[] = [
  {
    id: "1",
    type: "Plumbing",
    property: "26 Wellington Ave, New York.",
    priority: "low",
    status: "closed",
  },
  {
    id: "2",
    type: "Plumbing",
    property: "26 Wellington Ave, New York.",
    priority: "urgent",
    status: "closed",
  },
  {
    id: "3",
    type: "Plumbing",
    property: "26 Wellington Ave, New York.",
    priority: "low",
    status: "resolved",
  },
  {
    id: "4",
    type: "Plumbing",
    property: "26 Wellington Ave, New York.",
    priority: "urgent",
    status: "open",
  },
];
const payments: Payment[] = [
  {
    id: "1",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    dueDate: "12/09/2023",
    amount: 1900.0,
  },
  {
    id: "2",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    dueDate: "12/09/2023",
    amount: 1900.0,
  },
  {
    id: "3",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    dueDate: "12/09/2023",
    amount: 1900.0,
  },
  {
    id: "4",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    dueDate: "12/09/2023",
    amount: 1900.0,
  },
];
const leaseStatuses: LeaseStatus[] = [
  {
    id: "1",
    property: "26 Wellington Ave, New York.",
    tenant: "Tom Jones",
    endDate: "12/09/2023",
    daysRemaining: 14,
    status: "Pending",
  },
  {
    id: "2",
    property: "45 Central Park, New York.",
    tenant: "Sarah Williams",
    endDate: "15/09/2023",
    daysRemaining: 17,
    status: "Confirmed",
  },
  {
    id: "3",
    property: "112 Broadway St, New York.",
    tenant: "Michael Chen",
    endDate: "30/09/2023",
    daysRemaining: 32,
    status: "Not Renewing",
  },
  {
    id: "4",
    property: "8 Madison Ave, New York.",
    tenant: "Emily Johnson",
    endDate: "05/10/2023",
    daysRemaining: 37,
    status: "Not Started",
  },
];

export default function Dashboard() {
  return (
    <div className="page admin-dashboard">
      <PageHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString()}
        headerBtn={
          <Link className="btn btn-success" href={"/properties/new"}>
            <i className="bx bx-plus-circle"></i>
            Add new property
          </Link>
        }
      />

      <div className="insights">
        {insightCardsData.map((card) => (
          <InsightCard
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            description={card.description}
          />
        ))}
      </div>

      <div className="flex-row">
        <div className="panels">
          <Table
            title="Service Requests"
            columns={serviceRequestColumns}
            dataSource={serviceRequests}
            searchOpts={{
              value: "",
              onChange: (value: string) => {
                console.log("Search value:", value);
              },
            }}
            filterOpts={{
              value: "all",
              options: statusFilterOptions,
              onFilterChange: (value: string) => {
                console.log("Filter value:", value);
              },
            }}
            pagination={{ pageSize: 4 }}
            rowKey="id"
          />

          <Table
            title="Upcoming Payments"
            columns={paymentColumns}
            dataSource={payments}
            searchOpts={{
              value: "",
              onChange: (value: string) => {
                console.log("Search value:", value);
              },
            }}
            filterOpts={{
              value: "all",
              options: statusFilterOptions,
              onFilterChange: (value: string) => {
                console.log("Filter value:", value);
              },
            }}
            pagination={{ pageSize: 4 }}
            rowKey="id"
          />
        </div>
      </div>

      <div className="flex-row">
        <div className="panels">
          <Table
            title="Lease Status"
            columns={leaseStatusColumns}
            dataSource={leaseStatuses}
            searchOpts={{
              value: "",
              onChange: (value: string) => {
                console.log("Search value:", value);
              },
            }}
            filterOpts={{
              value: "all",
              options: statusFilterOptions,
              onFilterChange: (value: string) => {
                console.log("Filter value:", value);
              },
            }}
            pagination={{ pageSize: 4 }}
            rowKey="id"
          />
        </div>
      </div>
    </div>
  );
}
