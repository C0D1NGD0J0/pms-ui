"use client";
import { Button } from "@components/FormElements";
import DaySeparator from "@components/DaySeparator";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { NotificationItem } from "@components/Notifications";
import React, { useCallback, useState, useMemo } from "react";
import { groupNotificationsByDate } from "@utils/notificationUtils";
import {
  useSSENotificationActions,
  useSSENotifications,
} from "@store/sseNotification.store";

const filterOptions = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "maintenance", label: "Maintenance" },
  { value: "payment", label: "Payments" },
  { value: "alert", label: "Alerts" },
  { value: "message", label: "Messages" },
];

const NotificationsPage = () => {
  const { user } = useCurrentUser();
  const cuid = user?.client?.cuid;

  const { notifications, announcements } = useSSENotifications();
  const { markAsRead, reconnect } = useSSENotificationActions();
  const [activeFilter, setActiveFilter] = useState("all");

  const allNotifications = useMemo(() => {
    return [...notifications, ...announcements].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notifications, announcements]);

  const filteredNotifications = useMemo(() => {
    let filtered = [...allNotifications];

    switch (activeFilter) {
      case "unread":
        filtered = filtered.filter((n) => !n.isRead);
        break;
      case "maintenance":
        filtered = filtered.filter(
          (n) => n.metadata?.category === "maintenance"
        );
        break;
      case "payment":
        filtered = filtered.filter((n) => n.metadata?.category === "payment");
        break;
      case "alert":
        filtered = filtered.filter((n) => n.metadata?.category === "alert");
        break;
      case "message":
        filtered = filtered.filter((n) => n.metadata?.category === "message");
        break;
      default:
        // "all" - no filtering
        break;
    }

    return filtered;
  }, [allNotifications, activeFilter]);

  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDate(filteredNotifications);
  }, [filteredNotifications]);

  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = useCallback(
    async (nuid: string, isTransient: boolean = false) => {
      if (cuid && !isTransient) {
        await markAsRead(cuid, nuid);
      }
    },
    [cuid, markAsRead]
  );

  const handleReconnect = useCallback(() => {
    if (cuid) {
      reconnect(cuid);
    }
  }, [cuid, reconnect]);

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = allNotifications.filter(
      (n) => !n.isRead && !n.metadata?.isTransient
    );
    for (const notification of unreadNotifications) {
      await handleMarkAsRead(notification.nuid, false);
    }
  };

  const handleDeleteNotification = (nuid: string) => {
    handleMarkAsRead(nuid);
  };

  return (
    <div className="page notifications">
      <div className="page-header">
        <div className="page-header__title">
          <h2>
            Notifications{" "}
            {unreadCount > 0 && (
              <span className="notification-counter">{unreadCount}</span>
            )}
          </h2>
          <small>Stay updated with important alerts and information</small>
        </div>
      </div>

      <div className="notification-header-actions">
        <div className="notification-filter">
          {filterOptions.map((option) => (
            <div
              key={option.value}
              className={`filter-chip ${
                activeFilter === option.value ? "active" : ""
              }`}
              onClick={() => setActiveFilter(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>

        <div className="bulk-actions">
          <Button
            type="button"
            className="btn-outline"
            label="Mark All as Read"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            icon={<i className="bx bx-check-double"></i>}
          />
        </div>
      </div>

      {groupedNotifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bx bx-bell-off"></i>
          </div>
          <div className="empty-state-text">No notifications to display</div>
          <Button
            className="btn-outline"
            label="Refresh"
            onClick={handleReconnect}
            icon={<i className="bx bx-refresh"></i>}
          />
        </div>
      ) : (
        groupedNotifications.map(([dateKey, dayNotifications]) => {
          return (
            <React.Fragment key={dateKey}>
              <DaySeparator date={new Date(dateKey)} />

              <div className="notifications-container">
                {dayNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.nuid}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDeleteNotification}
                  />
                ))}
              </div>
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};

export default NotificationsPage;
