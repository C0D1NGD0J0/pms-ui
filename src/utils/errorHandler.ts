import { AxiosError } from "axios";

interface ApiErrorObject {
  key: string;
  value: string;
}

type ApiErrorData = string | ApiErrorObject[];
export type ErrorResponse = {
  success: boolean;
  data: any;
};

type RequestErrorObj = {
  success: boolean;
  type: string;
  error: { data: ApiErrorData };
};
export default class APIError extends Error {
  constructor() {
    super("Api Error: ");
  }

  init = (error: Error) => {
    return this.parseErrorObj(error);
  };

  private parseErrorObj(error: any) {
    if (error instanceof AxiosError) {
      // Handle Axios error
      const { response } = error;
      if (response && response.data) {
        const res = this.parseApiError(response.data);
        return res;
      }
    } else if (error instanceof Error) {
      // Handle generic JavaScript Error
      return this.parseSystemError(error);
    }
  }

  private parseSystemError = (e: Error): ErrorResponse => {
    console.log(`System Error: ${e.name}`);
    return {
      success: false,
      data: e.message,
    };
  };

  private parseApiError = (errorObj: RequestErrorObj) => {
    // Handle the error based on its type and data
    if (errorObj.type === "validationError") {
    }

    if (["serviceError", "authError"].includes(errorObj.type)) {
    }
  };
}
