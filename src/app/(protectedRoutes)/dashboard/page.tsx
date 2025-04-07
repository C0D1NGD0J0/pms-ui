"use client";
import React from "react";
import Link from "next/link";
import { InsightCard } from "@components/Cards";
import { PageHeader } from "@components/PageElements";

import { InsightCardData } from "./interfaces";

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
    </div>
  );
}
