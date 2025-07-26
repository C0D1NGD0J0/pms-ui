import axios from "@configs/axios";
import { withErrorHandling } from "@utils/serviceHelper";
import {
  IResendInvitationData,
  IInvitationTableData,
  IInvitationFormData,
  IInvitationQuery,
  IInvitationStats,
  IUserRole,
} from "@src/interfaces/invitation.interface";

class InvitationService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/invites`;

  constructor() {}

  async sendInvite(cuid: string, inviteData: Partial<IInvitationFormData>) {
    return withErrorHandling(async () => {
      const response = await axios.post(
        `${this.baseUrl}/${cuid}/send_invite`,
        inviteData,
        this.axiosConfig
      );
      return response.data;
    }, "sendInvite");
  }

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

  async getInvitations(cuid: string, query: IInvitationQuery) {
    try {
      const params = new URLSearchParams({
        page: query.page?.toString() || "1",
        limit: query.limit?.toString() || "10",
        ...(query.sort && { sort: query.sort }),
        ...(query.sortBy && { sortBy: query.sortBy }),
        ...(query.status && { status: query.status }),
        ...(query.role && { role: query.role }),
      });

      const response = await axios.get(
        `${this.baseUrl}/clients/${cuid}?${params.toString()}`,
        {
          ...this.axiosConfig,
        }
      );

      return response;
    } catch (error) {
      console.error("Error fetching invitations:", error);
      throw error;
    }
  }

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

  async getInvitationById(
    cuid: string,
    iuid: string
  ): Promise<IInvitationTableData> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${cuid}/${iuid}`,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching invitation by ID:", error);
      throw error;
    }
  }

  async revokeInvitation(
    cuid: string,
    iuid: string,
    revokeData: { reason?: string }
  ) {
    try {
      console.log("Revoking invitation:", { cuid, iuid, revokeData });
      const response = await axios.patch(
        `${this.baseUrl}/${cuid}/revoke/${iuid}`,
        revokeData,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error revoking invitation:", error);
      throw error;
    }
  }

  async resendInvitation(
    cuid: string,
    iuid: string,
    resendData: IResendInvitationData
  ) {
    try {
      const response = await axios.patch(
        `${this.baseUrl}/${cuid}/resend/${iuid}`,
        resendData,
        this.axiosConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error resending invitation:", error);
      throw error;
    }
  }

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

  async validateInvitationCsv(cuid: string, csvFile: File) {
    return withErrorHandling(async () => {
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
    }, "validateInvitationCsv");
  }

  async importInvitationsFromCsv(cuid: string, csvFile: File) {
    return withErrorHandling(async () => {
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
    }, "importInvitationsFromCsv");
  }

  async processValidatedCsv(cuid: string, processId: string) {
    return withErrorHandling(async () => {
      const response = await axios.post(
        `${this.baseUrl}/${cuid}/process_csv`,
        { processId },
        this.axiosConfig
      );
      return response.data;
    }, "processValidatedCsv");
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
