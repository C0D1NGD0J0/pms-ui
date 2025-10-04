export interface INotification {
  id: string;
  nuid: string;
  title: string;
  message: string;
  type: "system" | "property" | "user";
  priority: "high" | "medium" | "low";
  recipientType: "individual" | "announcement";
  recipient?: string;
  cuid?: string; // Client UID for routing
  isRead: boolean;
  readAt?: string | null;
  recipientId?: string;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
  deletedAt?: string | null;
  actionUrl?: string; // This will be computed dynamically
  resourceInfo?: {
    resourceName: string;
    resourceUid: string;
    resourceId: string;
  };
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  type?: string;
  page?: number;
  limit?: number;
  priority?: "low" | "medium" | "high";
  isRead?: boolean;
  last7days?: boolean;
  last30days?: boolean;
}
