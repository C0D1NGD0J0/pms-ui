import APIError from "@utils/errorHandler";
import CookieManager from "@utils/cookieManager";
import { EventTypes, events } from "@services/events";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
  AxiosError,
} from "axios";

const handleAuthFailure = () => {
  sessionStorage.removeItem("auth-storage");
  events.publish(EventTypes.AUTH_FAILURE, { reason: "token_refresh_failed" });
  if (typeof window !== "undefined") {
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  }
};

const triggerUserRefresh = () => {
  events.publish(EventTypes.TOKEN_REFRESHED, {
    timestamp: new Date().toISOString(),
  });
};

interface IAxiosService {
  axios: AxiosInstance;
  get<T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T>;
  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T>;
  delete<T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T>;
  getInstance(): AxiosInstance;
}

class AxiosService implements IAxiosService {
  public axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 45000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axios.interceptors.request.use(
      (config) => {
        const token = CookieManager.getCookie("cuid");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Check for token expired specifically by message
        if (
          error.response?.status === 401 &&
          (error.response?.data as any)?.message?.includes("token expired") &&
          !originalRequest?._retry &&
          originalRequest?.url !== "/api/v1/auth/refresh_token"
        ) {
          originalRequest._retry = true;

          try {
            // Use existing refresh logic instead of reimplementing
            await this.axios.post("/api/v1/auth/refresh_token");
            triggerUserRefresh();
            return this.axios(originalRequest);
          } catch (refreshError) {
            // Let existing event system handle auth failure
            handleAuthFailure();
            return Promise.reject(
              new APIError().init(refreshError as AxiosError)
            );
          }
        }

        // Handle refresh token endpoint auth errors
        if (
          originalRequest?.url === "/api/v1/auth/refresh_token" &&
          error.response?.status === 401
        ) {
          handleAuthFailure();
        }

        return Promise.reject(new APIError().init(error));
      }
    );
  }

  async get<T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axios.get(url, {
        ...config,
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axios.post(url, data, config);
      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axios.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axios.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T = any>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axios.delete(url, {
        ...config,
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  getInstance(): AxiosInstance {
    return this.axios;
  }
}

const axiosService = new AxiosService();
export default axiosService;
