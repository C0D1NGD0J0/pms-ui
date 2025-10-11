"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@src/components/FormElements";
import { INotification } from "@src/interfaces/notification.interface";

interface INotificationDropdownProps {
  notifications: INotification[];
  announcements: INotification[];
  markAsRead: (id: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
  hasError: boolean;
  reconnect: () => void;
}

const NotificationDropdown = ({
  notifications,
  announcements,
  markAsRead,
  isConnected,
  isConnecting,
  hasError,
  reconnect,
}: INotificationDropdownProps) => {
  const router = useRouter();

  const allNotifications = [...notifications, ...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (nuid: string, isTransient: boolean) => {
    // Don't mark transient notifications as read (they're not in DB)
    if (!isTransient) {
      markAsRead(nuid);
    }
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = allNotifications.filter(
      (n) => !n.isRead && !n.metadata?.isTransient
    );
    unreadNotifications.forEach((notification) => {
      markAsRead(notification.nuid);
    });
  };

  const handleViewAll = () => {
    router.push("/notifications");
  };

  const formatTime = (createdAt: string) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "system":
        return "⚙️";
      case "property":
        return "🏠";
      case "user":
        return "👤";
      default:
        return "📧";
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "high-priority";
      case "medium":
        return "medium-priority";
      case "low":
        return "low-priority";
      default:
        return "";
    }
  };

  return (
    <div className="navbar-notification-dropdown">
      <div className="navbar-notification-dropdown__header">
        <h4>
          Notifications ({unreadCount} unread)
          {isConnecting && (
            <span className="connection-status connecting">⏳</span>
          )}
          {isConnected && (
            <span className="connection-status connected">🟢</span>
          )}
          {hasError && (
            <span className="connection-status error" onClick={reconnect}>
              🔴 Click to retry
            </span>
          )}
        </h4>
      </div>

      {hasError && (
        <div className="navbar-notification-dropdown__error">
          <p>
            Connection lost. <button onClick={reconnect}>Reconnect</button>
          </p>
        </div>
      )}

      {allNotifications.slice(0, 5).map((notification) => {
        const isTransient = notification.metadata?.isTransient === true;

        return (
          <div
            key={notification.nuid}
            className={`navbar-notification-dropdown__item ${
              !notification.isRead ? "unread" : ""
            } ${getPriorityClass(notification.priority)} ${
              isTransient ? "transient" : ""
            }`}
            onClick={() =>
              !notification.isRead &&
              handleMarkAsRead(notification.nuid, isTransient)
            }
          >
            <div className="notification-header">
              <span className="notification-icon">
                {getNotificationIcon(notification.type)}
              </span>
              <h5>{notification.title}</h5>
              <span className="notification-type">
                {notification.recipientType === "announcement" ? "📢" : ""}
              </span>
            </div>
            <p className="notification-message">
              {notification.message}
              <span>{formatTime(notification.createdAt)}</span>
            </p>

            {/* show actionUrl for non-transient notifications */}
            {!isTransient && notification.actionUrl && (
              <Link href={notification.actionUrl}>View →</Link>
            )}
          </div>
        );
      })}

      {allNotifications.length === 0 && (
        <div className="navbar-notification-dropdown__empty">
          <p>No notifications</p>
        </div>
      )}

      <div className="navbar-notification-dropdown__footer">
        {unreadCount >= 1 && (
          <Button
            label="Mark All Read"
            onClick={handleMarkAllAsRead}
            className="btn-outline btn-grow"
            disabled={allNotifications.length === 0}
          />
        )}
        <Button
          label="View All"
          onClick={handleViewAll}
          className="btn-secondary btn-grow"
        />
      </div>
    </div>
  );
};

export default NotificationDropdown;
