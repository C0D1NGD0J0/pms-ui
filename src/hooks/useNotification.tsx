"use client";
import { Button, notification } from "antd";
import React, { createContext, useContext } from "react";

type NotificationInstance = "info" | "warning" | "error" | "success" | "open";
type NotificationContextType = {
  openNotification: (
    type: NotificationInstance,
    title: string,
    message: string,
    opts?: NotificationContextMetaType,
  ) => void;
};
type NotificationContextMetaType = {
  btnText?: string;
  onClose?: () => void;
  duration?: number | null;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: NotificationInstance,
    title: string,
    description: string,
    opts?: NotificationContextMetaType,
  ) => {
    if (type === "open" && opts) {
      const key = `open${Date.now()}`;
      const btn = (
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          {opts?.btnText}
        </Button>
      );

      api[type as NotificationInstance]({
        message: title,
        placement: "topRight",
        btn,
        key,
        duration: 0,
        onClick: opts.onClose,
        description: description,
      });
      return;
    }

    api[type as NotificationInstance]({
      duration: opts?.duration || 4,
      message: title,
      placement: "topRight",
      description: description,
    });
  };

  return (
    <NotificationContext.Provider value={{ openNotification }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, useNotification };
