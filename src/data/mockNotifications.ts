import { INotification } from "@interfaces/notification.interface";

export const mockNotifications: INotification[] = [
  {
    id: "1",
    nuid: "nuid-1",
    title: "New Message",
    message:
      "You have received a new message from John Smith regarding property inquiry.",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    isRead: false,
    type: "user",
    priority: "high",
    recipientType: "individual",
    actionUrl: "/messages",
  },
  {
    id: "2",
    nuid: "nuid-2",
    title: "Property Approved",
    message:
      "Your property listing for Villa Sunset has been approved and is now live.",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRead: false,
    type: "property",
    priority: "medium",
    recipientType: "individual",
    actionUrl: "/properties",
  },
  {
    id: "3",
    nuid: "nuid-3",
    title: "Maintenance Request",
    message:
      "New maintenance request submitted for Unit 204 - Plumbing issue reported.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: true,
    type: "property",
    priority: "high",
    recipientType: "individual",
    actionUrl: "/maintenance",
  },
  {
    id: "4",
    nuid: "nuid-4",
    title: "System Update",
    message:
      "System maintenance completed successfully. All services are now operational.",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    isRead: true,
    type: "system",
    priority: "low",
    recipientType: "announcement",
  },
  {
    id: "5",
    nuid: "nuid-5",
    title: "Payment Received",
    message:
      "Monthly rent payment of $2,500 received from tenant Sarah Johnson.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    isRead: true,
    type: "property",
    priority: "medium",
    recipientType: "individual",
    actionUrl: "/payments",
  },
];
