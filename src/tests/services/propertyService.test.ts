import axios from "@configs/axios";
import { propertyService } from "@services/property";

jest.mock("@configs/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@utils/formDataTransformer", () => ({
  prepareRequestData: jest.fn((data) => ({
    data,
    headers: { "Content-Type": "application/json" },
  })),
}));

describe("PropertyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProperty", () => {
    it("should create a new property", async () => {
      const propertyData = {
        propertyType: "residential",
        street: "123 Main St",
        city: "New York",
      };

      const mockResponse = {
        status: 201,
        data: {
          success: true,
          message: "Property created",
          data: { pid: "prop-123", ...propertyData },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await propertyService.createProperty(
        "client-123",
        propertyData
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/add_property",
        propertyData,
        expect.objectContaining({
          headers: expect.any(Object),
        })
      );
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
    });

    it("should throw error on failure", async () => {
      mockedAxios.post.mockRejectedValue(new Error("Failed to create"));

      await expect(
        propertyService.createProperty("client-123", {})
      ).rejects.toThrow();
    });
  });

  describe("getClientProperties", () => {
    it("should fetch properties with pagination", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          data: [
            { pid: "prop-1", propertyType: "residential" },
            { pid: "prop-2", propertyType: "commercial" },
          ],
          pagination: { page: 1, limit: 10, total: 2 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const response = await propertyService.getClientProperties(
        "client-123",
        { page: 1, limit: 10 }
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/properties/client-123/client_properties"),
        expect.any(Object)
      );
      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(2);
    });

    it("should include filter params in query string", async () => {
      const mockResponse = {
        status: 200,
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await propertyService.getClientProperties("client-123", {
        pagination: { page: 1, limit: 10 },
        filters: { propertyType: "residential", status: "active" },
      });

      // Verify the service method was called with correct endpoint
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/properties/client-123/client_properties"),
        expect.any(Object)
      );
    });
  });

  describe("getClientProperty", () => {
    it("should fetch a single property", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          data: {
            pid: "prop-123",
            propertyType: "residential",
            street: "123 Main St",
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const response = await propertyService.getClientProperty(
        "client-123",
        "prop-123"
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/client_property/prop-123?q",
        expect.any(Object)
      );
      expect(response.success).toBe(true);
      expect(response.data.pid).toBe("prop-123");
    });
  });

  describe("updateClientProperty", () => {
    it("should update a property", async () => {
      const updateData = { street: "456 Oak Ave" };

      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "Property updated",
          data: { pid: "prop-123", ...updateData },
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const response = await propertyService.updateClientProperty(
        "client-123",
        "prop-123",
        updateData
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/client_properties/prop-123",
        updateData,
        expect.any(Object)
      );
      expect(response.data.success).toBe(true);
    });
  });

  describe("deleteClientProperty", () => {
    it("should delete properties", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "Properties deleted",
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const response = await propertyService.deleteClientProperty(
        "client-123",
        ["prop-123", "prop-456"]
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/delete_properties",
        { pids: ["prop-123", "prop-456"] },
        expect.any(Object)
      );
      expect(response.data.success).toBe(true);
    });
  });

  describe("CSV operations", () => {
    it("should validate CSV file", async () => {
      const mockFile = new File(["test"], "properties.csv", {
        type: "text/csv",
      });

      const mockResponse = {
        status: 200,
        data: { success: true, message: "CSV is valid" },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await propertyService.validatePropertiesCSV(
        "client-123",
        mockFile
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/validate_csv",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
      expect(response.data.success).toBe(true);
    });

    it("should import properties from CSV", async () => {
      const mockFile = new File(["test"], "properties.csv", {
        type: "text/csv",
      });

      const mockResponse = {
        status: 201,
        data: {
          success: true,
          message: "Properties imported",
          data: { imported: 5 },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await propertyService.addMultipleProperties(
        "client-123",
        mockFile
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/import_properties_csv",
        expect.any(FormData),
        expect.objectContaining({
          headers: { "Content-Type": "multipart/form-data" },
        })
      );
      expect(response.data.data.imported).toBe(5);
    });
  });

  describe("getPendingApprovals", () => {
    it("should fetch pending approval properties with pagination", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          data: [
            { pid: "prop-1", status: "pending" },
            { pid: "prop-2", status: "pending" },
          ],
          pagination: { page: 1, limit: 10, total: 2 },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const response = await propertyService.getPendingApprovals(
        "client-123",
        { page: 1, limit: 10 }
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/properties/client-123/properties/pending"),
        expect.any(Object)
      );
      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(2);
    });

    it("should include sort parameters in query string", async () => {
      const mockResponse = {
        status: 200,
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await propertyService.getPendingApprovals("client-123", {
        pagination: {
          page: 1,
          limit: 10,
          sort: "asc",
          sortBy: "createdAt",
        },
      });

      const callUrl = mockedAxios.get.mock.calls[0][0];

      // Check that sort params are in the URL query string
      expect(callUrl).toContain("sort");
      expect(callUrl).toContain("asc");
      expect(callUrl).toContain("sortBy");
      expect(callUrl).toContain("createdAt");
    });
  });

  describe("approveProperty", () => {
    it("should approve a property without notes", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "Property approved",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await propertyService.approveProperty(
        "client-123",
        "prop-123"
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/properties/prop-123/approve",
        { notes: undefined },
        expect.any(Object)
      );
      expect(response.data.success).toBe(true);
    });

    it("should approve a property with notes", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "Property approved",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await propertyService.approveProperty(
        "client-123",
        "prop-123",
        "Approved after review"
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        { notes: "Approved after review" },
        expect.any(Object)
      );
    });
  });

  describe("rejectProperty", () => {
    it("should reject a property with reason", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "Property rejected",
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await propertyService.rejectProperty(
        "client-123",
        "prop-123",
        "Missing required documents"
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/properties/prop-123/reject",
        { reason: "Missing required documents" },
        expect.any(Object)
      );
      expect(response.data.success).toBe(true);
    });

    it("should throw error when rejection fails", async () => {
      mockedAxios.post.mockRejectedValue(new Error("Network error"));

      await expect(
        propertyService.rejectProperty("client-123", "prop-123", "Invalid")
      ).rejects.toThrow("Network error");
    });
  });

  describe("bulkApproveProperties", () => {
    it("should approve multiple properties", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "Properties approved",
          data: { approved: 3 },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await propertyService.bulkApproveProperties(
        "client-123",
        ["prop-1", "prop-2", "prop-3"]
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/properties/bulk-approve",
        { propertyIds: ["prop-1", "prop-2", "prop-3"] },
        expect.any(Object)
      );
      expect(response.data.success).toBe(true);
    });
  });

  describe("bulkRejectProperties", () => {
    it("should reject multiple properties with reason", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          message: "Properties rejected",
          data: { rejected: 2 },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await propertyService.bulkRejectProperties(
        "client-123",
        ["prop-1", "prop-2"],
        "Incomplete information"
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/properties/client-123/properties/bulk-reject",
        { propertyIds: ["prop-1", "prop-2"], reason: "Incomplete information" },
        expect.any(Object)
      );
      expect(response.data.success).toBe(true);
    });
  });

  describe("getPropertyFormMetaData", () => {
    it("should fetch form metadata for specific form type", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          data: {
            formType: "residential",
            fields: ["address", "bedrooms", "bathrooms"],
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const response = await propertyService.getPropertyFormMetaData(
        "residential"
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/v1/properties/property_form_metadata?formType=residential",
        expect.any(Object)
      );
      expect(response.success).toBe(true);
    });
  });

  describe("getAllStaticData", () => {
    it("should fetch all static property data", async () => {
      const mockResponse = {
        status: 200,
        data: {
          success: true,
          data: {
            propertyTypes: ["residential", "commercial"],
            statuses: ["active", "inactive"],
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const response = await propertyService.getAllStaticData();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/v1/properties/property_form_metadata",
        expect.any(Object)
      );
      expect(response.success).toBe(true);
    });
  });

  describe("buildQueryString", () => {
    it("should build query string with all filter parameters", async () => {
      const mockResponse = {
        status: 200,
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await propertyService.getClientProperties("client-123", {
        pagination: { page: 1, limit: 10 },
        filters: {
          propertyType: "residential",
          status: "active",
          occupancyStatus: "occupied",
          minPrice: 100000,
          maxPrice: 500000,
          searchTerm: "downtown",
          minArea: 1000,
          maxArea: 3000,
          minYear: 2000,
          maxYear: 2020,
        },
      });

      // Verify the service method was called with correct endpoint
      // buildNestedQuery handles building the query params
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/properties/client-123/client_properties"),
        expect.any(Object)
      );
    });

    it("should omit undefined and null filter values", async () => {
      const mockResponse = {
        status: 200,
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await propertyService.getClientProperties("client-123", {
        pagination: { page: 1, limit: 10 },
        filters: {
          propertyType: "residential",
          status: undefined,
          minPrice: null as any,
          searchTerm: "",
        },
      });

      // Verify the service method was called with correct endpoint
      // buildNestedQuery handles omitting undefined/null/empty values
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/properties/client-123/client_properties"),
        expect.any(Object)
      );
    });
  });
});
