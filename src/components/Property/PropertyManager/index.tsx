import React from "react";
import { Button } from "@components/FormElements";

export interface Manager {
  name: string;
  title: string;
  avatar: string;
  contact: {
    phone: string;
    email: string;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export interface PropertyManagerProps {
  manager: Manager;
  onMessage?: () => void;
  onCall?: () => void;
}

export function PropertyManager({
  manager,
  onMessage,
  onCall,
}: PropertyManagerProps) {
  return (
    <div className="sidebar-section">
      <h4>Property Manager</h4>
      <div className="manager-card">
        <div className="manager-info">
          <div className="manager-avatar">{manager.avatar}</div>
          <div className="manager-details">
            <h5>{manager.name}</h5>
            <p>{manager.title}</p>
            <p className="manager-contact">
              <i className="bx bx-phone"></i> {manager.contact.phone}
            </p>
            <p className="manager-contact">
              <i className="bx bx-envelope"></i> {manager.contact.email}
            </p>
          </div>
        </div>
        <div className="manager-stats">
          {manager.stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="manager-actions">
          <Button
            className="btn btn-sm btn-outline"
            label="Message"
            icon={<i className="bx bx-message"></i>}
            onClick={onMessage}
          />
          <Button
            className="btn btn-sm btn-outline"
            label="Call"
            icon={<i className="bx bx-phone"></i>}
            onClick={onCall}
          />
        </div>
      </div>
    </div>
  );
}
