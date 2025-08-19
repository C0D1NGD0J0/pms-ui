import React from 'react';

export interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
  size?: 'small' | 'default' | 'large';
  className?: string;
  children?: React.ReactNode;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'default',
  className = '',
  children,
}) => {
  const getColoClass = () => {
    return `priority-badge priority-badge-${priority} priority-badge-${size}`;
  };

  const combinedClassName = `${getColoClass()} ${className}`.trim();

  return (
    <span 
      className={combinedClassName}
      role="status"
      aria-label={`Priority: ${priority}`}
    >
      {children || priority}
    </span>
  );
};

// Predefined priority badges
export const HighPriorityBadge: React.FC<Omit<PriorityBadgeProps, 'priority'>> = (props) => (
  <PriorityBadge {...props} priority="high" />
);

export const MediumPriorityBadge: React.FC<Omit<PriorityBadgeProps, 'priority'>> = (props) => (
  <PriorityBadge {...props} priority="medium" />
);

export const LowPriorityBadge: React.FC<Omit<PriorityBadgeProps, 'priority'>> = (props) => (
  <PriorityBadge {...props} priority="low" />
);

PriorityBadge.displayName = 'PriorityBadge';