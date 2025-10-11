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
      expect(response.status).toBe(200);
    });

    it("should include filter params in query string", async () => {
      const mockResponse = {
        status: 200,
        data: { success: true, data: [], pagination: {} },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await propertyService.getClientProperties(
        "client-123",
        { page: 1, limit: 10 },
        { propertyType: "residential", status: "active" }
      );

      const callUrl = mockedAxios.get.mock.calls[0][0];
      expect(callUrl).toContain("propertyType=residential");
      expect(callUrl).toContain("status=active");
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
        "/api/v1/properties/client-123/client_properties/prop-123",
        expect.any(Object)
      );
      expect(response.status).toBe(200);
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
});
