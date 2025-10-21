// Re-export common interfaces for backward compatibility
export type {
  ServerResponse as IServerResponse,
  ServerResponseWithPagination as IServerResponseWithPagination,
  ErrorReturnData as IErrorReturnData,
  Theme,
  ThemeContextType,
  PaginationQuery as IPaginationQuery,
  FilterQuery as IFilterQuery,
  PaginationResponse as IPaginationResponse,
  ParsedError,
  FilterOption,
} from "./common.interface";
