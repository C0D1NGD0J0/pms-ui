import { renderHook, act } from "@testing-library/react";
import { NotificationProvider, useNotification } from "@hooks/useNotification";

// Create mock API functions
const mockNotificationApi = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
  open: jest.fn(),
  destroy: jest.fn(),
};

const mockMessageApi = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
  loading: jest.fn(),
  open: jest.fn(),
};

jest.mock("antd", () => ({
  notification: {
    useNotification: () => [mockNotificationApi, <div key="notification-holder" data-testid="notification-holder" />],
  },
  message: {
    useMessage: () => [mockMessageApi, <div key="message-holder" data-testid="message-holder" />],
  },
  Button: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("useNotification", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NotificationProvider>{children}</NotificationProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error when used outside NotificationProvider", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      renderHook(() => useNotification());
    }).toThrow("useNotification must be used within a NotificationProvider");

    consoleSpy.mockRestore();
  });

  describe("openNotification", () => {
    it("should open info notification", () => {
      const { result } = renderHook(() => useNotification(), { wrapper });

      act(() => {
        result.current.openNotification(
          "info",
          "Test Title",
          "Test Description"
        );
      });

      expect(mockNotificationApi.info).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 4,
          placement: "topRight",
          style: expect.objectContaining({
            whiteSpace: "pre-line",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }),
        })
      );
    });

    it("should open notification with custom duration", () => {
      const { result } = renderHook(() => useNotification(), { wrapper });

      act(() => {
        result.current.openNotification(
          "success",
          "Success",
          "Operation successful",
          { duration: 10 }
        );
      });

      expect(mockNotificationApi.success).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 10,
          placement: "topRight",
          style: expect.objectContaining({
            whiteSpace: "pre-line",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }),
        })
      );
    });

    it("should open notification with custom button for 'open' type", () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      const onClose = jest.fn();

      act(() => {
        result.current.openNotification("open", "Alert", "Custom alert", {
          btnText: "Got it",
          onClose,
        });
      });

      expect(mockNotificationApi.open).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: "topRight",
          duration: 0,
          onClick: onClose,
          style: expect.objectContaining({
            whiteSpace: "pre-line",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }),
        })
      );
    });
  });

  describe("message", () => {
    it("should display info message", () => {
      const { result } = renderHook(() => useNotification(), { wrapper });

      act(() => {
        result.current.message.info("Info message");
      });

      expect(mockMessageApi.info).toHaveBeenCalledWith({
        content: "Info message",
        duration: 3,
        key: undefined,
        onClose: undefined,
      });
    });

    it("should display success message with custom duration", () => {
      const { result } = renderHook(() => useNotification(), { wrapper });

      act(() => {
        result.current.message.success("Success!", { duration: 5 });
      });

      expect(mockMessageApi.success).toHaveBeenCalledWith({
        content: "Success!",
        duration: 5,
        key: undefined,
        onClose: undefined,
      });
    });

    it("should display error message", () => {
      const { result } = renderHook(() => useNotification(), { wrapper });

      act(() => {
        result.current.message.error("Error occurred");
      });

      expect(mockMessageApi.error).toHaveBeenCalled();
    });

    it("should display loading message", () => {
      const { result } = renderHook(() => useNotification(), { wrapper });

      act(() => {
        result.current.message.loading("Loading...");
      });

      expect(mockMessageApi.loading).toHaveBeenCalled();
    });
  });

  describe("confirm", () => {
    it("should display confirm modal with default type", () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      const onConfirm = jest.fn();

      act(() => {
        result.current.confirm({
          title: "Confirm Action",
          message: "Are you sure?",
          onConfirm,
        });
      });

      expect(mockNotificationApi.warning).toHaveBeenCalledWith(
        expect.objectContaining({
          placement: "topRight",
          duration: 0,
          style: expect.objectContaining({
            whiteSpace: "pre-line",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }),
        })
      );
    });

    it("should display error type confirm modal", () => {
      const { result } = renderHook(() => useNotification(), { wrapper });
      const onConfirm = jest.fn();

      act(() => {
        result.current.confirm({
          title: "Delete Item",
          message: "This cannot be undone",
          onConfirm,
          type: "error",
        });
      });

      expect(mockNotificationApi.error).toHaveBeenCalled();
    });
  });
});
