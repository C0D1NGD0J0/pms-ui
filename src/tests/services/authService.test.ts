import axios from "@configs/axios";
import { authService } from "@services/auth";

jest.mock("@configs/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should successfully login with single account", async () => {
      const loginData = {
        email: "single@example.com",
        password: "password123",
        rememberMe: false,
      };

      const mockResponse = {
        status: 200,
        data: {
          success: true,
          msg: "Login successful",
          accounts: [
            {
              cuid: "client-123",
              clientDisplayName: "Test Company",
            },
          ],
          activeAccount: {
            cuid: "client-123",
            clientDisplayName: "Test Company",
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await authService.login(loginData);

      expect(mockedAxios.post).toHaveBeenCalledWith("/api/v1/auth/login", loginData);
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.accounts).toHaveLength(1);
      expect(response.data.activeAccount).toEqual({
        cuid: "client-123",
        clientDisplayName: "Test Company",
      });
    });

    it("should return multiple accounts when user has multiple accounts", async () => {
      const loginData = {
        email: "multi@example.com",
        password: "password123",
        rememberMe: false,
      };

      const mockResponse = {
        status: 200,
        data: {
          success: true,
          msg: "Multiple accounts found",
          accounts: [
            { cuid: "client-123", clientDisplayName: "Company A" },
            { cuid: "client-456", clientDisplayName: "Company B" },
            { cuid: "client-789", clientDisplayName: "Company C" },
          ],
          activeAccount: null,
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await authService.login(loginData);

      expect(response.data.accounts).toHaveLength(3);
      expect(response.data.activeAccount).toBeNull();
    });

    it("should throw error for invalid credentials", async () => {
      const loginData = {
        email: "wrong@example.com",
        password: "wrongpassword",
        rememberMe: false,
      };

      mockedAxios.post.mockRejectedValue(new Error("Invalid credentials"));

      await expect(authService.login(loginData)).rejects.toThrow();
    });
  });

  describe("currentuser", () => {
    it("should fetch current user data for valid cuid", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          data: {
            user: {
              uid: "user-123",
              email: "single@example.com",
              firstName: "Test",
              lastName: "User",
              role: "admin",
            },
            client: {
              cuid: "client-123",
              companyName: "Test Company",
            },
            permissions: ["read:users", "create:properties"],
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const response = await authService.currentuser("client-123");

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/v1/auth/client-123/me");
      expect(response?.status).toBe(200);
      expect(response?.data.data.user).toMatchObject({
        uid: "user-123",
        email: "single@example.com",
        role: "admin",
      });
    });

    it("should fetch different user data when switching accounts", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          data: {
            user: {
              uid: "user-456",
              email: "multi@example.com",
              firstName: "Multi",
              lastName: "Account",
              role: "manager",
            },
            client: {
              cuid: "client-456",
              companyName: "Company B",
            },
            permissions: ["read:users"],
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const response = await authService.currentuser("client-456");

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/v1/auth/client-456/me");
      expect(response?.data.data.user.role).toBe("manager");
      expect(response?.data.data.client.companyName).toBe("Company B");
    });

    it("should return undefined for missing cuid", async () => {
      const response = await authService.currentuser("");

      expect(response).toBeUndefined();
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should successfully logout with valid cuid", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "Logged out successfully",
        },
      };

      mockedAxios.delete.mockResolvedValue(mockResponse);

      const response = await authService.logout("client-123");

      expect(mockedAxios.delete).toHaveBeenCalledWith("/api/v1/auth/client-123/logout");
      expect(response?.status).toBe(200);
      expect(response?.data.message).toBe("Logged out successfully");
    });

    it("should return undefined for missing cuid", async () => {
      const response = await authService.logout(undefined);

      expect(response).toBeUndefined();
      expect(mockedAxios.delete).not.toHaveBeenCalled();
    });
  });

  describe("refreshToken", () => {
    it("should successfully refresh token", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "Token refreshed",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await authService.refreshToken();

      expect(mockedAxios.post).toHaveBeenCalledWith("/api/v1/auth/refresh_token");
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
    });
  });
});
