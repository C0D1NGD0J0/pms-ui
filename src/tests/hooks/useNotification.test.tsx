import React from "react";
import { render, screen } from "@testing-library/react";
import { NotificationProvider, useNotification } from "@hooks/useNotification";

const mockNotificationApi = {
  open: jest.fn(),
  info: jest.fn(),
  success: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  destroy: jest.fn(),
};

const mockMessageApi = {
  open: jest.fn(),
  info: jest.fn(),
  success: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
};

jest.mock("antd", () => ({
  notification: {
    useNotification: () => [
      mockNotificationApi,
      <div key="notification-holder">Notification Holder</div>,
    ],
  },
  message: {
    useMessage: () => [
      mockMessageApi,
      <div key="message-holder">Message Holder</div>,
    ],
  },
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const renderWithProvider = (children: React.ReactNode) => {
  return render(<NotificationProvider>{children}</NotificationProvider>);
};

describe("useNotification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error when used outside provider", () => {
    const TestComponent = () => {
      useNotification();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "useNotification must be used within a NotificationProvider"
    );
  });

  it("should provide notification context when used within provider", () => {
    const TestComponent = () => {
      const notification = useNotification();
      return (
        <div>
          <span data-testid="has-open">{typeof notification.openNotification}</span>
          <span data-testid="has-message">{typeof notification.message}</span>
          <span data-testid="has-confirm">{typeof notification.confirm}</span>
        </div>
      );
    };

    renderWithProvider(<TestComponent />);

    expect(screen.getByTestId("has-open")).toHaveTextContent("function");
    expect(screen.getByTestId("has-message")).toHaveTextContent("object");
    expect(screen.getByTestId("has-confirm")).toHaveTextContent("function");
  });

  it("should call notification API with correct parameters", () => {
    let notificationContext: any;
    const TestComponent = () => {
      notificationContext = useNotification();
      return <div>Test</div>;
    };

    renderWithProvider(<TestComponent />);

    notificationContext.openNotification("info", "Test Title", "Test Description");

    expect(mockNotificationApi.info).toHaveBeenCalledWith({
      duration: 4,
      message: "Test Title",
      placement: "topRight",
      description: "Test Description",
    });
  });

  it("should handle custom options for notifications", () => {
    let notificationContext: any;
    const TestComponent = () => {
      notificationContext = useNotification();
      return <div>Test</div>;
    };

    renderWithProvider(<TestComponent />);

    notificationContext.openNotification("success", "Title", "Description", {
      duration: 10,
    });

    expect(mockNotificationApi.success).toHaveBeenCalledWith({
      duration: 10,
      message: "Title",
      placement: "topRight",
      description: "Description",
    });
  });

  it("should handle open type notifications with actions", () => {
    let notificationContext: any;
    const TestComponent = () => {
      notificationContext = useNotification();
      return <div>Test</div>;
    };

    renderWithProvider(<TestComponent />);

    const mockOnClose = jest.fn();

    notificationContext.openNotification("open", "Title", "Description", {
      btnText: "Close",
      onClose: mockOnClose,
    });

    expect(mockNotificationApi.open).toHaveBeenCalledWith({
      message: "Title",
      placement: "topRight",
      actions: expect.any(Array),
      key: expect.stringContaining("open"),
      duration: 0,
      style: { whiteSpace: "pre-line" },
      onClick: mockOnClose,
      description: "Description",
    });
  });

  it("should provide message methods", () => {
    let notificationContext: any;
    const TestComponent = () => {
      notificationContext = useNotification();
      return <div>Test</div>;
    };

    renderWithProvider(<TestComponent />);


    notificationContext.message.info("Info message");
    notificationContext.message.success("Success message");
    notificationContext.message.warning("Warning message");
    notificationContext.message.error("Error message");
    notificationContext.message.loading("Loading message");

    expect(mockMessageApi.info).toHaveBeenCalledWith({
      content: "Info message",
      duration: 3,
      key: undefined,
      onClose: undefined,
    });
    expect(mockMessageApi.success).toHaveBeenCalledWith({
      content: "Success message",
      duration: 3,
      key: undefined,
      onClose: undefined,
    });
  });

  it("should handle message options", () => {
    let notificationContext: any;
    const TestComponent = () => {
      notificationContext = useNotification();
      return <div>Test</div>;
    };

    renderWithProvider(<TestComponent />);

    const mockOnClose = jest.fn();

    notificationContext.message.info("Test", {
      duration: 5,
      key: "test-key",
      onClose: mockOnClose,
    });

    expect(mockMessageApi.info).toHaveBeenCalledWith({
      content: "Test",
      duration: 5,
      key: "test-key",
      onClose: mockOnClose,
    });
  });

  it("should handle confirm dialogs", () => {
    let notificationContext: any;
    const TestComponent = () => {
      notificationContext = useNotification();
      return <div>Test</div>;
    };

    renderWithProvider(<TestComponent />);

    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    notificationContext.confirm({
      title: "Confirm Action",
      message: "Are you sure?",
      onConfirm: mockOnConfirm,
      onCancel: mockOnCancel,
      confirmText: "Yes",
      cancelText: "No",
      type: "error",
    });

    expect(mockApi.error).toHaveBeenCalledWith({
      message: "Confirm Action",
      description: "Are you sure?",
      placement: "topRight",
      actions: expect.any(Array),
      key: expect.stringContaining("confirm"),
      duration: 0,
      style: { whiteSpace: "pre-line" },
    });
  });

  it("should handle confirm with default values", () => {
    let notificationContext: any;
    const TestComponent = () => {
      notificationContext = useNotification();
      return <div>Test</div>;
    };

    renderWithProvider(<TestComponent />);

    const mockOnConfirm = jest.fn();

    notificationContext.confirm({
      title: "Test",
      message: "Test message",
      onConfirm: mockOnConfirm,
    });

    expect(mockApi.warning).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Test",
        description: "Test message",
      })
    );
  });

  it("should render notification and message holders", () => {
    renderWithProvider(<div>Test Content</div>);

    expect(screen.getByText("Notification Holder")).toBeInTheDocument();
    expect(screen.getByText("Message Holder")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});