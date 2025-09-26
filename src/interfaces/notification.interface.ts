export interface INotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: "info" | "warning" | "success" | "message" | "system";
  actionUrl?: string;
  avatar?: string;
  priority: "high" | "medium" | "low";
}

export interface INotificationDropdownProps {
  notifications: INotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onViewAll: () => void;
}
