export interface VendorQueryParams {
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
  sortBy?: string;
  sort?: "asc" | "desc";
}
