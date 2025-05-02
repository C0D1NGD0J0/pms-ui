export interface IServerResponse<T> {
  pagination?: IPaginationResponse | null;
  success: boolean;
  msg?: string;
  data: T;
}

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

// Pagination interface
export interface IPaginationResponse {
  total: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
  hasMoreResource: boolean;
}
