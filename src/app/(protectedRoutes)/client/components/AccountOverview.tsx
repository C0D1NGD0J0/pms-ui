"use client";

import React from "react";
import { MetricCard } from "@components/Cards";
import { IAccountMetric } from "@interfaces/client.interface";

// Mock data - replace with real data later
const accountMetrics: IAccountMetric[] = [
  {
    label: "Account Status",
    value: "Verified",
    description: "Enterprise Account",
    variant: "icon",
    icon: <i className="bx bx-user-circle"></i>,
  },
  {
    label: "Client ID",
    value: "CLI-12345",
    description: "Unique Identifier",
    variant: "icon",
    icon: <i className="bx bx-id-card"></i>,
  },
  {
    label: "Subscription",
    value: "Premium",
    description: "Active Plan",
    variant: "icon",
    icon: <i className="bx bx-calendar-check"></i>,
  },
  {
    label: "Verification",
    value: "Complete",
    description: "ID Verified",
    variant: "icon",
    icon: <i className="bx bx-shield-check"></i>,
  },
];

export const AccountOverview: React.FC = () => {
  return (
    <div className="insights">
      {accountMetrics.map((metric, index) => (
        <MetricCard
          key={index}
          label={metric.label}
          value={metric.value}
          variant={metric.variant}
          icon={metric.icon}
          description={metric.description}
          className="metric-card__account-overview"
        />
      ))}
    </div>
  );
};
