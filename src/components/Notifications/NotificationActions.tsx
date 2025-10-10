import React from "react";
import Link from "next/link";
import { Button } from "@components/FormElements";
import { INotification } from "@interfaces/notification.interface";
import { getNotificationActionUrl } from "@utils/notificationUtils";

interface NotificationActionsProps {
  notification: INotification;
  isTransient: boolean;
  hasErrors: boolean;
  errorCount: number;
  isExpanded: boolean;
  onToggleErrors: () => void;
  onMarkAsRead: (nuid: string, isTransient: boolean) => void;
  onDelete: (nuid: string) => void;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  notification,
  isTransient,
  hasErrors,
  errorCount,
  isExpanded,
  onToggleErrors,
  onMarkAsRead,
  onDelete,
}) => {
  return (
    <div className="notification-actions">
      {/* Show View Errors button for notifications with errors */}
      {hasErrors && (
        <Button
          className="action-button primary"
          label={isExpanded ? "Hide Errors" : `View Errors (${errorCount})`}
          onClick={onToggleErrors}
          icon={
            <i
              className={`bx ${
                isExpanded ? "bx-chevron-up" : "bx-chevron-down"
              }`}
            ></i>
          }
        />
      )}

      {/* Show View Details for non-transient notifications with actionUrl */}
      {!isTransient && getNotificationActionUrl(notification) && (
        <Link
          href={getNotificationActionUrl(notification)!}
          className="action-button primary"
        >
          <i className="bx bx-glasses"></i> View Details
        </Link>
      )}

      {/* Only show Mark as Read for non-transient unread notifications */}
      {!isTransient && !notification.isRead && (
        <Button
          className="action-button secondary"
          label="Mark as Read"
          onClick={() => onMarkAsRead(notification.nuid, isTransient)}
          icon={<i className="bx bx-check"></i>}
        />
      )}

      {/* Show Delete for read notifications */}
      {!isTransient && notification.isRead && (
        <Button
          className="action-button secondary"
          label="Delete"
          onClick={() => onDelete(notification.nuid)}
          icon={<i className="bx bx-trash"></i>}
        />
      )}
    </div>
  );
};

export default NotificationActions;
