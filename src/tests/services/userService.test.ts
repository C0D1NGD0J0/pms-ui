import axios from "@configs/axios";
import { userService } from "@services/users";
import { IFilteredUsersParams } from "@services/users";

jest.mock("@configs/axios");
jest.mock("@utils/formDataTransformer", () => ({
  prepareRequestData: jest.fn((data) => ({
    data,
    headers: { "Content-Type": "application/json" },
  })),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UserService", () => {
  const mockCuid = "client-123";
  const mockUid = "user-456";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getUserEmployeeDetails", () => {
    it("should fetch user employee details successfully", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            uid: mockUid,
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            role: "staff",
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await userService.getUserEmployeeDetails(
        mockCuid,
        mockUid
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/user_details/${mockUid}`,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error when fetching user details fails", async () => {
      const mockError = new Error("Network error");
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        userService.getUserEmployeeDetails(mockCuid, mockUid)
      ).rejects.toThrow("Network error");
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching user details:",
        mockError
      );
    });
  });

  describe("getFilteredUsers", () => {
    it("should fetch filtered users with no params", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await userService.getFilteredUsers(mockCuid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/filtered-users`,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch filtered users with single role", async () => {
      const params: IFilteredUsersParams = {
        role: "admin",
        status: "active",
      };

      const mockResponse = {
        data: {
          success: true,
          data: [{ uid: "user-1", role: "admin" }],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await userService.getFilteredUsers(mockCuid, params);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/filtered-users?role=admin&status=active`,
        {}
      );
    });

    it("should fetch filtered users with multiple roles", async () => {
      const params: IFilteredUsersParams = {
        role: ["admin", "manager", "staff"],
        search: "john",
      };

      const mockResponse = {
        data: {
          success: true,
          data: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await userService.getFilteredUsers(mockCuid, params);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/filtered-users?role=admin%2Cmanager%2Cstaff&search=john`,
        {}
      );
    });

    it("should fetch filtered users with all query params", async () => {
      const params: IFilteredUsersParams = {
        role: "staff",
        department: "maintenance",
        status: "active",
        search: "test",
        page: 2,
        limit: 20,
        sortBy: "firstName",
        sort: "asc",
      };

      const mockResponse = {
        data: {
          success: true,
          data: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await userService.getFilteredUsers(mockCuid, params);

      const expectedUrl =
        `/api/v1/users/${mockCuid}/filtered-users?role=staff&department=maintenance&status=active&search=test&page=2&limit=20&sortBy=firstName&sort=asc`;
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl, {});
    });

    it("should throw error when fetching filtered users fails", async () => {
      const mockError = new Error("API error");
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        userService.getFilteredUsers(mockCuid, { role: "admin" })
      ).rejects.toThrow("API error");
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching filtered users:",
        mockError
      );
    });
  });

  describe("getUserStats", () => {
    it("should fetch user stats with no role", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            total: 100,
            active: 80,
            inactive: 20,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await userService.getUserStats(mockCuid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/users/stats`,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch user stats with role array", async () => {
      const params: IFilteredUsersParams = {
        role: ["admin", "manager"],
      };

      const mockResponse = {
        data: {
          success: true,
          data: { total: 10 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await userService.getUserStats(mockCuid, params);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/users/stats?role=admin%2Cmanager`,
        {}
      );
    });
  });

  describe("getClientPropertyManagers", () => {
    it("should fetch property managers with all params", async () => {
      const params = {
        role: "manager" as const,
        department: "operations" as const,
        search: "john",
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: {
          success: true,
          data: [
            { uid: "user-1", firstName: "John", role: "manager" },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await userService.getClientPropertyManagers(mockCuid, params);

      const expectedUrl =
        `/api/v1/users/${mockCuid}/property_managers?role=manager&department=operations&search=john&page=1&limit=10`;
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl, {});
    });
  });

  describe("getProfileDetails", () => {
    it("should fetch profile details with uid", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            uid: mockUid,
            profile: { firstName: "John" },
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await userService.getProfileDetails(mockCuid, mockUid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/profile_details/?uid=${mockUid}`,
        {}
      );
    });

    it("should fetch profile details without uid", async () => {
      const mockResponse = {
        data: { success: true, data: {} },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await userService.getProfileDetails(mockCuid, undefined);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/profile_details/`,
        {}
      );
    });
  });

  describe("updateUserProfile", () => {
    it("should update user profile successfully", async () => {
      const updateData = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            ...updateData,
            uid: mockUid,
          },
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const result = await userService.updateUserProfile(
        mockCuid,
        mockUid,
        updateData
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/update_profile/?uid=${mockUid}`,
        updateData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe("getTenants", () => {
    it("should fetch tenants with filtering params", async () => {
      const params = {
        status: "active" as const,
        search: "test",
        page: 1,
        limit: 20,
        sortBy: "firstName",
        sort: "desc" as const,
      };

      const mockResponse = {
        data: {
          success: true,
          data: [{ uid: "tenant-1", firstName: "Test" }],
          pagination: { page: 1, limit: 20, total: 1 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await userService.getTenants(mockCuid, params);

      const expectedUrl =
        `/api/v1/users/${mockCuid}/filtered-tenants?status=active&search=test&page=1&limit=20&sortBy=firstName&sort=desc`;
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl, {});
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getClientTenantDetails", () => {
    it("should fetch tenant details without includes", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            uid: mockUid,
            tenantInfo: {},
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await userService.getClientTenantDetails(mockCuid, mockUid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/client_tenant/${mockUid}`,
        {}
      );
    });

    it("should fetch tenant details with includes", async () => {
      const includes = ["profile", "leaseInfo", "paymentHistory"];
      const mockResponse = {
        data: { success: true, data: {} },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await userService.getClientTenantDetails(mockCuid, mockUid, includes);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/client_tenant/${mockUid}?include=profile%2CleaseInfo%2CpaymentHistory`,
        {}
      );
    });
  });

  describe("updateTenant", () => {
    it("should update tenant successfully", async () => {
      const updateData = {
        personalInfo: { firstName: "Updated", lastName: "Name" },
        tenantInfo: {},
      };

      const mockResponse = {
        data: {
          success: true,
          message: "Tenant updated",
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const result = await userService.updateTenant(
        mockCuid,
        mockUid,
        updateData
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/tenant_details/${mockUid}`,
        updateData,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error when update fails", async () => {
      const mockError = new Error("Update failed");
      mockedAxios.patch.mockRejectedValue(mockError);

      await expect(
        userService.updateTenant(mockCuid, mockUid, {})
      ).rejects.toThrow("Update failed");
      expect(console.error).toHaveBeenCalledWith(
        "Error updating tenant:",
        mockError
      );
    });
  });

  describe("deactivateTenant", () => {
    it("should deactivate tenant successfully", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Tenant deactivated",
        },
      };

      mockedAxios.delete.mockResolvedValue(mockResponse);

      const result = await userService.deactivateTenant(mockCuid, mockUid);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `/api/v1/users/${mockCuid}/tenant_details/${mockUid}`,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error when deactivation fails", async () => {
      const mockError = new Error("Deactivation failed");
      mockedAxios.delete.mockRejectedValue(mockError);

      await expect(
        userService.deactivateTenant(mockCuid, mockUid)
      ).rejects.toThrow("Deactivation failed");
      expect(console.error).toHaveBeenCalledWith(
        "Error deactivating tenant:",
        mockError
      );
    });
  });
});
