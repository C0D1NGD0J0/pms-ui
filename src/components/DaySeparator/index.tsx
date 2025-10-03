"use client";
import React, { useMemo } from "react";
import { isYesterday, isThisWeek, isToday, format } from "date-fns";

interface DaySeparatorProps {
  date: Date | string;
}

const DaySeparator = ({ date }: DaySeparatorProps) => {
  const displayText = useMemo(() => {
    const targetDate = new Date(date);

    if (isToday(targetDate)) return "Today";
    if (isYesterday(targetDate)) return "Yesterday";
    if (isThisWeek(targetDate)) return "This Week";

    // For older dates, show the formatted date
    return format(targetDate, "MMMM dd, yyyy");
  }, [date]);

  return (
    <div className="day-separator">
      <div className="day-separator-text">{displayText}</div>
      <div className="day-separator-line"></div>
    </div>
  );
};

export default DaySeparator;
