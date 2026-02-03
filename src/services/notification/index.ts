import axios from "@configs/axios";
import { NotificationFilters } from "@interfaces/notification.interface";

export class NotificationService {
  private readonly backendBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private readonly baseURL = `${this.backendBaseURL}/api/v1/notifications`;

  async markAsRead(cuid: string, nuid: string) {
    try {
      const response = await axios.patch(
        `${this.baseURL}/${cuid}/mark-read/${nuid}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  createPersonalNotificationsStream(
    cuid: string,
    filters?: NotificationFilters
  ): EventSource {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${
      this.baseURL
    }/${cuid}/my-notifications/stream?${params.toString()}`;

    return new EventSource(url, {
      withCredentials: true,
    });
  }

  createAnnouncementsStream(
    cuid: string,
    filters?: NotificationFilters
  ): EventSource {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${
      this.baseURL
    }/${cuid}/announcements/stream?${params.toString()}`;

    return new EventSource(url, {
      withCredentials: true,
    });
  }
}

export const notificationService = new NotificationService();
