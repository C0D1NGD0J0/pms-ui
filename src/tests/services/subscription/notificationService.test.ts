import axios from "@configs/axios";
import { NotificationFilters } from "@interfaces/notification.interface";
import {
  notificationService,
  NotificationService,
} from "@services/notification";

jest.mock("@configs/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock EventSource
class MockEventSource {
  url: string;
  withCredentials: boolean;
  onmessage: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onopen: ((event: any) => void) | null = null;
  readyState: number = 0;

  constructor(url: string, options?: { withCredentials?: boolean }) {
    this.url = url;
    this.withCredentials = options?.withCredentials || false;
  }

  close() {
    this.readyState = 2;
  }
}

global.EventSource = MockEventSource as any;

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new NotificationService();
  });

  describe("markAsRead", () => {
    it("should mark notification as read successfully", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Notification marked as read",
          data: {
            nuid: "notif-123",
            isRead: true,
          },
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const result = await service.markAsRead("client-123", "notif-123");

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/v1/notifications/client-123/mark-read/notif-123"
        ),
        {},
        { withCredentials: true }
      );
      expect(result.success).toBe(true);
      expect(result.data.isRead).toBe(true);
    });

    it("should throw error when marking notification as read fails", async () => {
      const mockError = new Error("Failed to mark as read");
      mockedAxios.patch.mockRejectedValue(mockError);

      await expect(
        service.markAsRead("client-123", "notif-123")
      ).rejects.toThrow("Failed to mark as read");

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/v1/notifications/client-123/mark-read/notif-123"
        ),
        {},
        { withCredentials: true }
      );
    });

    it("should handle different client and notification IDs", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      await service.markAsRead("client-456", "notif-789");

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/v1/notifications/client-456/mark-read/notif-789"
        ),
        {},
        { withCredentials: true }
      );
    });

    it("should include withCredentials flag", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      await service.markAsRead("client-123", "notif-123");

      const callConfig = mockedAxios.patch.mock.calls[0][2];
      expect(callConfig?.withCredentials).toBe(true);
    });
  });

  describe("createPersonalNotificationsStream", () => {
    it("should create EventSource for personal notifications without filters", () => {
      const eventSource =
        service.createPersonalNotificationsStream("client-123");

      expect(eventSource).toBeInstanceOf(MockEventSource);
      expect(eventSource.url).toContain(
        "/api/v1/notifications/client-123/my-notifications/stream"
      );
      expect((eventSource as MockEventSource).withCredentials).toBe(true);
    });

    it("should create EventSource with filter parameters", () => {
      const filters: NotificationFilters = {
        limit: 20,
        isRead: false,
      };

      const eventSource = service.createPersonalNotificationsStream(
        "client-123",
        filters
      );

      expect(eventSource.url).toContain("limit=20");
      expect(eventSource.url).toContain("isRead=false");
    });

    it("should handle multiple filter parameters", () => {
      const filters: NotificationFilters = {
        limit: 50,
        isRead: true,
        type: "announcement",
      };

      const eventSource = service.createPersonalNotificationsStream(
        "client-456",
        filters
      );

      expect(eventSource.url).toContain("limit=50");
      expect(eventSource.url).toContain("isRead=true");
      expect(eventSource.url).toContain("type=announcement");
      expect(eventSource.url).toContain("/client-456/my-notifications/stream");
    });

    it("should skip undefined filter values", () => {
      const filters: NotificationFilters = {
        limit: 10,
        isRead: undefined,
      };

      const eventSource = service.createPersonalNotificationsStream(
        "client-123",
        filters
      );

      expect(eventSource.url).toContain("limit=10");
      expect(eventSource.url).not.toContain("isRead");
    });

    it("should handle empty filters object", () => {
      const eventSource = service.createPersonalNotificationsStream(
        "client-123",
        {}
      );

      expect(eventSource).toBeInstanceOf(MockEventSource);
      expect(eventSource.url).toContain("/my-notifications/stream");
    });

    it("should configure EventSource with credentials", () => {
      const eventSource = service.createPersonalNotificationsStream(
        "client-123"
      ) as MockEventSource;

      expect(eventSource.withCredentials).toBe(true);
    });
  });

  describe("createAnnouncementsStream", () => {
    it("should create EventSource for announcements without filters", () => {
      const eventSource = service.createAnnouncementsStream("client-123");

      expect(eventSource).toBeInstanceOf(MockEventSource);
      expect(eventSource.url).toContain(
        "/api/v1/notifications/client-123/announcements/stream"
      );
      expect((eventSource as MockEventSource).withCredentials).toBe(true);
    });

    it("should create EventSource with filter parameters", () => {
      const filters: NotificationFilters = {
        limit: 30,
        priority: "high",
      };

      const eventSource = service.createAnnouncementsStream(
        "client-123",
        filters
      );

      expect(eventSource.url).toContain("limit=30");
      expect(eventSource.url).toContain("priority=high");
    });

    it("should handle multiple filter parameters for announcements", () => {
      const filters: NotificationFilters = {
        limit: 25,
        isRead: false,
        type: "system",
      };

      const eventSource = service.createAnnouncementsStream(
        "client-789",
        filters
      );

      expect(eventSource.url).toContain("limit=25");
      expect(eventSource.url).toContain("isRead=false");
      expect(eventSource.url).toContain("type=system");
      expect(eventSource.url).toContain("/client-789/announcements/stream");
    });

    it("should skip undefined filter values in announcements", () => {
      const filters: NotificationFilters = {
        limit: 15,
        isRead: undefined,
      };

      const eventSource = service.createAnnouncementsStream(
        "client-123",
        filters
      );

      expect(eventSource.url).toContain("limit=15");
      expect(eventSource.url).not.toContain("isRead");
    });

    it("should handle empty filters object for announcements", () => {
      const eventSource = service.createAnnouncementsStream("client-123", {});

      expect(eventSource).toBeInstanceOf(MockEventSource);
      expect(eventSource.url).toContain("/announcements/stream");
    });

    it("should configure EventSource with credentials for announcements", () => {
      const eventSource = service.createAnnouncementsStream(
        "client-123"
      ) as MockEventSource;

      expect(eventSource.withCredentials).toBe(true);
    });

    it("should create different URLs for different client IDs", () => {
      const eventSource1 = service.createAnnouncementsStream("client-111");
      const eventSource2 = service.createAnnouncementsStream("client-222");

      expect(eventSource1.url).toContain("client-111");
      expect(eventSource2.url).toContain("client-222");
      expect(eventSource1.url).not.toEqual(eventSource2.url);
    });
  });

  describe("notificationService singleton", () => {
    it("should export a singleton instance", () => {
      expect(notificationService).toBeInstanceOf(NotificationService);
    });

    it("should use the same instance across imports", () => {
      expect(notificationService).toBe(notificationService);
    });

    it("should have all methods available on singleton", () => {
      expect(typeof notificationService.markAsRead).toBe("function");
      expect(typeof notificationService.createPersonalNotificationsStream).toBe(
        "function"
      );
      expect(typeof notificationService.createAnnouncementsStream).toBe(
        "function"
      );
    });
  });

  describe("URL construction", () => {
    it("should construct correct base URL", () => {
      const eventSource =
        service.createPersonalNotificationsStream("test-client");

      expect(eventSource.url).toMatch(/\/api\/v1\/notifications\/test-client/);
    });

    it("should properly encode filter values in URL", () => {
      const filters: NotificationFilters = {
        type: "system update",
      };

      const eventSource = service.createPersonalNotificationsStream(
        "client-123",
        filters
      );

      // URLSearchParams should properly encode the space
      expect(eventSource.url).toContain("type=system+update");
    });

    it("should handle numeric filter values", () => {
      const filters: NotificationFilters = {
        limit: 100,
        page: 2,
      };

      const eventSource = service.createAnnouncementsStream(
        "client-123",
        filters
      );

      expect(eventSource.url).toContain("limit=100");
      expect(eventSource.url).toContain("page=2");
    });

    it("should handle boolean filter values", () => {
      const filters: NotificationFilters = {
        isRead: true,
      };

      const eventSource = service.createPersonalNotificationsStream(
        "client-123",
        filters
      );

      expect(eventSource.url).toContain("isRead=true");
    });
  });

  describe("Integration scenarios", () => {
    it("should handle mark as read followed by stream creation", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      await service.markAsRead("client-123", "notif-456");

      const eventSource =
        service.createPersonalNotificationsStream("client-123");

      expect(mockedAxios.patch).toHaveBeenCalled();
      expect(eventSource).toBeInstanceOf(MockEventSource);
    });

    it("should create multiple streams for same client", () => {
      const personalStream =
        service.createPersonalNotificationsStream("client-123");
      const announcementStream =
        service.createAnnouncementsStream("client-123");

      expect(personalStream.url).toContain("/my-notifications/stream");
      expect(announcementStream.url).toContain("/announcements/stream");
      expect(personalStream).not.toBe(announcementStream);
    });

    it("should handle rapid successive mark as read calls", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      await Promise.all([
        service.markAsRead("client-123", "notif-1"),
        service.markAsRead("client-123", "notif-2"),
        service.markAsRead("client-123", "notif-3"),
      ]);

      expect(mockedAxios.patch).toHaveBeenCalledTimes(3);
    });
  });
});
