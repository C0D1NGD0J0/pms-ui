import React from 'react';
import { Badge } from 'antd';
import { BadgeProps } from 'antd/lib/badge';

export interface StatusBadgeProps extends Omit<BadgeProps, 'status' | 'size'> {
  status?: 'active' | 'pending' | 'completed' | 'in-progress' | 'error' | 'warning' | 'success' | 'inactive';
  variant?: 'dot' | 'count' | 'text';
  size?: 'small' | 'default' | 'large';
  children?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'pending',
  variant = 'text',
  size = 'default',
  className = '',
  children,
  ...props
}) => {
  // Map our status to Ant Design status
  const getAntStatus = (status: string): BadgeProps['status'] => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'success':
        return 'success';
      case 'pending':
      case 'in-progress':
      case 'warning':
        return 'processing';
      case 'error':
        return 'error';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  // Get custom class names for styling
  const getStatusClass = () => {
    return `status-badge status-badge-${status} status-badge-${variant} status-badge-${size}`;
  };

  const combinedClassName = `${getStatusClass()} ${className}`.trim();

  if (variant === 'dot') {
    return (
      <Badge
        {...props}
        status={getAntStatus(status)}
        className={combinedClassName}
        size={size === 'small' ? 'small' : 'default'}
      >
        {children}
      </Badge>
    );
  }

  if (variant === 'count' && typeof children === 'number') {
    return (
      <Badge
        {...props}
        count={children}
        className={combinedClassName}
        size={size === 'small' ? 'small' : 'default'}
      />
    );
  }

  // Default to text variant - render as a styled span
  return (
    <span className={combinedClassName} role="status" aria-label={`Status: ${status}`}>
      {children || status}
    </span>
  );
};

StatusBadge.displayName = 'StatusBadge';