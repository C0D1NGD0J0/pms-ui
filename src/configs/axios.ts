import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import CookieManager from "@utils/cookieManager";

interface IAxiosService {
  axios: AxiosInstance;
  get<T = unknown>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T>;
  post<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T>;
  delete<T = unknown>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T>;
  getInstance(): AxiosInstance;
}

class AxiosService implements IAxiosService {
  public axios: AxiosInstance;
  private refreshTokenPromise: Promise<unknown> | null = null;

  constructor() {
    this.axios = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axios.interceptors.request.use(
      (config) => {
        // Get auth token from cookies if it exists
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

    // Response interceptor
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        // You could format response data here if needed
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (!originalRequest) {
          // return Promise.reject(new APIError().init(error));
        }

        if (error.response?.status === 419 && !originalRequest._retry) {
          if (originalRequest.url !== "/api/v1/auth/refresh_token") {
            originalRequest._retry = true;

            // Ensure we only have one refresh token call at a time
            if (!this.refreshTokenPromise) {
              this.refreshTokenPromise = this.axios
                .post("/api/v1/auth/refresh_token")
                .then((response) => {
                  // Handle successful token refresh
                  const newToken = response.data.token;
                  if (newToken) {
                    CookieManager.setCookie("cid", newToken);
                  }
                  return response;
                })
                .catch((refreshError) => {
                  // If refresh fails, log user out
                  if (refreshError.response?.status === 401) {
                    CookieManager.removeCookie("cid");
                    // You might want to redirect to login page here
                  }
                  return Promise.reject(refreshError);
                })
                .finally(() => {
                  this.refreshTokenPromise = null;
                });
            }

            try {
              await this.refreshTokenPromise;
              // Retry the original request with the new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${CookieManager.getCookie(
                  "cid"
                )}`;
              }
              return this.axios(originalRequest);
            } catch (error) {
              return Promise.reject(error);
            }
          }
        } else if (
          originalRequest.url === "/api/v1/auth/refresh_token" &&
          error.response?.status === 401
        ) {
          // Refresh token is invalid, log user out
          CookieManager.removeCookie("cid");
          // You might want to redirect to login page here
        }

        // Handle and standardize other errors
        // const apiError = new APIError().init(error);
        // return Promise.reject(apiError);
      }
    );
  }

  async get<T = unknown>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axios.get<T>(url, { ...config, params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axios.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T = unknown>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axios.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T = unknown>(
    url: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axios.delete<T>(url, { ...config, params });
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
