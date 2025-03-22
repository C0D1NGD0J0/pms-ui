import axios from "@configs/axios";

class AuthService {
  private baseUrl;
  private axiosConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  constructor() {
    this.baseUrl = `${process.env.REACT_APP_API_URL}/auth`;
  }

  signup = async (data: FormData) => {
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
  login = async (data: { email: string; password: string }) => {
    try {
      const res = await axios.post(`${this.baseUrl}/login`, data);
      return res;
    } catch (error) {
      throw error;
    }
  };
  logout = async (cid: string | undefined) => {
    try {
      if (!cid) return;
      const res = await axios.delete(`${this.baseUrl}/${cid}/logout`);
      return res;
    } catch (error) {
      throw error;
    }
  };
  accountActivation = async (cid: string, data: any) => {
    try {
      const res = await axios.post(
        `${this.baseUrl}/account_activation/${cid}`,
        data
      );
      return res;
    } catch (error) {
      throw error;
    }
  };
  resendActivationLink = async (cid: string, token: string) => {
    try {
      const res = await axios.post(`${this.baseUrl}/resend_activation_link`, {
        token,
        cid,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };
  forgotPassword = async (email: string) => {
    try {
      const res = await axios.post(`${this.baseUrl}/forgot_password`, {
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

const authService = new AuthService();
export default authService;
