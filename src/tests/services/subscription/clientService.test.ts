import axios from "@configs/axios";
import { clientService } from "@services/client";
import { UpdateClientDetailsFormData } from "@validations/client.validations";

jest.mock("@configs/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ClientService", () => {
  const mockCuid = "client-123";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getClientDetails", () => {
    it("should fetch client details successfully", async () => {
      const mockClientData = {
        cuid: mockCuid,
        displayName: "Test Company",
        email: "test@company.com",
        accountType: {
          isEnterpriseAccount: true,
          isProfessionalAccount: false,
        },
        subscription: {
          plan: "enterprise",
          status: "active",
        },
      };

      const mockResponse = {
        data: {
          success: true,
          data: mockClientData,
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await clientService.getClientDetails(mockCuid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/clients/${mockCuid}/client_details`,
        {}
      );
      expect(result).toEqual(mockClientData);
    });

    it("should throw error when fetching client details fails", async () => {
      const mockError = new Error("Network error");
      mockedAxios.get.mockRejectedValue(mockError);

      await expect(clientService.getClientDetails(mockCuid)).rejects.toThrow(
        "Network error"
      );
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching client details:",
        mockError
      );
    });

    it("should handle API error response", async () => {
      const apiError = {
        response: {
          status: 404,
          data: { message: "Client not found" },
        },
      };

      mockedAxios.get.mockRejectedValue(apiError);

      await expect(
        clientService.getClientDetails(mockCuid)
      ).rejects.toMatchObject(apiError);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("updateClient", () => {
    it("should update client successfully with minimal data", async () => {
      const updateData: UpdateClientDetailsFormData = {
        displayName: "Updated Company Name",
      };

      const mockUpdatedData = {
        cuid: mockCuid,
        displayName: "Updated Company Name",
      };

      const mockResponse = {
        data: {
          success: true,
          message: "Client updated successfully",
          data: mockUpdatedData,
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const result = await clientService.updateClient(mockCuid, updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `/api/v1/clients/${mockCuid}/client_details`,
        updateData,
        {}
      );
      expect(result).toEqual(mockUpdatedData);
    });

    it("should update client with complete data", async () => {
      const updateData: UpdateClientDetailsFormData = {
        displayName: "Full Update Company",
        contactInfo: {
          phoneNumber: "+1234567890",
          email: "updated@company.com",
          website: "https://company.com",
        },
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA",
        },
        identification: {
          idType: "taxId",
          idNumber: "123-45-6789",
          expiryDate: "2025-12-31",
          issuingAuthority: "IRS",
        },
        companyProfile: {
          industry: "Real Estate",
          companySize: "50-200",
          yearEstablished: 2010,
          description: "Property management company",
        },
      };

      const mockResponse = {
        data: {
          success: true,
          data: { ...updateData, cuid: mockCuid },
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const result = await clientService.updateClient(mockCuid, updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `/api/v1/clients/${mockCuid}/client_details`,
        updateData,
        {}
      );
      expect(result).toEqual(mockResponse.data.data);
    });

    it("should throw error when update fails", async () => {
      const updateData: UpdateClientDetailsFormData = {
        displayName: "Test",
      };

      const mockError = new Error("Update failed");
      mockedAxios.patch.mockRejectedValue(mockError);

      await expect(
        clientService.updateClient(mockCuid, updateData)
      ).rejects.toThrow("Update failed");
      expect(console.error).toHaveBeenCalledWith(
        "Error updating client details:",
        mockError
      );
    });

    it("should handle validation error from API", async () => {
      const updateData: UpdateClientDetailsFormData = {
        displayName: "",
      };

      const validationError = {
        response: {
          status: 400,
          data: {
            message: "Validation failed",
            errors: ["Display name is required"],
          },
        },
      };

      mockedAxios.patch.mockRejectedValue(validationError);

      await expect(
        clientService.updateClient(mockCuid, updateData)
      ).rejects.toMatchObject(validationError);
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle network timeout", async () => {
      const updateData: UpdateClientDetailsFormData = {
        displayName: "Timeout Test",
      };

      const timeoutError = new Error("timeout of 5000ms exceeded");
      mockedAxios.patch.mockRejectedValue(timeoutError);

      await expect(
        clientService.updateClient(mockCuid, updateData)
      ).rejects.toThrow("timeout");
      expect(console.error).toHaveBeenCalledWith(
        "Error updating client details:",
        timeoutError
      );
    });
  });
});
