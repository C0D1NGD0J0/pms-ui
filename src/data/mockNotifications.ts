import { INotification } from "@interfaces/notification.interface";

export const mockNotifications: INotification[] = [
  {
    id: "1",
    title: "New Message",
    message:
      "You have received a new message from John Smith regarding property inquiry.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    type: "message",
    priority: "high",
    actionUrl: "/messages",
    avatar: "/assets/imgs/avatar.png",
  },
  {
    id: "2",
    title: "Property Approved",
    message:
      "Your property listing for Villa Sunset has been approved and is now live.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    type: "success",
    priority: "medium",
    actionUrl: "/properties",
  },
  {
    id: "3",
    title: "Maintenance Request",
    message:
      "New maintenance request submitted for Unit 204 - Plumbing issue reported.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
    type: "warning",
    priority: "high",
    actionUrl: "/maintenance",
  },
  {
    id: "4",
    title: "System Update",
    message:
      "System maintenance completed successfully. All services are now operational.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true,
    type: "system",
    priority: "low",
  },
  {
    id: "5",
    title: "Payment Received",
    message:
      "Monthly rent payment of $2,500 received from tenant Sarah Johnson.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isRead: true,
    type: "info",
    priority: "medium",
    actionUrl: "/payments",
  },
];
