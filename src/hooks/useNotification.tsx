"use client";
import { notification, message, Button } from "antd";
import React, { createContext, useContext } from "react";

type NotificationInstance = "info" | "warning" | "error" | "success" | "open";
type MessageInstance =
  | "info"
  | "warning"
  | "error"
  | "success"
  | "loading"
  | "open";

type NotificationContextMetaType = {
  btnText?: string;
  onClose?: () => void;
  duration?: number | null;
};

type MessageContextMetaType = {
  duration?: number;
  onClose?: () => void;
  key?: string;
};

type ConfirmOptions = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "error" | "info";
};

type NotificationContextType = {
  openNotification: (
    type: NotificationInstance,
    title: string,
    description: string,
    opts?: NotificationContextMetaType
  ) => void;

  message: Record<
    MessageInstance,
    (content: string, opts?: MessageContextMetaType) => void
  >;

  confirm: (options: ConfirmOptions) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const openNotification = (
    type: NotificationInstance,
    title: string,
    description: string,
    opts?: NotificationContextMetaType
  ) => {
    if (type === "open" && opts) {
      const key = `open${Date.now()}`;
      const btn = (
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          {opts?.btnText}
        </Button>
      );

      api[type]({
        message: title,
        placement: "topRight",
        btn,
        key,
        duration: 0,
        style: { whiteSpace: "pre-line" },
        onClick: opts.onClose,
        description: description,
      });
      return;
    }

    api[type]({
      duration: opts?.duration || 4,
      message: title,
      placement: "topRight",
      description: description,
    });
  };

  const createMessageMethod = (type: MessageInstance) => {
    return (content: string, opts?: MessageContextMetaType) => {
      messageApi[type]({
        content,
        duration: opts?.duration ?? 3,
        key: opts?.key,
        onClose: opts?.onClose,
      });
    };
  };

  const messageHandler = {
    open: createMessageMethod("open"),
    info: createMessageMethod("info"),
    success: createMessageMethod("success"),
    warning: createMessageMethod("warning"),
    error: createMessageMethod("error"),
    loading: createMessageMethod("loading"),
  };

  const confirm = (options: ConfirmOptions) => {
    const {
      title,
      message: content,
      onConfirm,
      onCancel,
      confirmText = "Yes",
      cancelText = "Cancel",
      type = "warning",
    } = options;

    const key = `confirm${Date.now()}`;

    const handleConfirm = () => {
      api.destroy(key);
      onConfirm();
    };

    const handleCancel = () => {
      api.destroy(key);
      onCancel?.();
    };

    const btn = (
      <div style={{ display: "flex", gap: "8px" }}>
        <Button size="small" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button
          type="primary"
          size="small"
          danger={type === "error"}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    );

    api[type]({
      message: title,
      description: content,
      placement: "topRight",
      btn,
      key,
      duration: 0,
      style: { whiteSpace: "pre-line" },
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        openNotification,
        message: messageHandler,
        confirm,
      }}
    >
      {contextHolder}
      {messageContextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, useNotification };
