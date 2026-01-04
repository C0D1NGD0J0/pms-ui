import React from "react";
import { TimelineItem, Timeline } from "@components/Timeline";
import { LeaseTimeline } from "@src/interfaces/lease.interface";

interface LeaseSidebarProps {
  timeline: LeaseTimeline;
  renewalNoticeDays?: number;
}

export const LeaseSidebar: React.FC<LeaseSidebarProps> = ({
  timeline,
  renewalNoticeDays = 60
}) => {
  // Calculate renewal notice date
  const endDate = new Date(timeline.endDate);
  const renewalNoticeDate = new Date(endDate);
  renewalNoticeDate.setDate(endDate.getDate() - renewalNoticeDays);

  const today = new Date();
  const startDate = new Date(timeline.startDate);
  const moveInDate = new Date(timeline.moveInDate);

  // Determine completion status based on isActive flag and dates
  const leaseHasStarted = timeline.isActive && today >= startDate;
  const tenantHasMovedIn = timeline.isActive && today >= moveInDate;

  const timelineItems: TimelineItem[] = [
    {
      date: endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      title: timeline.isExpiringSoon ? "Lease Ending Soon" : "Lease End Date",
      desc: timeline.isActive
        ? `${timeline.daysRemaining} days remaining`
        : "End of lease term",
      completed: timeline.isActive && today >= endDate,
    },
    {
      date: renewalNoticeDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      title: "Renewal Decision",
      desc: timeline.isActive
        ? `Notice required by (${renewalNoticeDays} days)`
        : "Pending lease activation",
      completed: timeline.isActive && today >= renewalNoticeDate,
    },
    {
      date: moveInDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      title: "Move-in Date",
      desc: tenantHasMovedIn
        ? "Tenant moved in"
        : timeline.isActive
          ? "Scheduled move-in"
          : "Awaiting lease activation",
      completed: tenantHasMovedIn,
    },
    {
      date: startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      title: "Lease Start Date",
      desc: timeline.isActive
        ? "Lease is active"
        : today >= startDate
          ? "Awaiting activation"
          : "Scheduled start date",
      completed: leaseHasStarted,
    },
    {
      date: new Date(timeline.created).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      title: "Lease Created",
      desc: "Agreement drafted",
      completed: true,
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
