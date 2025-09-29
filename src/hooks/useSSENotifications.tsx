"use client";

import { useCurrentUser } from "@hooks/useCurrentUser";
import { notificationService } from "@services/notification";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  NotificationFilters,
  INotification,
} from "@interfaces/notification.interface";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface SSEState {
  notifications: INotification[];
  announcements: INotification[];
  connectionStatus: ConnectionStatus;
  error?: string;
}

export const useSSENotifications = (filters?: NotificationFilters) => {
  const { user } = useCurrentUser();
  const cuid = user?.client?.cuid;

  const [state, setState] = useState<SSEState>({
    notifications: [],
    announcements: [],
    connectionStatus: "disconnected",
  });

  const personalSourceRef = useRef<EventSource | null>(null);
  const announcementsSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const getReconnectDelay = useCallback(() => {
    return Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
  }, []);

  const setupPersonalStream = useCallback(() => {
    if (!cuid || personalSourceRef.current) return;

    setState((prev) => ({ ...prev, connectionStatus: "connecting" }));

    personalSourceRef.current =
      notificationService.createPersonalNotificationsStream(cuid, filters);

    personalSourceRef.current.addEventListener("my-notifications", (event) => {
      const data = JSON.parse(event.data);
      setState((prev) => ({
        ...prev,
        notifications: data.notifications,
        connectionStatus: "connected",
        error: undefined,
      }));

      reconnectAttemptsRef.current = 0; // reset on successful connection
    });

    personalSourceRef.current.addEventListener("notification", (event) => {
      const notification = JSON.parse(event.data);

      setState((prev) => ({
        ...prev,
        notifications: [notification, ...prev.notifications],
      }));
    });

    personalSourceRef.current.onerror = (error) => {
      console.error("Personal notifications SSE error:", error);

      if (personalSourceRef.current?.readyState === EventSource.CLOSED) {
        setState((prev) => ({ ...prev, connectionStatus: "error" }));
        attemptReconnection("personal");
      }
    };

    personalSourceRef.current.onopen = () => {
      setState((prev) => ({ ...prev, connectionStatus: "connected" }));
    };
  }, [cuid, filters]);

  const setupAnnouncementsStream = useCallback(() => {
    if (!cuid || announcementsSourceRef.current) return;

    announcementsSourceRef.current =
      notificationService.createAnnouncementsStream(cuid, filters);

    announcementsSourceRef.current.addEventListener(
      "announcements",
      (event) => {
        const data = JSON.parse(event.data);
        setState((prev) => ({
          ...prev,
          announcements: data.notifications || [],
        }));
      }
    );

    announcementsSourceRef.current.addEventListener("announcement", (event) => {
      const announcement = JSON.parse(event.data);

      setState((prev) => ({
        ...prev,
        announcements: [announcement, ...prev.announcements],
      }));
    });

    announcementsSourceRef.current.onerror = (error) => {
      console.error("Announcements SSE error:", error);
    };
  }, [cuid, filters]);

  const attemptReconnection = useCallback(
    (streamType: "personal" | "announcements") => {
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        setState((prev) => ({
          ...prev,
          connectionStatus: "error",
          error: "Max reconnection attempts reached",
        }));
        return;
      }

      reconnectAttemptsRef.current++;
      const delay = getReconnectDelay();

      setState((prev) => ({ ...prev, connectionStatus: "connecting" }));

      setTimeout(() => {
        console.log(`Attempting SSE reconnection 
  (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

        if (streamType === "personal") {
          personalSourceRef.current?.close();
          personalSourceRef.current = null;
          setupPersonalStream();
        }
      }, delay);
    },
    [getReconnectDelay, setupPersonalStream, maxReconnectAttempts]
  );

  const markAsRead = useCallback(
    async (nuid: string) => {
      if (!cuid) return;

      try {
        await notificationService.markAsRead(cuid, nuid);

        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((notif) =>
            notif.nuid === nuid ? { ...notif, isRead: true } : notif
          ),
          announcements: prev.announcements.map((notif) =>
            notif.nuid === nuid ? { ...notif, isRead: true } : notif
          ),
        }));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    [cuid]
  );

  useEffect(() => {
    if (!cuid) {
      // Clean up connections if user logs out
      personalSourceRef.current?.close();
      announcementsSourceRef.current?.close();
      personalSourceRef.current = null;
      announcementsSourceRef.current = null;

      setState({
        notifications: [],
        announcements: [],
        connectionStatus: "disconnected",
      });
      return;
    }

    setupPersonalStream();
    setupAnnouncementsStream();

    return () => {
      personalSourceRef.current?.close();
      announcementsSourceRef.current?.close();
      personalSourceRef.current = null;
      announcementsSourceRef.current = null;
    };
  }, [cuid, setupPersonalStream, setupAnnouncementsStream]);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setState((prev) => ({ ...prev, error: undefined }));

    personalSourceRef.current?.close();
    announcementsSourceRef.current?.close();
    personalSourceRef.current = null;
    announcementsSourceRef.current = null;

    if (cuid) {
      setupPersonalStream();
      setupAnnouncementsStream();
    }
  }, [cuid, setupPersonalStream, setupAnnouncementsStream]);

  return {
    ...state,
    markAsRead,
    reconnect,
    isConnected: state.connectionStatus === "connected",
    isConnecting: state.connectionStatus === "connecting",
    hasError: state.connectionStatus === "error",
  };
};
