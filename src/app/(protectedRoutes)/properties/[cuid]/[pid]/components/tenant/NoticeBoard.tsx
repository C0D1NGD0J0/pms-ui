import React from "react";

export interface NoticeBoardProps {
  title: string;
  notices: string[];
  variant?: "info" | "warning" | "success";
}

export function NoticeBoard({
  title,
  notices,
  variant = "warning",
}: NoticeBoardProps) {
  return (
    <div className={`notice-board ${variant}`}>
      <h5>
        <i className="bx bx-info-circle"></i>
        {title}
      </h5>
      <ul>
        {notices.map((notice, index) => (
          <li key={index}>{notice}</li>
        ))}
      </ul>
    </div>
  );
}
