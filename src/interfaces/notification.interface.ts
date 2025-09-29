export interface INotification {
  nuid: string;
  title: string;
  message: string;
  type: "system" | "property" | "user";
  priority: "high" | "medium" | "low";
  recipientType: "individual" | "announcement";
  isRead: boolean;
  recipientId?: string;
  createdAt: string;
  updatedAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  id: string;
}

export interface NotificationFilters {
  type?: string;
  priority?: "low" | "medium" | "high";
  isRead?: boolean;
  last7days?: boolean;
  last30days?: boolean;
}
