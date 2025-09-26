"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { INotification } from "@interfaces/notification.interface";

interface NotificationDropdownProps {
  notifications: INotification[];
  onNotificationUpdate: (notifications: INotification[]) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onNotificationUpdate,
}) => {
  const router = useRouter();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    onNotificationUpdate(updatedNotifications);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
    onNotificationUpdate(updatedNotifications);
  };

  const handleViewAll = () => {
    router.push("/notifications");
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="navbar-notification-dropdown">
      <div className="navbar-notification-dropdown__header">
        <h4>Notifications ({unreadCount} unread)</h4>
      </div>

      {notifications.slice(0, 5).map((notification) => (
        <div
          key={notification.id}
          className={`navbar-notification-dropdown__item ${
            !notification.isRead ? "unread" : ""
          }`}
          onClick={() =>
            !notification.isRead && handleMarkAsRead(notification.id)
          }
        >
          <h5>{notification.title}</h5>
          <p>
            {notification.message} • {formatTime(notification.timestamp)}
          </p>
          {notification.actionUrl && (
            <Link href={notification.actionUrl}>View →</Link>
          )}
        </div>
      ))}

      <div className="navbar-notification-dropdown__footer">
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead}>Mark All Read</button>
        )}
        <button onClick={handleViewAll}>View All</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
