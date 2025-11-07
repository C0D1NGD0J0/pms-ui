import { useCallback, useState } from "react";

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

  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    sortBy: initialSortBy,
    order: initialOrder,
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

  const handleOrderChange = useCallback(
    (order: "asc" | "desc") => {
      setPagination((prev) => ({
        ...prev,
        order,
      }));
    },
    [pagination]
  );

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
    handleSortDirectionChange: handleOrderChange,
  };
};
