import React from "react";

export interface TimelineItem {
  date: string;
  title: string;
  desc?: string;
  completed?: boolean;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  ariaLabel?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  className = "",
  ariaLabel = "Timeline",
}) => {
  return (
    <ol className={`timeline ${className}`} aria-label={ariaLabel}>
      {items.map((item, idx) => (
        <li
          key={idx}
          className={`timeline-item ${item.completed ? "completed" : "upcoming"}`}
          aria-label={`${item.title} on ${item.date}, ${item.completed ? "completed" : "upcoming"}`}
        >
          <div className="timeline-item__date">{item.date}</div>
          <div className="timeline-item__title">{item.title}</div>
          {item.desc && <div className="timeline-item__desc">{item.desc}</div>}
        </li>
      ))}
    </ol>
  );
};

Timeline.displayName = "Timeline";
