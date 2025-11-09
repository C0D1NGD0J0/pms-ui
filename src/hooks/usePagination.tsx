import { useCallback, useState } from "react";
import { PaginationQuery } from "@src/interfaces/common.interface";

export interface PaginationConfig {
  initialPage?: number;
  initialLimit?: number;
  initialSortBy?: string;
  initialOrder?: "asc" | "desc";
  initialFilters?: Record<string, any>;
}

export const useTablePagination = (config: PaginationConfig = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialSortBy = "",
    initialOrder = "asc",
    initialFilters = {},
  } = config;

  const [pagination, setPagination] = useState<PaginationQuery>({
    page: initialPage,
    limit: initialLimit,
    sortBy: initialSortBy,
    order: initialOrder as "asc" | "desc" | "",
  });

  const [filters, setFilters] = useState(initialFilters);

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit,
      skip: (prev.page - 1) * limit,
    }));
  }, []);

  const handleSortDirectionChange = useCallback(() => {
    setPagination((prev) => {
      const currentOrder = prev.order || "desc"; // Default to desc if empty/undefined
      const newOrder = currentOrder === "asc" ? "desc" : "asc";
      return {
        ...prev,
        order: newOrder,
      };
    });
  }, []);

  const handleSortByChange = useCallback((sortBy: string) => {
    setPagination((prev) => ({
      ...prev,
      sortBy,
      order: sortBy === "" ? "asc" : prev.order || "desc",
    }));
  }, []);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
    // Reset to first page when filter changes
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  }, []);

  return {
    pagination,
    filters,
    handlePageChange,
    handleLimitChange,
    handleSortByChange,
    handleFilterChange,
    handleSortDirectionChange,
  };
};
