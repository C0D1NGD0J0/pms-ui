import axios from "@configs/axios";
import { leaseService } from "@services/lease";

jest.mock("@configs/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@utils/formDataTransformer", () => ({
  prepareRequestData: jest.fn((data) => ({
    data,
    headers: { "Content-Type": "application/json" },
  })),
}));

describe("LeaseService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new lease", async () => {
    const leaseData = {
      type: "fixed-term",
      property: { id: "prop-123" },
      fees: { monthlyRent: 1500 },
    };

    const mockResponse = {
      status: 201,
      data: {
        success: true,
        message: "Lease created",
        data: { luid: "lease-123", ...leaseData },
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const response = await leaseService.createLease("client-123", leaseData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/api/v1/leases/client-123/",
      leaseData,
      expect.objectContaining({
        headers: expect.any(Object),
      })
    );
    expect(response.status).toBe(201);
    expect(response.data.success).toBe(true);
  });

  it("should update an existing lease", async () => {
    const leaseData = {
      fees: { monthlyRent: 2000, acceptedPaymentMethod: "credit_card" },
    };

    const mockResponse = {
      status: 200,
      data: {
        success: true,
        message: "Lease updated",
        data: { luid: "lease-123", ...leaseData },
      },
    };

    mockedAxios.patch.mockResolvedValue(mockResponse);

    const response = await leaseService.updateLease(
      "client-123",
      "lease-123",
      leaseData
    );

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      "/api/v1/leases/client-123/lease-123",
      leaseData,
      expect.objectContaining({
        headers: expect.any(Object),
      })
    );
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
  });

  it("should handle errors when updating a lease", async () => {
    const leaseData = { fees: { monthlyRent: 2000 } };
    const mockError = new Error("Update failed");

    mockedAxios.patch.mockRejectedValue(mockError);

    await expect(
      leaseService.updateLease("client-123", "lease-123", leaseData)
    ).rejects.toThrow("Update failed");
  });

  it("should fetch leases with filters", async () => {
    const mockResponse = {
      status: 200,
      data: { success: true, data: [] },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    await leaseService.getFilteredLeases("client-123", {
      filter: { status: "active" },
      pagination: { page: 1, limit: 10 },
    });

    const callUrl = mockedAxios.get.mock.calls[0][0];
    expect(callUrl).toContain("filter");
  });

  it("should fetch leases without filters", async () => {
    const mockResponse = {
      status: 200,
      data: { success: true, data: [] },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    await leaseService.getFilteredLeases("client-123");

    const callUrl = mockedAxios.get.mock.calls[0][0];
    expect(callUrl).toBe("/api/v1/leases/client-123");
  });

  it("should fetch lease statistics", async () => {
    const mockResponse = {
      status: 200,
      data: {
        success: true,
        data: {
          leasesByStatus: { active: 10, expired: 5 },
          expiringIn30Days: 3,
          totalMonthlyRent: 15000,
          occupancyRate: 85.5,
        },
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const response = await leaseService.getLeaseStats("client-123");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/api/v1/leases/client-123/stats",
      expect.any(Object)
    );
    expect(response).toBeDefined();
  });

  it("should fetch expiring leases with default days", async () => {
    const mockResponse = {
      status: 200,
      data: [
        { luid: "lease-1", endDate: "2025-12-01" },
        { luid: "lease-2", endDate: "2025-12-15" },
      ],
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const response = await leaseService.getExpiringLeases("client-123");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/api/v1/leases/client-123/expiring?days=30",
      expect.any(Object)
    );
    expect(response).toHaveLength(2);
  });

  it("should fetch expiring leases with custom days", async () => {
    const mockResponse = {
      status: 200,
      data: { success: true, data: [] },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    await leaseService.getExpiringLeases("client-123", 60);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/api/v1/leases/client-123/expiring?days=60",
      expect.any(Object)
    );
  });


  it("should fetch leaseable properties without units", async () => {
    const mockResponse = {
      status: 200,
      data: {
        success: true,
        data: {
          items: [
            { id: "prop-1", name: "Property 1" },
            { id: "prop-2", name: "Property 2" },
          ],
          metadata: { filteredProperties: [], filteredCount: 0 },
        },
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const response = await leaseService.getLeaseableProperties(
      "client-123",
      false
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/api/v1/properties/client-123/leaseable",
      expect.any(Object)
    );
    expect(response.data.data.items).toHaveLength(2);
  });

  it("should fetch leaseable properties with units", async () => {
    const mockResponse = {
      status: 200,
      data: {
        success: true,
        data: {
          items: [
            {
              id: "prop-1",
              name: "Property 1",
              units: [{ id: "unit-1", unitNumber: "101" }],
            },
          ],
          metadata: null,
        },
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const response = await leaseService.getLeaseableProperties(
      "client-123",
      true
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "/api/v1/properties/client-123/leaseable?fetchUnits=true",
      expect.any(Object)
    );
    expect(response.data.data.items[0].units).toBeDefined();
  });

  it("should manually activate a lease", async () => {
    const activationData = {
      notes: "Signed in person on 2025-12-10",
    };

    const mockResponse = {
      status: 200,
      data: {
        success: true,
        message: "Lease activated successfully",
        data: {
          luid: "lease-123",
          status: "active",
        },
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const response = await leaseService.manuallyActivateLease(
      "client-123",
      "lease-123",
      activationData
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/api/v1/leases/client-123/lease-123/activate",
      activationData,
      expect.any(Object)
    );
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.data.status).toBe("active");
  });

  it("should handle errors when manually activating a lease", async () => {
    const mockError = new Error("Activation failed");

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(
      leaseService.manuallyActivateLease("client-123", "lease-123", {})
    ).rejects.toThrow("Activation failed");
  });

  it("should terminate a lease", async () => {
    const terminationData = {
      terminationDate: "2025-12-31",
      reason: "Tenant requested early termination",
      refundAmount: 150000,
      notes: "Full security deposit refund",
    };

    const mockResponse = {
      status: 200,
      data: {
        success: true,
        message: "Lease terminated successfully",
        data: {
          luid: "lease-123",
          status: "terminated",
          terminationDate: "2025-12-31",
        },
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const response = await leaseService.terminateLease(
      "client-123",
      "lease-123",
      terminationData
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/api/v1/leases/client-123/lease-123/terminate",
      terminationData,
      expect.any(Object)
    );
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.data.status).toBe("terminated");
  });

  it("should terminate a lease without refund amount", async () => {
    const terminationData = {
      terminationDate: "2025-12-31",
      reason: "Lease violation",
      notes: "No refund due to damages",
    };

    const mockResponse = {
      status: 200,
      data: {
        success: true,
        message: "Lease terminated successfully",
        data: {
          luid: "lease-123",
          status: "terminated",
        },
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const response = await leaseService.terminateLease(
      "client-123",
      "lease-123",
      terminationData
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "/api/v1/leases/client-123/lease-123/terminate",
      terminationData,
      expect.any(Object)
    );
    expect(response.data.success).toBe(true);
  });

  it("should handle errors when terminating a lease", async () => {
    const terminationData = {
      terminationDate: "2025-12-31",
      reason: "Test reason",
    };
    const mockError = new Error("Termination failed");

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(
      leaseService.terminateLease("client-123", "lease-123", terminationData)
    ).rejects.toThrow("Termination failed");
  });
});
