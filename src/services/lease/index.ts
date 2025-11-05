import axios from "@configs/axios";
import { IServerResponse } from "@interfaces/utils.interface";
import { prepareRequestData } from "@utils/formDataTransformer";
import {
  LeaseablePropertiesMetadata,
  LeasePreviewRequest,
  LeaseableProperty,
  LeaseFormValues,
} from "@interfaces/lease.interface";

class LeaseService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/leases`;
  private readonly propertyBaseUrl = `/api/v1/properties`;

  constructor() {}

  async createLease(cuid: string, leaseData: Partial<LeaseFormValues>) {
    try {
      const { data: requestData, headers } = prepareRequestData(leaseData);

      const config = {
        ...this.axiosConfig,
        headers: {
          ...headers,
        },
      };

      const result = await axios.post(
        `${this.baseUrl}/${cuid}/`,
        requestData,
        config
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async previewLeaseTemplate(
    cuid: string,
    leaseData: Partial<LeasePreviewRequest>
  ) {
    try {
      const result = await axios.post<IServerResponse<{ html: string }>>(
        `${this.baseUrl}/${cuid}/preview`,
        leaseData,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async getLeaseableProperties(cuid: string, fetchUnits: boolean = false) {
    try {
      const queryString = fetchUnits ? "?fetchUnits=true" : "";
      const result = await axios.get<
        IServerResponse<{
          items: LeaseableProperty[];
          metadata: LeaseablePropertiesMetadata | null;
        }>
      >(
        `${this.propertyBaseUrl}/${cuid}/leaseable${queryString}`,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export const leaseService = new LeaseService();
