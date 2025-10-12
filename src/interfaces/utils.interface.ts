export interface IServerResponse<T> {
  success: boolean;
  msg?: string;
  data: T;
}

export type IServerResponseWithPagination<T> = {
  success: boolean;
  msg?: string;
  data: {
    items: T;
    pagination: IPaginationResponse;
  };
};

export interface IErrorReturnData {
  success: boolean;
  msg: string;
  errors?: { path: string; message: string }[];
}

export type Theme = "light" | "dark";
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export type IPaginationQuery = {
  page: number;
  limit: number;
  total?: number;
  sortBy?: string;
  sort?: "asc" | "desc" | "";
};

// Generic filter interface that extends pagination
export interface IFilterQuery<TSortBy = string, TStatus = string>
  extends Omit<IPaginationQuery, "sortBy"> {
  status?: TStatus;
  sortBy?: TSortBy;
}

// Pagination interface
export interface IPaginationResponse {
  total: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
  hasMoreResource: boolean;
}

export interface ParsedError {
  message: string;
  fieldErrors: Record<string, string[]>;
  statusCode?: number;
  hasValidationErrors?: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
}
