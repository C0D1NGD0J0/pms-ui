import axios from "@configs/axios";
import { invitationService } from "@services/invite";

jest.mock("@configs/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@utils/serviceHelper", () => ({
  withErrorHandling: jest.fn((fn) => fn()),
}));

describe("InvitationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendInvite", () => {
    it("should send an invitation", async () => {
      const inviteData = {
        email: "newuser@example.com",
        role: "staff",
        firstName: "John",
        lastName: "Doe",
      };

      const mockResponse = {
        data: {
          success: true,
          message: "Invitation sent",
          data: { iuid: "invite-123", ...inviteData },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await invitationService.sendInvite(
        "client-123",
        inviteData
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/invites/client-123/send_invite",
        inviteData,
        expect.any(Object)
      );
      expect(response.success).toBe(true);
    });
  });

  describe("acceptInvitation", () => {
    it("should accept an invitation", async () => {
      const acceptData = {
        token: "valid-token",
        email: "user@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      };

      const mockResponse = {
        data: {
          success: true,
          message: "Invitation accepted",
          data: {
            user: { uid: "user-123", email: acceptData.email },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const response = await invitationService.acceptInvitation(
        "client-123",
        acceptData
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/v1/invites/client-123/accept_invite/valid-token",
        acceptData,
        expect.any(Object)
      );
      expect(response.success).toBe(true);
    });
  });

  describe("declineInvitation", () => {
    it("should decline an invitation", async () => {
      const declineData = {
        token: "valid-token",
        reason: "Not interested",
      };

      const mockResponse = {
        data: {
          success: true,
          message: "Invitation declined",
        },
      };

      mockedAxios.patch.mockResolvedValue(mockResponse);

      const response = await invitationService.declineInvitation(
        "client-123",
        declineData
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        "/api/v1/invites/client-123/decline_invite/valid-token",
        declineData,
        expect.any(Object)
      );
      expect(response.success).toBe(true);
    });
  });

  describe("validateInvitationToken", () => {
    it("should validate invitation token", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            email: "user@example.com",
            role: "staff",
            isValid: true,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const response = await invitationService.validateInvitationToken(
        "client-123",
        "valid-token"
      );

      expect(mockedAxios.get).toHaveBeenCalledWith(
        "/api/v1/invites/client-123/validate_token?token=valid-token",
        expect.any(Object)
      );
      expect(response.success).toBe(true);
    });
  });
});
