import APIError from "@utils/errorHandler";
import CookieManager from "@utils/cookieManager";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
  AxiosError,
} from "axios";

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
      timeout: 30000,
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
          console.log("Refresh token expired", error);
          return Promise.reject(new APIError().init(error));
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
                  return response;
                })
                .catch((refreshError) => {
                  // If refresh fails, log user out
                  if (refreshError.response?.status === 401) {
                    // redirect to login page here
                  }
                  console.log("Refresh token expired", error);
                  return Promise.reject(refreshError);
                });
              // .finally(() => {
              //   this.refreshTokenPromise = null;
              // });
            }

            try {
              await this.refreshTokenPromise;
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
          // redirect to login page here
          console.log("Refresh token expired", error);
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
