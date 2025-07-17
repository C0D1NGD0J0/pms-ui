import axios from "@configs/axios";
import {
  IResendInvitationData,
  IInvitationListQuery,
  IInvitationTableData,
  IInvitationFormData,
  IInvitationStats,
  IUserRole,
} from "@src/interfaces/invitation.interface";

class InvitationService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/invites`;

  constructor() {}

  /**
   * Send an invitation to join a client
   */
  async sendInvite(cuid: string, inviteData: Partial<IInvitationFormData>) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${cuid}/send_invite`,
        inviteData,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error sending invite:", error);
      throw error;
    }
  }

  /**
   * Validate an invitation token (public endpoint)
   */
  async validateInvitation(token: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${token}/validate`,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error validating invitation:", error);
      throw error;
    }
  }

  /**
   * Accept an invitation and complete user registration (public endpoint)
   */
  async acceptInvitation(token: string, acceptData: any) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${token}/accept`,
        acceptData,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error accepting invitation:", error);
      throw error;
    }
  }

  /**
   * Get invitations for a client with filtering and pagination
   */
  async getInvitations(cuid: string, query: IInvitationListQuery) {
    try {
      const response = await axios.get(`${this.baseUrl}/clients/${cuid}`, {
        ...this.axiosConfig,
        params: query,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching invitations:", error);
      throw error;
    }
  }

  /**
   * Get invitation statistics for a client
   */
  async getInvitationStats(cuid: string): Promise<IInvitationStats> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/clients/${cuid}/stats`,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching invitation stats:", error);
      throw error;
    }
  }

  /**
   * Get invitation details by ID
   */
  async getInvitationById(iuid: string): Promise<IInvitationTableData> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${iuid}`,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching invitation by ID:", error);
      throw error;
    }
  }

  /**
   * Revoke a pending invitation
   */
  async revokeInvitation(iuid: string, revokeData: { reason?: string }) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${iuid}/revoke`, {
        ...this.axiosConfig,
        data: revokeData,
      });
      return response.data;
    } catch (error) {
      console.error("Error revoking invitation:", error);
      throw error;
    }
  }

  /**
   * Resend an invitation reminder
   */
  async resendInvitation(iuid: string, resendData: IResendInvitationData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${iuid}/resend`,
        resendData,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error resending invitation:", error);
      throw error;
    }
  }

  /**
   * Get invitations by email (for user's own invitations)
   */
  async getInvitationsByEmail(email: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/by-email/${email}`,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching invitations by email:", error);
      throw error;
    }
  }

  /**
   * Validate a CSV file for bulk invitation import
   */
  async validateInvitationCsv(cuid: string, csvFile: File) {
    try {
      const formData = new FormData();
      formData.append("csv_file", csvFile);

      const response = await axios.post(
        `${this.baseUrl}/${cuid}/validate_csv`,
        formData,
        {
          ...this.axiosConfig,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error validating CSV:", error);
      throw error;
    }
  }

  /**
   * Import invitations from a CSV file
   */
  async importInvitationsFromCsv(cuid: string, csvFile: File) {
    try {
      const formData = new FormData();
      formData.append("csv_file", csvFile);

      const response = await axios.post(
        `${this.baseUrl}/${cuid}/import_invitations_csv`,
        formData,
        {
          ...this.axiosConfig,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error importing CSV:", error);
      throw error;
    }
  }

  /**
   * Process pending invitations for a client with optional filters
   */
  async processPendingInvitations(
    cuid: string,
    query?: { role?: IUserRole; limit?: number }
  ) {
    try {
      const response = await axios.patch(
        `${this.baseUrl}/${cuid}/process-pending`,
        {},
        {
          ...this.axiosConfig,
          params: query,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error processing pending invitations:", error);
      throw error;
    }
  }
}

export const invitationService = new InvitationService();
