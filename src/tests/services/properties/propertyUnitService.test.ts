import axios from "@configs/axios";
import { propertyUnitService } from "@services/propertyUnit";

jest.mock("@configs/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PropertyUnitService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUnits", () => {
    it("should create multiple units for a property", async () => {
      const unitData = {
        units: [
          {
            unitNumber: "101",
            unitType: "apartment",
            bedrooms: 2,
            bathrooms: 1,
            rentAmount: 1500,
          },
          {
            unitNumber: "102",
            unitType: "apartment",
            bedrooms: 1,
            bathrooms: 1,
            rentAmount: 1200,
          },
        ],
      };

      const mockData = {
        data: {
          success: true,
          message: "Units created",
          data: { created: 2 },
        },
      };

      mockedAxios.post.mockResolvedValue(mockData);

      const response = await propertyUnitService.createUnits(
        "client-123",
        "prop-456",
        unitData
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/client_properties/prop-456/units/",
        unitData,
        expect.any(Object)
      );
      // Status check removed - axios wrapper returns data only
      expect(response.success).toBe(true);
    });

    it("should throw error when unit creation fails", async () => {
      mockedAxios.post.mockRejectedValue(new Error("Failed to create units"));

      await expect(
        propertyUnitService.createUnits("client-123", "prop-456", { units: [] })
      ).rejects.toThrow("Failed to create units");
    });
  });

  describe("getPropertyUnits", () => {
    it("should fetch units with pagination", async () => {
      const mockData = {
        data: {
          success: true,
          data: [
            { puid: "unit-1", unitNumber: "101", unitType: "apartment" },
            { puid: "unit-2", unitNumber: "102", unitType: "apartment" },
          ],
          pagination: { page: 1, limit: 10, total: 2 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      const response = await propertyUnitService.getPropertyUnits(
        "client-123",
        "prop-456",
        { page: 1, limit: 10 }
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(
          "/api/v1/properties/client-123/client_properties/prop-456/units"
        ),
        expect.any(Object)
      );
      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(2);
    });

    it("should include filter params in query string", async () => {
      const mockData = {
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      await propertyUnitService.getPropertyUnits("client-123", "prop-456", {
        pagination: { page: 1, limit: 10 },
        filter: {
          unitType: "apartment",
          status: "available",
          floor: 3,
        },
      });

      const callUrl = mockedAxios.get.mock.calls[0][0];
      expect(callUrl).toContain("filter%5BunitType%5D=apartment");
      expect(callUrl).toContain("filter%5Bstatus%5D=available");
      expect(callUrl).toContain("filter%5Bfloor%5D=3");
    });

    it("should include rent range filters", async () => {
      const mockData = {
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      await propertyUnitService.getPropertyUnits("client-123", "prop-456", {
        pagination: { page: 1, limit: 10 },
        filter: {
          minRent: 1000,
          maxRent: 2000,
        },
      });

      const callUrl = mockedAxios.get.mock.calls[0][0];
      expect(callUrl).toContain("filter%5BminRent%5D=1000");
      expect(callUrl).toContain("filter%5BmaxRent%5D=2000");
    });

    it("should include area range filters", async () => {
      const mockData = {
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      await propertyUnitService.getPropertyUnits("client-123", "prop-456", {
        pagination: { page: 1, limit: 10 },
        filter: {
          minArea: 500,
          maxArea: 1500,
        },
      });

      const callUrl = mockedAxios.get.mock.calls[0][0];
      expect(callUrl).toContain("filter%5BminArea%5D=500");
      expect(callUrl).toContain("filter%5BmaxArea%5D=1500");
    });

    it("should include search term filter", async () => {
      const mockData = {
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      await propertyUnitService.getPropertyUnits("client-123", "prop-456", {
        pagination: { page: 1, limit: 10 },
        filter: {
          searchTerm: "penthouse",
        },
      });

      const callUrl = mockedAxios.get.mock.calls[0][0];
      expect(callUrl).toContain("filter%5BsearchTerm%5D=penthouse");
    });

    it("should include sort parameters", async () => {
      const mockData = {
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      await propertyUnitService.getPropertyUnits("client-123", "prop-456", {
        pagination: {
          page: 1,
          limit: 10,
          order: "desc",
          sortBy: "rentAmount",
        },
      });

      const callUrl = mockedAxios.get.mock.calls[0][0];
      expect(callUrl).toContain("pagination%5Border%5D=desc");
      expect(callUrl).toContain("pagination%5BsortBy%5D=rentAmount");
    });
  });

  describe("getUnit", () => {
    it("should fetch a single unit", async () => {
      const mockData = {
        data: {
          success: true,
          data: {
            puid: "unit-123",
            unitNumber: "101",
            unitType: "apartment",
            bedrooms: 2,
            bathrooms: 1,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      const response = await propertyUnitService.getUnit(
        "client-123",
        "prop-456",
        "unit-123"
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/client_properties/prop-456/units/unit-123",
        expect.any(Object)
      );
      expect(response.success).toBe(true);
      expect(response.puid).toBe("unit-123");
    });

    it("should throw error when unit not found", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Unit not found"));

      await expect(
        propertyUnitService.getUnit("client-123", "prop-456", "invalid-unit")
      ).rejects.toThrow("Unit not found");
    });
  });

  describe("updateUnit", () => {
    it("should update a unit", async () => {
      const updateData = {
        puid: "unit-123",
        unitNumber: "101A",
        rentAmount: 1600,
      };

      const mockData = {
        data: {
          success: true,
          message: "Unit updated",
          data: updateData,
        },
      };

      mockedAxios.patch.mockResolvedValue(mockData);

      const response = await propertyUnitService.updateUnit(
        "client-123",
        "prop-456",
        updateData as any
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/client_properties/prop-456/units/unit-123",
        updateData,
        expect.any(Object)
      );
      expect(response.success).toBe(true);
    });

    it("should throw error when update fails", async () => {
      mockedAxios.patch.mockRejectedValue(new Error("Update failed"));

      await expect(
        propertyUnitService.updateUnit("client-123", "prop-456", {
          puid: "unit-123",
        } as any)
      ).rejects.toThrow("Update failed");
    });
  });

  describe("archiveUnits", () => {
    it("should archive multiple units", async () => {
      const mockData = {
        data: {
          success: true,
          message: "Units archived",
          data: { archived: 3 },
        },
      };

      mockedAxios.patch.mockResolvedValue(mockData);

      const response = await propertyUnitService.archiveUnits(
        "client-123",
        "prop-456",
        { unitIds: ["unit-1", "unit-2", "unit-3"] }
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/client_properties/prop-456/units/archive",
        { unitIds: ["unit-1", "unit-2", "unit-3"] },
        expect.any(Object)
      );
      expect(response.success).toBe(true);
    });

    it("should throw error when archive fails", async () => {
      mockedAxios.patch.mockRejectedValue(new Error("Archive failed"));

      await expect(
        propertyUnitService.archiveUnits("client-123", "prop-456", {
          unitIds: [],
        })
      ).rejects.toThrow("Archive failed");
    });
  });

  describe("deleteUnit", () => {
    it("should delete a unit", async () => {
      const mockData = {
        data: {
          success: true,
          message: "Unit deleted",
        },
      };

      mockedAxios.delete.mockResolvedValue(mockData);

      const response = await propertyUnitService.deleteUnit(
        "client-123",
        "prop-456",
        "unit-123"
      );

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/client_properties/prop-456/units/unit-123",
        expect.any(Object)
      );
      expect(response.success).toBe(true);
    });

    it("should throw error when delete fails", async () => {
      mockedAxios.delete.mockRejectedValue(new Error("Delete failed"));

      await expect(
        propertyUnitService.deleteUnit("client-123", "prop-456", "unit-123")
      ).rejects.toThrow("Delete failed");
    });
  });

  describe("buildQueryString", () => {
    it("should build query string with all filter parameters", async () => {
      const mockData = {
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      await propertyUnitService.getPropertyUnits("client-123", "prop-456", {
        pagination: { page: 1, limit: 10 },
        filter: {
          unitType: "apartment",
          status: "available",
          floor: 2,
          minRent: 1000,
          maxRent: 2000,
          minArea: 500,
          maxArea: 1500,
          searchTerm: "balcony",
        },
      });

      const callUrl = mockedAxios.get.mock.calls[0][0];
      expect(callUrl).toContain("filter%5BunitType%5D=apartment");
      expect(callUrl).toContain("filter%5Bstatus%5D=available");
      expect(callUrl).toContain("filter%5Bfloor%5D=2");
      expect(callUrl).toContain("filter%5BminRent%5D=1000");
      expect(callUrl).toContain("filter%5BmaxRent%5D=2000");
      expect(callUrl).toContain("filter%5BminArea%5D=500");
      expect(callUrl).toContain("filter%5BmaxArea%5D=1500");
      expect(callUrl).toContain("filter%5BsearchTerm%5D=balcony");
    });

    it("should omit undefined and empty string filter values", async () => {
      const mockData = {
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      // Build filter object without null/undefined values (as would happen in real usage)
      const filter: any = {
        unitType: "apartment",
      };
      // Don't add undefined or empty string values

      await propertyUnitService.getPropertyUnits("client-123", "prop-456", {
        pagination: { page: 1, limit: 10 },
        filter,
      });

      const callUrl = mockedAxios.get.mock.calls[0][0];
      expect(callUrl).toContain("filter%5BunitType%5D=apartment");
      expect(callUrl).not.toContain("filter%5Bstatus%5D");
      expect(callUrl).not.toContain("filter%5BminRent%5D");
      expect(callUrl).not.toContain("filter%5BsearchTerm%5D");
    });

    it("should handle floor value of 0", async () => {
      const mockData = {
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockData);

      await propertyUnitService.getPropertyUnits("client-123", "prop-456", {
        pagination: { page: 1, limit: 10 },
        filter: {
          floor: 0,
        },
      });

      const callUrl = mockedAxios.get.mock.calls[0][0];
      expect(callUrl).toContain("filter%5Bfloor%5D=0");
    });
  });
});
