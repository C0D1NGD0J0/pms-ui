import { format } from "date-fns";
import { INotification } from "@interfaces/notification.interface";

/**
 * Groups notifications by date
 */
export const groupNotificationsByDate = (notifications: INotification[]) => {
  const groups = new Map<string, INotification[]>();

  notifications.forEach((notification) => {
    const dateKey = format(new Date(notification.createdAt), "yyyy-MM-dd");
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(notification);
  });

  // Sort groups by date (most recent first)
  return Array.from(groups.entries()).sort(
    ([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()
  );
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "system":
      return "bx-cog";
    case "property":
      return "bx-building-house";
    case "user":
      return "bx-user";
    case "maintenance":
      return "bx-wrench";
    case "payment":
      return "bx-credit-card";
    case "alert":
      return "bx-error-circle";
    case "message":
      return "bx-envelope";
    default:
      return "bx-bell";
  }
};

/**
 * Map notification types to filter categories
 */
export const getNotificationCategory = (
  notification: INotification
): string => {
  // You can customize this mapping based on your notification structure
  const { type, metadata } = notification;

  if (metadata?.category) {
    return metadata.category;
  }

  // Default mapping based on type
  switch (type) {
    case "system":
      return "alert";
    case "property":
      return "maintenance";
    case "user":
      return "message";
    default:
      return type;
  }
};

/**
 * Build action URL for notification based on resource info and context
 */
export const buildNotificationActionUrl = (
  notification: INotification
): string | null => {
  const { resourceInfo, cuid, title } = notification;

  if (!resourceInfo) return null;

  const { resourceName, resourceUid } = resourceInfo;

  switch (resourceName) {
    case "property":
      if (title.includes("Approval Required")) {
        // Take user to property edit page for approval
        return `/properties/${resourceUid}/edit`;
      }
      // For other property notifications, go to view page
      return `/properties/${resourceUid}`;

    case "maintenance":
      return `/maintenance/${resourceUid}`;

    case "user":
      return `/users/${cuid}/staff/${resourceUid}`;

    default:
      return null;
  }
};

/**
 * Get computed action URL for notification (uses buildNotificationActionUrl or falls back to actionUrl)
 */
export const getNotificationActionUrl = (
  notification: INotification
): string | null => {
  // First try to build URL from resourceInfo
  const dynamicUrl = buildNotificationActionUrl(notification);
  if (dynamicUrl) return dynamicUrl;

  // Fall back to static actionUrl if provided
  return notification.actionUrl || null;
};
