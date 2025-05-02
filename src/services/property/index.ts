import axios from "@configs/axios";
import { IPaginationQuery, IServerResponse } from "@interfaces/utils.interface";
import {
  IPropertyFilterParams,
  PropertyFormValues,
  IProperty,
} from "@interfaces/property.interface";

class PropertyService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/properties`;

  constructor() {}

  async createProperty(cid: string, propertyData: Partial<PropertyFormValues>) {
    const formData = this.preProcessPropertyData(propertyData);
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cid}/add_property`,
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

  async validatePropertiesCSV(cid: string, file: File) {
    const formData = new FormData();
    formData.append("csv_file", file);
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cid}/validate_csv`,
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

  async addMultipleProperties(cid: string, file: File) {
    const formData = new FormData();
    formData.append("csv_file", file);
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cid}/import_properties_csv`,
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
    cid: string,
    pagination: IPaginationQuery,
    filterQuery?: Partial<IPropertyFilterParams>
  ) {
    try {
      const queryString = this.buildQueryString(filterQuery ?? {}, pagination);
      const result = await axios.get<IServerResponse<IProperty[]>>(
        `${this.baseUrl}/${cid}/client_properties?${queryString}`,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error fetching client properties:", error);
      throw error;
    }
  }

  async getClientProperty(cid: string, propertyId: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cid}/client_property/${propertyId}`,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error fetching clientproperty:", error);
      throw error;
    }
  }

  async getPropertyFormMetaData() {
    try {
      const result = await axios.get(
        `${this.baseUrl}/property_form_metadata`,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error fetching static property form config:", error);
      throw error;
    }
  }

  async updateClientProperty(
    cid: string,
    pid: string,
    propertyData: Partial<PropertyFormValues>
  ) {
    try {
      const result = await axios.put(
        `${this.baseUrl}/${cid}/client_property/${pid}`,
        propertyData,
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error updating client property:", error);
      throw error;
    }
  }

  async deleteClientProperty(cid: string, pids: string[]) {
    try {
      const result = await axios.patch(
        `${this.baseUrl}/${cid}/delete_properties`,
        { pids },
        this.axiosConfig
      );
      return result;
    } catch (error) {
      console.error("Error updating client property:", error);
      throw error;
    }
  }

  private preProcessPropertyData(propertyData: Partial<PropertyFormValues>) {
    const formData = new FormData();

    if (propertyData.name) formData.append("name", propertyData.name);
    if (propertyData.totalUnits)
      formData.append("totalUnits", propertyData.totalUnits.toString());
    if (propertyData.propertyType)
      formData.append("propertyType", propertyData.propertyType);
    if (propertyData.status) formData.append("status", propertyData.status);
    if (propertyData.managedBy)
      formData.append("managedBy", propertyData.managedBy);
    if (propertyData.yearBuilt !== undefined)
      formData.append("yearBuilt", propertyData.yearBuilt.toString());
    if (propertyData.address?.fullAddress)
      formData.append("address.fullAddress", propertyData.address.fullAddress);

    if (propertyData.occupancyStatus)
      formData.append("occupancyStatus", propertyData.occupancyStatus);

    if (propertyData.financialDetails) {
      const { financialDetails } = propertyData;
      if (financialDetails.purchasePrice !== undefined)
        formData.append(
          "financialDetails[purchasePrice]",
          financialDetails.purchasePrice.toString()
        );
      if (financialDetails.purchaseDate)
        formData.append(
          "financialDetails[purchaseDate]",
          financialDetails.purchaseDate
        );
      if (financialDetails.marketValue !== undefined)
        formData.append(
          "financialDetails[marketValue]",
          financialDetails.marketValue.toString()
        );
      if (financialDetails.propertyTax !== undefined)
        formData.append(
          "financialDetails[propertyTax]",
          financialDetails.propertyTax.toString()
        );
      if (financialDetails.lastAssessmentDate)
        formData.append(
          "financialDetails[lastAssessmentDate]",
          financialDetails.lastAssessmentDate
        );
    }

    if (propertyData.specifications) {
      const { specifications } = propertyData;
      if (specifications.totalArea !== undefined)
        formData.append(
          "specifications[totalArea]",
          specifications.totalArea.toString()
        );
      if (specifications.lotSize !== undefined)
        formData.append(
          "specifications[lotSize]",
          specifications.lotSize.toString()
        );
      if (specifications.bedrooms !== undefined)
        formData.append(
          "specifications[bedrooms]",
          specifications.bedrooms.toString()
        );
      if (specifications.bathrooms !== undefined)
        formData.append(
          "specifications[bathrooms]",
          specifications.bathrooms.toString()
        );
      if (specifications.floors !== undefined)
        formData.append(
          "specifications[floors]",
          specifications.floors.toString()
        );
      if (specifications.garageSpaces !== undefined)
        formData.append(
          "specifications[garageSpaces]",
          specifications.garageSpaces.toString()
        );
      if (specifications.maxOccupants !== undefined)
        formData.append(
          "specifications[maxOccupants]",
          specifications.maxOccupants.toString()
        );
    }

    if (propertyData.utilities) {
      const { utilities } = propertyData;
      if (utilities.water !== undefined)
        formData.append("utilities[water]", utilities.water.toString());
      if (utilities.gas !== undefined)
        formData.append("utilities[gas]", utilities.gas.toString());
      if (utilities.electricity !== undefined)
        formData.append(
          "utilities[electricity]",
          utilities.electricity.toString()
        );
      if (utilities.internet !== undefined)
        formData.append("utilities[internet]", utilities.internet.toString());
      if (utilities.trash !== undefined)
        formData.append("utilities[trash]", utilities.trash.toString());
      if (utilities.cableTV !== undefined)
        formData.append("utilities[cableTV]", utilities.cableTV.toString());
    }

    if (propertyData.description) {
      if (propertyData.description.text)
        formData.append("description[text]", propertyData.description.text);
      if (propertyData.description.html)
        formData.append("description[html]", propertyData.description.html);
    }

    if (propertyData.interiorAmenities) {
      const { interiorAmenities } = propertyData;
      Object.entries(interiorAmenities).forEach(([key, value]) => {
        if (value !== undefined)
          formData.append(`interiorAmenities[${key}]`, value.toString());
      });
    }

    if (propertyData.communityAmenities) {
      const { communityAmenities } = propertyData;
      Object.entries(communityAmenities).forEach(([key, value]) => {
        if (value !== undefined)
          formData.append(`communityAmenities[${key}]`, value.toString());
      });
    }

    if (propertyData.propertyImages && propertyData.propertyImages.length > 0) {
      propertyData.propertyImages.forEach((file) => {
        if (file instanceof File) {
          formData.append(`propertyImages`, file);
        }
      });
    }

    if (propertyData.documents && propertyData.documents.length > 0) {
      propertyData.documents.forEach((doc, index) => {
        if (doc.documentType)
          formData.append(
            `documents[${index}][documentType]`,
            doc.documentType
          );
        if (doc.description)
          formData.append(`documents[${index}][description]`, doc.description);
        if (doc.externalUrl)
          formData.append(`documents[${index}][externalUrl]`, doc.externalUrl);
        if (doc.file instanceof File) {
          formData.append(`documents[${index}][file]`, doc.file);
        }
      });
    }

    return formData;
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
