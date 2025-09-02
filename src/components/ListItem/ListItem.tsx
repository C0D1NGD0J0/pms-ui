import React from "react";

export interface ListItemProps {
  icon: string;
  title: string;
  subtitle: string;
  variant?: "document" | "review" | "generic" | "info";
  actionIcon?: string;
  onAction?: () => void;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  rating?: number;
  reviewText?: string;
  reviewAuthor?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  icon,
  title,
  subtitle,
  variant = "generic",
  actionIcon = "bx-download",
  onAction,
  onClick,
  className = "",
  disabled = false,
  children,
  rating,
  reviewText,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onAction) {
      onAction();
    }
  };

  // Render stars for review variant when rating is provided
  const renderStars = (rating: number) => {
    return (
      <div className="list-item__stars">
        {Array.from({ length: 5 }, (_, i) => (
          <i
            key={i}
            className={`bx ${i < rating ? "bxs-star filled" : "bx-star empty"}`}
          />
        ))}
      </div>
    );
  };

  // Determine what content to render in the review section
  const renderReviewContent = () => {
    if (variant === "review" && rating !== undefined && reviewText) {
      // Self-enclosing review with rating and text
      return (
        <div className="list-item__review-content">
          {renderStars(rating)}
          <p className="list-item__review-text">{reviewText}</p>
        </div>
      );
    }

    // Fallback to children for backward compatibility
    if (children) {
      return <div className="list-item__review-content">{children}</div>;
    }

    return null;
  };

  const combinedClassName = [
    "list-item",
    `list-item--${variant}`,
    disabled && "list-item--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={combinedClassName}
      onClick={handleClick}
      role={onClick ? "button" : "listitem"}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      <div className="list-item__content">
        <div className="list-item__icon">
          <i className={`bx ${icon}`} />
        </div>
        <div className="list-item__details">
          {variant === "info" ? (
            <div className="list-item__info">
              <span className="list-item__label">{title}:</span>
              <span className="list-item__value">{subtitle}</span>
            </div>
          ) : (
            <>
              <h5>{title}</h5>
              <span>{subtitle}</span>
              {renderReviewContent()}
            </>
          )}
        </div>
      </div>
      {onAction && (
        <div
          className="list-item__action"
          onClick={handleActionClick}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Action button"
        >
          <i className={`bx ${actionIcon}`} />
        </div>
      )}
    </div>
  );
};

ListItem.displayName = "ListItem";
