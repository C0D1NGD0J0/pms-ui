import APIError from "@utils/errorHandler";
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

        // Check for 401 errors that aren't already retried
        if (
          error.response?.status === 401 &&
          !originalRequest?._retry &&
          originalRequest?.url !== "/api/v1/auth/refresh_token"
        ) {
          originalRequest._retry = true;

          try {
            await this.axios.post("/api/v1/auth/refresh_token");
            triggerUserRefresh();

            // Retry original request - new cookies will be used automatically
            return this.axios(originalRequest);
          } catch (refreshError) {
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
          console.log("Refresh token expired, logging out");
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
