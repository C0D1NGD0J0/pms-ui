import React from "react";
import { Button } from "@components/FormElements";
import { DepartmentTag, EmployeeTag, StatusBadge } from "@components/Badge";

export interface UserMetaInfo {
  primary: string; // Job title OR Business type
  secondary?: string; // Department OR Rating display
  tertiary?: string; // Tenure OR additional info
}

export interface UserTag {
  type: 'employment' | 'achievement' | 'permission';
  label: string;
  icon?: string;
}

export interface UserAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface UserRating {
  rating: number;
  reviewCount: number;
}

export interface UserProfileHeaderProps {
  user: {
    personalInfo: {
      fullName: string;
      initials: string;
      avatar?: string;
    };
    status: 'active' | 'inactive';
    metaInfo: UserMetaInfo;
    tags: UserTag[];
    statistics: Record<string, string | number>;
  };
  primaryAction: UserAction;
  secondaryAction: UserAction;
  showRating?: UserRating;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  primaryAction,
  secondaryAction,
  showRating,
}) => {
  const { personalInfo, status, metaInfo, tags, statistics } = user;

  const renderRating = () => {
    if (!showRating) return null;

    const { rating, reviewCount } = showRating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="vendor-rating">
        <div className="stars">
          {Array.from({ length: fullStars }, (_, i) => (
            <i key={i} className="bx bxs-star"></i>
          ))}
          {hasHalfStar && <i className="bx bxs-star-half"></i>}
        </div>
        <span className="rating-text">
          {rating} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
        </span>
      </div>
    );
  };

  const renderMetaInfo = () => (
    <div className="employee-meta">
      <span className="employee-role">{metaInfo.primary}</span>
      
      {metaInfo.secondary && !showRating && (
        <div className="employee-department">
          <DepartmentTag
            icon={<i className="bx bx-buildings"></i>}
            size="default"
          >
            {metaInfo.secondary}
          </DepartmentTag>
        </div>
      )}
      
      {showRating && renderRating()}
      
      {metaInfo.tertiary && (
        <span className="employee-tenure">{metaInfo.tertiary}</span>
      )}
    </div>
  );

  // Convert statistics object to array for rendering
  const statisticsArray = Object.entries(statistics).map(([key, value]) => ({
    key,
    value,
    label: key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/([a-z])([A-Z])/g, '$1 $2')
  }));

  return (
    <div className="employee-header">
      <div className="employee-header-top">
        <div className="employee-profile">
          <div className="employee-avatar">
            {personalInfo.initials}
            <StatusBadge
              status={status}
              variant="text"
              className="employee-status"
            >
              {status === 'active' ? 'Active' : 'Inactive'}
            </StatusBadge>
          </div>

          <div className="employee-info">
            <h1>{personalInfo.fullName}</h1>
            {renderMetaInfo()}

            <div className="employee-tags">
              {tags.map((tag, index) => (
                <EmployeeTag
                  key={index}
                  variant={tag.type}
                  icon={tag.icon ? <i className={tag.icon}></i> : undefined}
                >
                  {tag.label}
                </EmployeeTag>
              ))}
            </div>
          </div>

          <div className="employee-actions">
            <Button
              className="btn-primary"
              onClick={primaryAction.onClick}
              icon={primaryAction.icon}
              label={primaryAction.label}
            />
            <Button
              className="btn-outline"
              onClick={secondaryAction.onClick}
              icon={secondaryAction.icon}
              label={secondaryAction.label}
            />
          </div>
        </div>
      </div>

      <div className="employee-stats">
        {statisticsArray.map((stat) => (
          <div key={stat.key} className="stat-item">
            <span className="stat-number">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

UserProfileHeader.displayName = 'UserProfileHeader';