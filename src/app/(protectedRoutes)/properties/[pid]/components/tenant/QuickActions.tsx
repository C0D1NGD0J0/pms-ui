import React from "react";

export interface QuickAction {
  icon: string;
  label: string;
  onClick?: () => void;
}

export interface QuickActionsProps {
  actions: QuickAction[];
  columns?: 1 | 2 | 3 | 4;
}

export function QuickActions({ actions, columns = 2 }: QuickActionsProps) {
  const gridCols = {
    1: "repeat(1, 1fr)",
    2: "repeat(2, 1fr)",
    3: "repeat(3, 1fr)",
    4: "repeat(4, 1fr)",
  };

  return (
    <div
      className="quick-actions"
      style={{ gridTemplateColumns: gridCols[columns] }}
    >
      {actions.map((action, index) => (
        <div key={index} className="action-button" onClick={action.onClick}>
          <i className={`bx ${action.icon}`}></i>
          <span>{action.label}</span>
        </div>
      ))}
    </div>
  );
}
