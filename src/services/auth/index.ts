import axios from "@configs/axios";
import { ICurrentUser, ISignupForm } from "@interfaces/auth.interface";

class AuthService {
  private baseUrl;
  private axiosConfig = {};

  constructor() {
    this.baseUrl = `/api/v1/auth`;
  }

  signup = async (data: ISignupForm) => {
    try {
      const res = await axios.post(
        `${this.baseUrl}/signup`,
        data,
        this.axiosConfig
      );
      return res;
    } catch (error) {
      throw error;
    }
  };
  login = async (data: {
    email: string;
    password: string;
    otpCode?: string;
    rememberMe: boolean;
  }) => {
    try {
      const res = await axios.post<{
        accounts: Array<{ csub: string; displayName: string }>;
        activeAccount: { csub: string; displayName: string };
        msg: string;
      }>(`${this.baseUrl}/login`, data);

      return res;
    } catch (error) {
      throw error;
    }
  };
  currentuser = async (csub: string) => {
    try {
      if (!csub) return;
      const res = await axios.get<{ success: boolean; data: ICurrentUser }>(
        `${this.baseUrl}/${csub}/me`
      );

      return res;
    } catch (error) {
      throw error;
    }
  };
  logout = async (csub: string | undefined) => {
    try {
      if (!csub) return;
      const res = await axios.delete(`${this.baseUrl}/${csub}/logout`);
      return res;
    } catch (error) {
      throw error;
    }
  };
  accountActivation = async (csub: string, data: { token: string }) => {
    try {
      const res = await axios.put(
        `${this.baseUrl}/account_activation/${csub}?t=${data.token}`
      );
      return res;
    } catch (error) {
      throw error;
    }
  };
  resendActivationLink = async (email: string) => {
    try {
      const res = await axios.put(`${this.baseUrl}/resend_activation_link`, {
        email,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };
  forgotPassword = async (email: string) => {
    try {
      const res = await axios.put(`${this.baseUrl}/forgot_password`, {
        email,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };
  resetPassword = async (token: string, password: string) => {
    try {
      const res = await axios.put(`${this.baseUrl}/reset_password`, {
        resetToken: token,
        password,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };
  refreshToken = async () => {
    try {
      const res = await axios.get(`${this.baseUrl}/refresh_token`);
      return res;
    } catch (error) {
      throw error;
    }
  };
}

export const authService = new AuthService();
