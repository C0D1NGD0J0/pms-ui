import { create } from "zustand";
import { notificationService } from "@services/notification";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  NotificationFilters,
  INotification,
} from "@interfaces/notification.interface";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface NotificationState {
  notifications: INotification[];
  announcements: INotification[];
  connectionStatus: ConnectionStatus;
  error?: string;
  personalSourceRef: EventSource | null;
  announcementsSourceRef: EventSource | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
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
      },
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => {
        // Only persist connection status, not the actual connections
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
  } = useSSENotificationStore();

  return {
    notifications,
    announcements,
    connectionStatus,
    error,
    reconnectAttempts,
    maxReconnectAttempts,
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
  };
};
