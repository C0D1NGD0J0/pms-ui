import axios from "@configs/axios";
import { prepareRequestData } from "@utils/formDataTransformer";
import { postTransformPropertiesData } from "@/src/models/property";
import {
  IServerResponseWithPagination,
  IPaginationQuery,
  IServerResponse,
} from "@interfaces/utils.interface";
import {
  EditPropertyFormValues,
  ClientPropertyResponse,
  IPropertyFilterParams,
  PropertyFormValues,
  IPropertyDocument,
} from "@interfaces/property.interface";

class PropertyService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/properties`;

  constructor() {}

  async createProperty(
    cuid: string,
    propertyData: Partial<PropertyFormValues>
  ) {
    try {
      const { data: requestData, headers } = prepareRequestData(propertyData);

      const config = {
        ...this.axiosConfig,
        headers: {
          ...headers,
        },
      };

      const result = await axios.post(
        `${this.baseUrl}/${cuid}/add_property`,
        requestData,
        config
      );
      return result;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  }

  async validatePropertiesCSV(cuid: string, file: File) {
    const formData = new FormData();
    formData.append("csv_file", file);
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cuid}/validate_csv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return result;
    } catch (error) {
      console.error("Error validating properties CSV:", error);
      throw error;
    }
  }

  async addMultipleProperties(cuid: string, file: File) {
    const formData = new FormData();
    formData.append("csv_file", file);
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cuid}/import_properties_csv`,
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

  async getClientProperties(
    cuid: string,
    pagination: IPaginationQuery,
    filterQuery?: Partial<IPropertyFilterParams>
  ) {
    try {
      const queryString = this.buildQueryString(filterQuery ?? {}, pagination);
      const result = await axios.get<
        IServerResponseWithPagination<IPropertyDocument[]>
      >(
        `${this.baseUrl}/${cuid}/client_properties?${queryString}`,
        this.axiosConfig
      );
      const transformedData = postTransformPropertiesData(result.data.items);
      return {
        ...result.data,
        items: transformedData,
      };
    } catch (error) {
      console.error("Error fetching client properties:", error);
      throw error;
    }
  }

  async getClientProperty(
    cuid: string,
    propertyPid: string
  ): Promise<ClientPropertyResponse> {
    try {
      const result = await axios.get<IServerResponse<ClientPropertyResponse>>(
        `${this.baseUrl}/${cuid}/client_properties/${propertyPid}?q`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching client property:", error);
      throw error;
    }
  }

  async getPropertyFormMetaData(formType: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/property_form_metadata?formType=${formType}`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching static property form config:", error);
      throw error;
    }
  }

  async getAllStaticData() {
    try {
      const result = await axios.get(
        `${this.baseUrl}/property_form_metadata`,
        this.axiosConfig
      );
      return result.data;
    } catch (error) {
      console.error("Error fetching all static data:", error);
      throw error;
    }
  }

  async updateClientProperty(
    cuid: string,
    pid: string,
    propertyData: Partial<EditPropertyFormValues>
  ) {
    try {
      console.log("Updating property with data:", propertyData);
      const { data: requestData, headers } = prepareRequestData(propertyData);

      const config = {
        ...this.axiosConfig,
        headers: {
          ...headers,
        },
      };
      console.log(config, requestData);
      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/client_properties/${pid}`,
        requestData,
        config
      );
      return result;
    } catch (error) {
      console.error("Error updating client property:", error);
      throw error;
    }
  }

  async deleteClientProperty(cuid: string, pids: string[]) {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cuid}/delete_properties`,
        { pids },
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error updating client property:", error);
      throw error;
    }
  }

  private buildQueryString(
    data: Partial<IPropertyFilterParams>,
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
      ["propertyType", data.propertyType],
      ["status", data.status],
      ["occupancyStatus", data.occupancyStatus],
      ["minPrice", data.minPrice],
      ["maxPrice", data.maxPrice],
      ["searchTerm", data.searchTerm],
      ["minArea", data.minArea],
      ["maxArea", data.maxArea],
      ["minYear", data.minYear],
      ["maxYear", data.maxYear],
    ];

    filterEntries.forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    return params.toString();
  }
}

export const propertyService = new PropertyService();
