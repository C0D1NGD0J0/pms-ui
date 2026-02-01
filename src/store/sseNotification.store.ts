import { create } from "zustand";
import { notificationService } from "@services/notification";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  NotificationFilters,
  INotification,
} from "@interfaces/notification.interface";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface SubscriptionInfo {
  showPaymentModal: boolean;
  paymentStatus: "success" | "canceled" | "failed" | null;
  paymentMessage: string;
  eventType: string | null;
  subscription?: {
    plan: string;
    status: string;
    endDate?: string;
  };
}

interface NotificationState {
  notifications: INotification[];
  announcements: INotification[];
  connectionStatus: ConnectionStatus;
  error?: string;
  personalSourceRef: EventSource | null;
  announcementsSourceRef: EventSource | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  subscriptionInfo: SubscriptionInfo;
  actions: {
    initializeConnection: (cuid: string, filters?: NotificationFilters) => void;
    disconnectStreams: () => void;
    markAsRead: (cuid: string, nuid: string) => Promise<void>;
    reconnect: (cuid: string, filters?: NotificationFilters) => void;
    setupPersonalStream: (cuid: string, filters?: NotificationFilters) => void;
    setupAnnouncementsStream: (
      cuid: string,
      filters?: NotificationFilters
    ) => void;
    attemptReconnection: (
      streamType: "personal" | "announcements",
      cuid: string,
      filters?: NotificationFilters
    ) => void;
    clearState: () => void;
    handleSubscriptionUpdate: (data: any) => void;
    closePaymentModal: () => void;
  };
}

const useSSENotificationStore = create<NotificationState>()(
  persist<NotificationState>(
    (set, get) => ({
      notifications: [],
      announcements: [],
      connectionStatus: "disconnected",
      error: undefined,
      personalSourceRef: null,
      announcementsSourceRef: null,
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      subscriptionInfo: {
        showPaymentModal: false,
        paymentStatus: null,
        paymentMessage: "",
        eventType: null,
        subscription: undefined,
      },
      actions: {
        initializeConnection: (cuid: string, filters?: NotificationFilters) => {
          const { personalSourceRef, announcementsSourceRef } = get();

          // Don't create new connections if already connected
          if (personalSourceRef || announcementsSourceRef) return;

          get().actions.setupPersonalStream(cuid, filters);
          get().actions.setupAnnouncementsStream(cuid, filters);
        },

        setupPersonalStream: (cuid: string, filters?: NotificationFilters) => {
          const { personalSourceRef } = get();
          if (!cuid || personalSourceRef) return;

          set({ connectionStatus: "connecting" });
          const newPersonalSource =
            notificationService.createPersonalNotificationsStream(cuid, {
              page: 1,
              limit: 40,
              isRead: false,
            });
          set({ personalSourceRef: newPersonalSource });

          newPersonalSource.addEventListener("my-notifications", (event) => {
            const data = JSON.parse(event.data);

            if (data.isInitial) {
              set({
                notifications: data.notifications,
                connectionStatus: "connected",
                error: undefined,
                reconnectAttempts: 0,
              });
            } else {
              set((state) => ({
                notifications: [...data.notifications, ...state.notifications],
                connectionStatus: "connected",
                error: undefined,
                reconnectAttempts: 0,
              }));
            }
          });

          newPersonalSource.addEventListener("job-notification", (event) => {
            const jobUpdate = JSON.parse(event.data);
            const getJobTitle = () => {
              const jobTypeLabel =
                jobUpdate.jobType === "csv_validation"
                  ? "CSV validation"
                  : jobUpdate.jobType === "csv_invitation"
                    ? "CSV import"
                    : jobUpdate.jobType.replace(/_/g, " ");

              if (jobUpdate.stage === "started") {
                return `${jobTypeLabel} started`;
              } else if (jobUpdate.stage === "completed") {
                return `${jobTypeLabel} completed`;
              } else if (jobUpdate.stage === "failed") {
                return `${jobTypeLabel} failed`;
              }
              return jobTypeLabel;
            };

            // convert job notification to INotification format
            const notification: INotification = {
              id: jobUpdate.jobId,
              nuid: `job-${jobUpdate.jobId}`,
              title: getJobTitle(),
              message: jobUpdate.message || jobUpdate.metadata?.message || "",
              type: "system",
              priority: jobUpdate.stage === "failed" ? "high" : "medium",
              recipientType: "individual",
              isRead: false,
              createdAt: new Date().toISOString(),
              metadata: {
                jobId: jobUpdate.jobId,
                jobType: jobUpdate.jobType,
                stage: jobUpdate.stage,
                progress: jobUpdate.progress,
                isTransient: true,
                errors: jobUpdate.errors,
                errorCount: jobUpdate.errorCount,
                totalRows: jobUpdate.totalRows,
                validCount: jobUpdate.validCount,
                totalItems: jobUpdate.totalItems,
                validData: jobUpdate.validData,
                ...jobUpdate.metadata,
              },
            };

            set((state) => ({
              notifications: [notification, ...state.notifications],
            }));
          });

          newPersonalSource.addEventListener("subscription_update", (event) => {
            const data = JSON.parse(event.data);

            console.log("🔔 [SSE] subscription_update received:", {
              eventType: data.eventType,
              message: data.message,
              subscription: data.subscription,
              timestamp: data.timestamp,
              action: data.action,
            });

            if (data.action === "REFETCH_CURRENT_USER") {
              get().actions.handleSubscriptionUpdate(data);
            }
          });

          newPersonalSource.onerror = () => {
            if (newPersonalSource.readyState === EventSource.CLOSED) {
              set({ connectionStatus: "error" });
              get().actions.attemptReconnection("personal", cuid, filters);
            }
          };

          newPersonalSource.onopen = () => {
            set({ connectionStatus: "connected" });
          };
        },

        setupAnnouncementsStream: (
          cuid: string,
          filters?: NotificationFilters
        ) => {
          const { announcementsSourceRef } = get();
          if (!cuid || announcementsSourceRef) return;

          const newAnnouncementsSource =
            notificationService.createAnnouncementsStream(cuid, filters);
          set({ announcementsSourceRef: newAnnouncementsSource });

          newAnnouncementsSource.addEventListener("announcements", (event) => {
            const data = JSON.parse(event.data);

            if (data.isInitial) {
              set({ announcements: data.notifications || [] });
            } else {
              set((state) => ({
                announcements: [
                  ...(data.notifications || []),
                  ...state.announcements,
                ],
              }));
            }
          });

          newAnnouncementsSource.onerror = (error) => {
            console.error("Announcements SSE error:", error);
          };
        },

        attemptReconnection: (
          streamType: "personal" | "announcements",
          cuid: string,
          filters?: NotificationFilters
        ) => {
          const { reconnectAttempts, maxReconnectAttempts } = get();

          if (reconnectAttempts >= maxReconnectAttempts) {
            set({
              connectionStatus: "error",
              error: "Max reconnection attempts reached",
            });
            return;
          }

          const newAttempts = reconnectAttempts + 1;
          const delay = Math.min(1000 * Math.pow(2, newAttempts), 30000);

          set({
            connectionStatus: "connecting",
            reconnectAttempts: newAttempts,
          });

          setTimeout(() => {
            console.log(
              `Attempting SSE reconnection (${newAttempts}/${maxReconnectAttempts})`
            );

            if (streamType === "personal") {
              const { personalSourceRef } = get();
              personalSourceRef?.close();
              set({ personalSourceRef: null });
              get().actions.setupPersonalStream(cuid, filters);
            }
          }, delay);
        },

        markAsRead: async (cuid: string, nuid: string) => {
          if (!cuid) return;

          try {
            await notificationService.markAsRead(cuid, nuid);

            set((state) => ({
              notifications: state.notifications.map((notif) =>
                notif.nuid === nuid ? { ...notif, isRead: true } : notif
              ),
              announcements: state.announcements.map((notif) =>
                notif.nuid === nuid ? { ...notif, isRead: true } : notif
              ),
            }));
          } catch (error) {
            console.error("Failed to mark notification as read:", error);
          }
        },

        reconnect: (cuid: string, filters?: NotificationFilters) => {
          const { personalSourceRef, announcementsSourceRef } = get();

          set({
            reconnectAttempts: 0,
            error: undefined,
          });

          personalSourceRef?.close();
          announcementsSourceRef?.close();

          set({
            personalSourceRef: null,
            announcementsSourceRef: null,
          });

          if (cuid) {
            get().actions.setupPersonalStream(cuid, filters);
            get().actions.setupAnnouncementsStream(cuid, filters);
          }
        },

        disconnectStreams: () => {
          const { personalSourceRef, announcementsSourceRef } = get();

          personalSourceRef?.close();
          announcementsSourceRef?.close();

          set({
            personalSourceRef: null,
            announcementsSourceRef: null,
            connectionStatus: "disconnected",
            notifications: [],
            announcements: [],
            reconnectAttempts: 0,
            error: undefined,
          });
        },

        clearState: () => {
          get().actions.disconnectStreams();
        },

        handleSubscriptionUpdate: (data: any) => {
          const notificationConfig: Record<
            string,
            { title: string; priority: "high" | "medium" | "low" }
          > = {
            subscription_activated: {
              title: "🎉 Subscription Activated",
              priority: "high",
            },
            subscription_renewed: {
              title: "✓ Subscription Renewed",
              priority: "medium",
            },
            payment_failed: {
              title: "⚠️ Payment Failed",
              priority: "high",
            },
            subscription_canceled: {
              title: "Subscription Canceled",
              priority: "medium",
            },
            subscription_updated: {
              title: "Subscription Updated",
              priority: "medium",
            },
          };

          const config = notificationConfig[data.eventType] || {
            title: "Subscription Update",
            priority: "medium" as const,
          };

          const notification: INotification = {
            id: `sub-${Date.now()}-${Math.random()}`,
            nuid: `sub-${Date.now()}-${Math.random()}`,
            title: config.title,
            message: data.message || "Your subscription has been updated",
            type: "system",
            priority: config.priority,
            isRead: false,
            createdAt: data.timestamp || new Date().toISOString(),
            recipientType: "individual",
            metadata: {
              isTransient: true,
              eventType: data.eventType,
              subscription: data.subscription,
            },
          };

          set((state) => ({
            notifications: [notification, ...state.notifications],
          }));
        },

        closePaymentModal: () => {
          set({
            subscriptionInfo: {
              showPaymentModal: false,
              paymentStatus: null,
              paymentMessage: "",
              eventType: null,
              subscription: undefined,
            },
          });
        },
      },
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => {
        return {
          connectionStatus: state.connectionStatus,
        } as unknown as NotificationState;
      },
    }
  )
);

export const useSSENotifications = () => {
  const {
    notifications,
    announcements,
    connectionStatus,
    error,
    reconnectAttempts,
    maxReconnectAttempts,
    subscriptionInfo,
  } = useSSENotificationStore();

  return {
    notifications,
    announcements,
    connectionStatus,
    error,
    reconnectAttempts,
    maxReconnectAttempts,
    subscriptionInfo,
    isConnected: connectionStatus === "connected",
    isConnecting: connectionStatus === "connecting",
    hasError: connectionStatus === "error",
  };
};

export const useSSENotificationActions = () => {
  const { actions } = useSSENotificationStore();
  return {
    initializeConnection: actions.initializeConnection,
    disconnectStreams: actions.disconnectStreams,
    markAsRead: actions.markAsRead,
    reconnect: actions.reconnect,
    clearState: actions.clearState,
    closePaymentModal: actions.closePaymentModal,
  };
};
