import React from "react";

export interface LeaseData {
  tenant: {
    name: string;
    avatar: string;
  };
  period: string;
  unit: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
}

export interface LeaseInfoProps {
  lease: LeaseData;
}

export function LeaseInfo({ lease }: LeaseInfoProps) {
  return (
    <div className="lease-info">
      <div className="lease-header">
        <div className="tenant-avatar">{lease.tenant.avatar}</div>
        <div className="lease-details">
          <h3>{lease.tenant.name}</h3>
          <p>Lease Period: {lease.period}</p>
          <p>{lease.unit}</p>
        </div>
      </div>
      <div className="lease-stats">
        {lease.stats.map((stat, index) => (
          <div key={index} className="lease-stat">
            <span className="stat-value">{stat.value}</span>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
