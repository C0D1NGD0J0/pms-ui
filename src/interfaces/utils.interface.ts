// Re-export common interfaces for backward compatibility
export type {
  ServerResponse as IServerResponse,
  ServerResponseWithPagination as IServerResponseWithPagination,
  ErrorReturnData as IErrorReturnData,
  Theme,
  ThemeContextType,
  ParsedError,
  FilterOption,
  NestedQueryParams,
  PaginationQuery,
  FilterParams,
} from "./common.interface";

/**
 * @deprecated Use PaginationQuery from common.interface.ts instead
 * This type is kept for backward compatibility
 */
export type IPaginationQuery = {
  page: number;
  limit: number;
  total?: number;
  sortBy?: string;
  sort?: "asc" | "desc" | "";
};
