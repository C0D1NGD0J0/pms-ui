import axios from "@configs/axios";
import { buildNestedQuery } from "@utils/helpers";
import { UnitFormValues, IUnit } from "@interfaces/unit.interface";
import {
  IServerResponseWithPagination,
  NestedQueryParams,
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

class PropertyUnitService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/properties`;

  constructor() {}

  async createUnits(cuid: string, pid: string, data: ICreateUnitsRequest) {
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cuid}/client_properties/${pid}/units/`,
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
    cuid: string,
    pid: string,
    params?: NestedQueryParams
  ) {
    try {
      const queryString = buildNestedQuery(params || {});
      let url = `${this.baseUrl}/${cuid}/client_properties/${pid}/units`;
      if (queryString) {
        url += `?${queryString}`;
      }

      const result = await axios.get<IServerResponseWithPagination<IUnit[]>>(
        url,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching property units:", error);
      throw error;
    }
  }

  async getUnit(cuid: string, pid: string, unitId: string): Promise<IUnit> {
    try {
      const result = await axios.get<IServerResponse<IUnit>>(
        `${this.baseUrl}/${cuid}/client_properties/${pid}/units/${unitId}`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching unit:", error);
      throw error;
    }
  }

  async updateUnit(cuid: string, pid: string, data: UnitFormValues) {
    try {
      const { puid } = data;
      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/client_properties/${pid}/units/${puid}`,
        data,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error updating unit:", error);
      throw error;
    }
  }

  async archiveUnits(cuid: string, pid: string, data: IArchiveUnitsRequest) {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/client_properties/${pid}/units/archive`,
        data,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error archiving units:", error);
      throw error;
    }
  }

  async deleteUnit(cuid: string, pid: string, unitId: string) {
    try {
      const result = await axios.delete(
        `${this.baseUrl}/${cuid}/client_properties/${pid}/units/${unitId}`,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error deleting unit:", error);
      throw error;
    }
  }
}

export const propertyUnitService = new PropertyUnitService();
