import axios from "@configs/axios";
import { UnitFormValues, IUnit } from "@interfaces/unit.interface";
import {
  IServerResponseWithPagination,
  IPaginationQuery,
  IServerResponse,
} from "@interfaces/utils.interface";

export interface ICreateUnitsRequest {
  units: UnitFormValues[];
}

export interface IUpdateUnitRequest extends Partial<UnitFormValues> {
  unitId: string;
  propertyId: string;
}

export interface IArchiveUnitsRequest {
  unitIds: string[];
}

export interface IUnitFilterParams {
  unitType?: string;
  status?: string;
  floor?: number;
  minRent?: number;
  maxRent?: number;
  minArea?: number;
  maxArea?: number;
  searchTerm?: string;
}

class PropertyUnitService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/properties`;

  constructor() {}

  async createUnits(cid: string, pid: string, data: ICreateUnitsRequest) {
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cid}/client_properties/${pid}/units/`,
        data,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error creating units:", error);
      throw error;
    }
  }

  async getPropertyUnits(
    cid: string,
    pid: string,
    pagination: IPaginationQuery,
    filterQuery?: Partial<IUnitFilterParams>
  ) {
    try {
      const queryString = this.buildQueryString(filterQuery ?? {}, pagination);
      const result = await axios.get<IServerResponseWithPagination<IUnit[]>>(
        `${this.baseUrl}/${cid}/client_properties/${pid}/units?${queryString}`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching property units:", error);
      throw error;
    }
  }

  async getUnit(cid: string, pid: string, unitId: string): Promise<IUnit> {
    try {
      const result = await axios.get<IServerResponse<IUnit>>(
        `${this.baseUrl}/${cid}/client_properties/${pid}/units/${unitId}`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching unit:", error);
      throw error;
    }
  }

  async updateUnit(cid: string, pid: string, data: UnitFormValues) {
    try {
      const { puid } = data;
      const result = await axios.patch(
        `${this.baseUrl}/${cid}/client_properties/${pid}/units/${puid}`,
        data,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error updating unit:", error);
      throw error;
    }
  }

  async archiveUnits(cid: string, pid: string, data: IArchiveUnitsRequest) {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cid}/client_properties/${pid}/units/archive`,
        data,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error archiving units:", error);
      throw error;
    }
  }

  async deleteUnit(cid: string, pid: string, unitId: string) {
    try {
      const result = await axios.delete(
        `${this.baseUrl}/${cid}/client_properties/${pid}/units/${unitId}`,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error deleting unit:", error);
      throw error;
    }
  }

  private buildQueryString(
    data: Partial<IUnitFilterParams>,
    pagination: IPaginationQuery
  ) {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(pagination.sort && { sort: pagination.sort }),
      ...(pagination.sortBy && { sortBy: pagination.sortBy }),
    });

    if (Object.keys(data).length === 0) return params.toString();

    const filterEntries: [string, string | number | null | undefined][] = [
      ["unitType", data.unitType],
      ["status", data.status],
      ["floor", data.floor],
      ["minRent", data.minRent],
      ["maxRent", data.maxRent],
      ["minArea", data.minArea],
      ["maxArea", data.maxArea],
      ["searchTerm", data.searchTerm],
    ];

    filterEntries.forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    return params.toString();
  }
}

export const propertyUnitService = new PropertyUnitService();
