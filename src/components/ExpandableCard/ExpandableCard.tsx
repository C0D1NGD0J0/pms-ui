"use client";

import { Icon } from "@components/Icon";
import React, { useEffect, useState, useRef } from "react";

interface ExpandableCardProps {
  children: React.ReactNode;
  collapsedHeight?: number;
  className?: string;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  children,
  collapsedHeight = 150,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number>(collapsedHeight);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        setMaxHeight(contentRef.current.scrollHeight);
      } else {
        setMaxHeight(collapsedHeight);
      }
    }
  }, [isExpanded, collapsedHeight]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`expandable-card ${isExpanded ? "expandable-card--expanded" : ""} ${className}`}
      style={
        {
          "--expandable-card-max-height": `${maxHeight}px`,
        } as React.CSSProperties
      }
    >
      <div ref={contentRef} className="expandable-card__content">
        {children}
      </div>

      {!isExpanded && <div className="expandable-card__fade" />}

      <button
        type="button"
        className="expandable-card__toggle"
        onClick={handleToggle}
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        <Icon name={isExpanded ? "bx-hide" : "bx-show"} />
      </button>
    </div>
  );
};
