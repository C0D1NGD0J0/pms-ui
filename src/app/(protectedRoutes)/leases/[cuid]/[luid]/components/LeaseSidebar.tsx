import React from "react";
import { Timeline, TimelineItem } from "@components/Timeline";

export const LeaseSidebar: React.FC = () => {
  const timelineItems: TimelineItem[] = [
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
  ];

  const quickActions = [
    { icon: "bx-message", label: "Send Message to Tenant" },
    { icon: "bx-file-blank", label: "Generate Invoice" },
    { icon: "bx-wrench", label: "Create Maintenance Request" },
    { icon: "bx-calendar", label: "Schedule Inspection" },
    { icon: "bx-edit", label: "Renew/Terminate Lease" },
  ];

  return (
    <div className="lease-sidebar">
      {/* Timeline */}
      <div className="sidebar-panel">
        <h4 className="sidebar-panel__header">
          <i className="bx bx-time-five"></i> Lease Timeline
        </h4>
        <Timeline items={timelineItems} ariaLabel="Lease timeline" />
      </div>

      {/* Quick Actions */}
      <div className="sidebar-panel">
        <h4 className="sidebar-panel__header">
          <i className="bx bx-rocket"></i> Quick Actions
        </h4>
        <div className="quick-actions">
          {quickActions.map((action, idx) => (
            <button key={idx} className="quick-action-btn">
              <span>
                <i className={`bx ${action.icon}`}></i> {action.label}
              </span>
              <i className="bx bx-chevron-right"></i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
