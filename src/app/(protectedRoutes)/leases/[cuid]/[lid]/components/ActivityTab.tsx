import React from "react";

interface Activity {
  icon: string;
  text: string;
  time: string;
}

interface ActivityTabProps {
  activities: Activity[];
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ activities }) => {
  return (
    <div className="activity-feed">
      {activities.map((activity, idx) => (
        <div key={idx} className="activity-item">
          <div className="activity-item__icon">
            <i className={`bx ${activity.icon}`}></i>
          </div>
          <div className="activity-item__content">
            <div className="activity-item__text">{activity.text}</div>
            <div className="activity-item__time">{activity.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
