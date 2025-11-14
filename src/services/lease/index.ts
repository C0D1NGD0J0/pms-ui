import axios from "@configs/axios";
import { buildNestedQuery } from "@src/utils/helpers";
import { IServerResponse } from "@interfaces/utils.interface";
import { prepareRequestData } from "@utils/formDataTransformer";
import { NestedQueryParams } from "@src/interfaces/common.interface";
import {
  LeaseablePropertiesMetadata,
  LeasePreviewRequest,
  LeaseListResponse,
  LeaseableProperty,
  LeaseFormValues,
  LeaseDetailResponse,
  LeaseStats,
  Lease,
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

  async getLeaseByLuid(
    cuid: string,
    luid: string,
    filters?: NestedQueryParams
  ) {
    try {
      const queryString = buildNestedQuery(filters || {});
      if (!luid) {
        throw new Error("Lease Unique ID (luid) is required");
      }
      let url = `${this.baseUrl}/${cuid}/${luid}`;
      if (queryString) {
        url += `?${queryString}`;
      }
      const result = await axios.get<LeaseDetailResponse>(
        url,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async getFilteredLeases(cuid: string, params?: NestedQueryParams) {
    try {
      const queryString = buildNestedQuery(params || {});

      let url = `${this.baseUrl}/${cuid}`;
      if (queryString) {
        url += `?${queryString}`;
      }

      const result = await axios.get<LeaseListResponse>(url, this.axiosConfig);
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async getLeaseStats(cuid: string, params?: NestedQueryParams) {
    try {
      const queryString = buildNestedQuery(params || {});
      let url = `${this.baseUrl}/${cuid}/stats`;
      if (queryString) {
        url += `?${queryString}`;
      }

      const result = await axios.get<IServerResponse<LeaseStats>>(
        url,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getExpiringLeases(cuid: string, days: number = 30) {
    try {
      const result = await axios.get<IServerResponse<Lease[]>>(
        `${this.baseUrl}/${cuid}/expiring?days=${days}`,
        this.axiosConfig
      );
      return result.data;
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

  async previewLeaseHTMLFormat(cuid: string, luid: string) {
    try {
      const result = await axios.get<IServerResponse<{ html: string }>>(
        `${this.baseUrl}/${cuid}/${luid}/preview`,
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
