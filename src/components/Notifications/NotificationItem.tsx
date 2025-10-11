import { format } from "date-fns";
import React, { useState } from "react";
import { getNotificationIcon } from "@utils/notificationUtils";
import { INotification } from "@interfaces/notification.interface";

import NotificationActions from "./NotificationActions";
import NotificationErrorList from "./NotificationErrorList";

interface NotificationItemProps {
  notification: INotification;
  onMarkAsRead: (nuid: string, isTransient: boolean) => void;
  onDelete: (nuid: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTransient = notification.metadata?.isTransient === true;
  const errors = notification.metadata?.errors;
  const hasErrors = errors && Array.isArray(errors) && errors.length > 0;

  const isJobError = hasErrors && errors[0]?.rowNumber !== undefined;
  const errorCount =
    notification.metadata?.errorCount || (hasErrors ? errors.length : 0);

  const formatTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a");
    }

    return format(date, "MMM dd, yyyy");
  };

  const toggleErrorView = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`notification-item ${!notification.isRead ? "unread" : ""} ${
        isTransient ? "transient" : ""
      }`}
      data-type={notification.metadata?.category || notification.type}
    >
      <div
        className={`notification-icon ${
          notification.metadata?.category || notification.type
        }`}
      >
        <i
          className={`bx ${getNotificationIcon(
            notification.metadata?.category || notification.type
          )}`}
        ></i>
      </div>

      <div className="notification-content">
        <div className="notification-header">
          <div className={`notification-title ${isJobError ? "danger" : ""}`}>
            {notification.title}
          </div>
          <div className="notification-time">
            {formatTime(notification.createdAt)}
          </div>
        </div>

        <div className="notification-message">{notification.message}</div>

        {hasErrors && isExpanded && (
          <NotificationErrorList
            errors={errors}
            errorCount={errorCount}
            isJobError={isJobError}
          />
        )}

        <NotificationActions
          notification={notification}
          isTransient={isTransient}
          hasErrors={hasErrors}
          errorCount={errorCount}
          isExpanded={isExpanded}
          onToggleErrors={toggleErrorView}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default NotificationItem;
