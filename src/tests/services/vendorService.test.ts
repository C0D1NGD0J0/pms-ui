import axios from "@configs/axios";
import { vendorService } from "@services/vendors";
import { IFilteredVendorsParams, VendorQueryParams } from "@src/interfaces";

jest.mock("@configs/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("VendorService", () => {
  const mockCuid = "client-123";
  const mockVuid = "vendor-456";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getVendorDetails", () => {
    it("should fetch vendor details successfully", async () => {
      const mockVendorData = {
        vuid: mockVuid,
        companyName: "ABC Plumbing",
        businessType: "plumbing",
        contactInfo: {
          email: "contact@abcplumbing.com",
          phone: "+1234567890",
        },
        status: "active",
      };

      const mockResponse = {
        data: {
          success: true,
          data: mockVendorData,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await vendorService.getVendorDetails(mockCuid, mockVuid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/vendors/${mockCuid}/vendor_details/${mockVuid}`,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error when fetching vendor details fails", async () => {
      const mockError = new Error("Not found");
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        vendorService.getVendorDetails(mockCuid, mockVuid)
      ).rejects.toThrow("Not found");
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching vendor details:",
        mockError
      );
    });
  });

  describe("getFilteredVendors", () => {
    it("should fetch vendors with no filters", async () => {
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

      const result = await vendorService.getFilteredVendors(mockCuid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/vendors/${mockCuid}/filteredVendors`,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch vendors with status filter", async () => {
      const params: IFilteredVendorsParams = {
        status: "active",
      };

      const mockResponse = {
        data: {
          success: true,
          data: [{ vuid: "vendor-1", status: "active" }],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await vendorService.getFilteredVendors(mockCuid, params);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/vendors/${mockCuid}/filteredVendors?status=active`,
        {}
      );
    });

    it("should fetch vendors with all query params", async () => {
      const params: IFilteredVendorsParams = {
        status: "active",
        businessType: "plumbing",
        page: 2,
        limit: 20,
        sortBy: "companyName",
        sort: "asc",
      };

      const mockResponse = {
        data: {
          success: true,
          data: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await vendorService.getFilteredVendors(mockCuid, params);

      const expectedUrl =
        `/api/v1/vendors/${mockCuid}/filteredVendors?status=active&businessType=plumbing&page=2&limit=20&sortBy=companyName&sort=asc`;
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl, {});
    });

    it("should throw error when fetching filtered vendors fails", async () => {
      const mockError = new Error("API error");
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        vendorService.getFilteredVendors(mockCuid, { status: "active" })
      ).rejects.toThrow("API error");
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching filtered vendors:",
        mockError
      );
    });
  });

  describe("getClientVendors", () => {
    it("should fetch all client vendors successfully", async () => {
      const mockVendors = [
        { vuid: "vendor-1", companyName: "Vendor 1" },
        { vuid: "vendor-2", companyName: "Vendor 2" },
      ];

      const mockResponse = {
        data: {
          success: true,
          data: mockVendors,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await vendorService.getClientVendors(mockCuid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/vendors/${mockCuid}`,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error when fetching client vendors fails", async () => {
      const mockError = new Error("Network error");
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(vendorService.getClientVendors(mockCuid)).rejects.toThrow(
        "Network error"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching client vendors:",
        mockError
      );
    });
  });

  describe("getVendorStats", () => {
    it("should fetch vendor stats without status filter", async () => {
      const mockStats = {
        total: 50,
        active: 40,
        inactive: 10,
        byBusinessType: {
          plumbing: 15,
          electrical: 20,
          landscaping: 15,
        },
      };

      const mockResponse = {
        data: {
          success: true,
          data: mockStats,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await vendorService.getVendorStats(mockCuid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/vendors/${mockCuid}/vendors/stats`,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch vendor stats with status filter", async () => {
      const params = { status: "active" as const };

      const mockResponse = {
        data: {
          success: true,
          data: { total: 40 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await vendorService.getVendorStats(mockCuid, params);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/vendors/${mockCuid}/vendors/stats?status=active`,
        {}
      );
    });
  });

  describe("getVendorTeamMembers", () => {
    it("should fetch team members without pagination", async () => {
      const mockTeamMembers = [
        { uid: "user-1", name: "John Doe", role: "technician" },
        { uid: "user-2", name: "Jane Smith", role: "supervisor" },
      ];

      const mockResponse = {
        data: {
          success: true,
          data: mockTeamMembers,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await vendorService.getVendorTeamMembers(
        mockCuid,
        mockVuid
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/vendors/${mockCuid}/team_members/${mockVuid}`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch team members with pagination params", async () => {
      const pagination: VendorQueryParams = {
        status: "active",
        page: 1,
        limit: 10,
        sortBy: "name",
        sort: "asc",
      };

      const mockResponse = {
        data: {
          success: true,
          data: [],
          pagination: { page: 1, limit: 10, total: 0 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await vendorService.getVendorTeamMembers(mockCuid, mockVuid, pagination);

      const expectedUrl =
        `/api/v1/vendors/${mockCuid}/team_members/${mockVuid}?status=active&page=1&limit=10&sortBy=name&sort=asc`;
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl);
    });

    it("should throw error when fetching team members fails", async () => {
      const mockError = new Error("Fetch error");
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(
        vendorService.getVendorTeamMembers(mockCuid, mockVuid)
      ).rejects.toThrow("Fetch error");
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching vendor team members:",
        mockError
      );
    });
  });

  describe("updateVendor", () => {
    it("should update vendor successfully", async () => {
      const updateData = {
        companyName: "Updated Vendor Name",
        contactInfo: {
          email: "updated@vendor.com",
          phone: "+9876543210",
        },
      };

      const mockResponse = {
        data: {
          success: true,
          message: "Vendor updated successfully",
          data: {
            vuid: mockVuid,
            ...updateData,
          },
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const result = await vendorService.updateVendor(
        mockCuid,
        mockVuid,
        updateData
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `/api/v1/vendors/${mockCuid}/vendor/${mockVuid}`,
        updateData,
        {}
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw error when update fails", async () => {
      const updateData = { companyName: "Test" };
      const mockError = new Error("Update failed");
      mockedAxios.patch.mockRejectedValue(mockError);

      await expect(
        vendorService.updateVendor(mockCuid, mockVuid, updateData)
      ).rejects.toThrow("Update failed");
      expect(console.error).toHaveBeenCalledWith(
        "Error updating vendor:",
        mockError
      );
    });

    it("should handle validation errors", async () => {
      const updateData = { companyName: "" };

      const validationError = {
        response: {
          status: 400,
          data: {
            message: "Validation failed",
            errors: {
              companyName: "Company name is required",
            },
          },
        },
      };

      mockedAxios.patch.mockRejectedValue(validationError);

      await expect(
        vendorService.updateVendor(mockCuid, mockVuid, updateData)
      ).rejects.toMatchObject(validationError);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
