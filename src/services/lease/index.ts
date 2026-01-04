import axios from "@configs/axios";
import { buildNestedQuery } from "@src/utils/helpers";
import { IServerResponse } from "@interfaces/utils.interface";
import { prepareRequestData } from "@utils/formDataTransformer";
import { NestedQueryParams } from "@src/interfaces/common.interface";
import {
  LeaseablePropertiesMetadata,
  LeaseDetailResponse,
  LeaseListResponse,
  LeaseableProperty,
  LeaseFormValues,
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

  async updateLease(
    cuid: string,
    luid: string,
    leaseData: Partial<LeaseFormValues>
  ) {
    try {
      const { data: requestData, headers } = prepareRequestData(leaseData);

      const config = {
        ...this.axiosConfig,
        headers: {
          ...headers,
        },
      };

      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/${luid}`,
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

  async previewLeaseHTMLFormat(cuid: string, luid: string) {
    try {
      const result = await axios.get<IServerResponse<{ html: string }>>(
        `${this.baseUrl}/${cuid}/${luid}/preview_lease`,
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

  async signatureRequest(
    cuid: string,
    luid: string,
    action: "send" | "resend" | "cancel"
  ) {
    try {
      const result = await axios.post<
        IServerResponse<{ success: boolean; message: string }>
      >(
        `${this.baseUrl}/${cuid}/${luid}/signature_request`,
        { action },
        this.axiosConfig
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async manuallyActivateLease(
    cuid: string,
    luid: string,
    data: { notes?: string }
  ) {
    try {
      const result = await axios.post<IServerResponse<Lease>>(
        `${this.baseUrl}/${cuid}/${luid}/activate`,
        data,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async terminateLease(
    cuid: string,
    luid: string,
    data: {
      terminationDate: string;
      reason: string;
      refundAmount?: number;
      notes?: string;
    }
  ) {
    try {
      const result = await axios.post<IServerResponse<Lease>>(
        `${this.baseUrl}/${cuid}/${luid}/terminate`,
        data,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async renewLease(cuid: string, luid: string, renewalData: any) {
    try {
      const { data: requestData, headers } = prepareRequestData(renewalData);

      const config = {
        ...this.axiosConfig,
        headers: {
          ...headers,
        },
      };

      const result = await axios.post(
        `${this.baseUrl}/${cuid}/${luid}/lease_renewal`,
        requestData,
        config
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getRenewalFormData(cuid: string, luid: string) {
    try {
      if (!luid) {
        throw new Error("Lease Unique ID (luid) is required");
      }
      const result = await axios.get<IServerResponse<any>>(
        `${this.baseUrl}/${cuid}/${luid}/lease_renewal`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

export const leaseService = new LeaseService();
