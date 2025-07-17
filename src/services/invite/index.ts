import axios from "@configs/axios";

class InvitationService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/invites`;

  constructor() {}

  async createProperty(
    cuid: string,
    propertyData: Partial<PropertyFormValues>
  ) {
    const formData = this.preProcessPropertyData(propertyData);
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cuid}/add_property`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return result;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }
}

export const inviteService = new InvitationService();
