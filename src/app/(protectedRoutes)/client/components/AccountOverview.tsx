"use client";

import React from "react";
import { MetricCard } from "@components/Cards";
import { IAccountMetric } from "@interfaces/client.interface";

interface ComponentProps {
  accountStats: {
    totalUsers: number;
    planName?: string;
    planId?: string;
    isVerified: boolean;
    totalProperties: number;
  };
}

export function AccountOverview(props: ComponentProps) {
  const { accountStats } = props;

  const accountMetrics: IAccountMetric[] = [
    {
      label: "Account Status",
      value: accountStats.isVerified ? "Verified" : "Unverified",
      description: "Account verification status",
      variant: "icon",
      icon: <i className="bx bx-user-circle"></i>,
    },
    {
      label: "Users",
      value: `${accountStats.totalUsers} User${
        accountStats.totalUsers !== 1 ? "s" : ""
      }`,
      description: "Total number of users",
      variant: "icon",
      icon: <i className="bx bx-group"></i>,
    },
    {
      label: "Subscription",
      value: `${
        accountStats.planName === "personal" ? "Basic" : accountStats.planName
      } Plan`,
      description: "Subscription type",
      variant: "icon",
      icon: <i className="bx bx-calendar-check"></i>,
    },
    {
      label: "Properties",
      value: `${accountStats.totalProperties} Propert${
        accountStats.totalProperties !== 1 ? "ies" : "y"
      }`,
      description: "Total number of properties",
      variant: "icon",
      icon: <i className="bx bx-home"></i>,
    },
  ];
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
}
