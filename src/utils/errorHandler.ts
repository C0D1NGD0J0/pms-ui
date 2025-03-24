import { AxiosError } from "axios";

export type ErrorResponse = {
  success: boolean;
  data: any;
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
        console.log(error, "----ERR---2");
        return response.data;
      }
    } else if (error instanceof Error) {
      console.log(error, "----ERR");
      // Handle generic JavaScript Error
      return this.parseSystemError(error);
    }
    console.log(error, "----ERR---3");
    console.log("No original request found3", error);
  }

  private parseSystemError = (e: Error): ErrorResponse => {
    console.log(`System Error: ${e.name}`);
    return {
      success: false,
      data: e.message,
    };
  };
}
