import axios from "@configs/axios";

export interface ITemplateMetadata {
  templateType: string;
  displayName: string;
  description: string;
  htmlContent: string;
  textContent: string;
  layout: {
    htmlLayout: string;
    textLayout: string;
  };
  requiredVariables: string[];
  optionalVariables: string[];
  supportsCustomMessage: boolean;
}

export interface ITemplateListItem {
  templateType: string;
  displayName: string;
  description: string;
}

class EmailTemplateService {
  private axiosConfig = {};
  private readonly baseUrl = `/api/v1/email-templates`;

  constructor() {}

  async getTemplateList(cuid: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cuid}/`,
        undefined,
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error fetching template list:", error);
      throw error;
    }
  }

  async getTemplateMetadata(cuid: string, templateType: string) {
    try {
      const result = await axios.get(
        `${this.baseUrl}/${cuid}/${templateType}`,
        undefined,
        this.axiosConfig
      );
      return result.data.data;
    } catch (error) {
      console.error("Error fetching template metadata:", error);
      throw error;
    }
  }

  async renderTemplate(
    cuid: string,
    templateType: string,
    variables: Record<string, any>
  ) {
    try {
      const result = await axios.post(
        `${this.baseUrl}/${cuid}/${templateType}/render`,
        variables,
        this.axiosConfig
      );

      const responseData = result.data;
      if (!responseData.renderedHtml) {
        throw new Error(
          `Template rendering failed: missing renderedHtml in response. Got: ${JSON.stringify(
            responseData
          )}`
        );
      }

      return responseData;
    } catch (error) {
      console.error("Error rendering template:", error);
      if (error instanceof Error) {
        throw new Error(
          `Template rendering failed for ${templateType}: ${error.message}`
        );
      }

      throw error;
    }
  }
}

export const emailTemplateService = new EmailTemplateService();
