import React from "react";
import { formatDistanceToNow } from "date-fns";
import { LeaseActivityEvent } from "@src/interfaces/lease.interface";

interface ActivityTabProps {
  activities: LeaseActivityEvent[];
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ activities }) => {
  const getActivityIcon = (type?: string): string => {
    switch (type) {
      case "created":
        return "bx-file-blank";
      case "updated":
        return "bx-edit";
      case "signed":
        return "bx-check-circle";
      case "payment":
        return "bx-dollar-circle";
      case "maintenance":
        return "bx-wrench";
      case "message":
        return "bx-message";
      case "document":
        return "bx-file";
      default:
        return "bx-info-circle";
    }
  };

  return (
    <div className="activity-feed">
      {activities.length === 0 ? (
        <div className="empty-state">
          <p>No activity recorded yet.</p>
        </div>
      ) : (
        activities.map((activity, idx) => (
          <div key={idx} className="activity-item">
            <div className="activity-item__icon">
              <i className={`bx ${getActivityIcon(activity.type)}`}></i>
            </div>
            <div className="activity-item__content">
              <div className="activity-item__text">{activity.description}</div>
              <div className="activity-item__time">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </div>
              {activity.notes && (
                <div className="activity-item__notes">{activity.notes}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
