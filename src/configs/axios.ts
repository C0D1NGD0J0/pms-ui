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
  private refreshTokenPromise: Promise<any> | null = null;

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
        const token = CookieManager.getCookie("cid");
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

        if (!originalRequest) {
          console.error(
            "No original request found during error handling:",
            error
          );
          return Promise.reject(new APIError().init(error));
        }
        console.error("Axios error occurred:", error);
        if (
          (error.response?.status === 401 || error.response?.status === 419) &&
          !originalRequest._retry
        ) {
          if (originalRequest.url !== "/api/v1/auth/refresh_token") {
            originalRequest._retry = true;

            if (!this.refreshTokenPromise) {
              console.log("Token expired, attempting refresh...");

              this.refreshTokenPromise = this.axios
                .post("/api/v1/auth/refresh_token")
                .then((response) => {
                  console.log("Token refresh successful");
                  triggerUserRefresh();
                  return response;
                })
                .catch((refreshError) => {
                  console.error("Token refresh failed:", refreshError);

                  // If refresh fails due to invalid refresh token, handle auth failure
                  if (
                    refreshError.statusCode === 401 ||
                    refreshError.statusCode === 403
                  ) {
                    console.log("Refresh token expired, logging out user");
                    handleAuthFailure();
                  }

                  return Promise.reject(refreshError);
                })
                .finally(() => {
                  // Clear the promise after completion
                  this.refreshTokenPromise = null;
                });
            }

            try {
              await this.refreshTokenPromise;
              console.log("Retrying original request after token refresh");
              console.log("Original request config:", {
                url: originalRequest.url,
                method: originalRequest.method,
                baseURL: originalRequest.baseURL,
              });

              const retryConfig = {
                ...originalRequest,
                _retry: true,
              };

              return this.axios(retryConfig);
            } catch (refreshError) {
              console.error(
                "Failed to retry request after token refresh:",
                refreshError
              );
              return Promise.reject(
                new APIError().init(refreshError as AxiosError)
              );
            }
          }
        } else if (
          originalRequest.url === "/api/v1/auth/refresh_token" &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          console.log(
            "Refresh token endpoint returned auth error, logging out user",
            error
          );
          handleAuthFailure();
        }

        // Handle and standardize other errors
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
