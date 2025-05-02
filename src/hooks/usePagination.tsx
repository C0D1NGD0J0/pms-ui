import { useCallback, useState } from "react";
import { IPaginationQuery } from "@interfaces/utils.interface";

export interface PaginationConfig {
  initialPage?: number;
  initialLimit?: number;
  initialSortBy?: string;
  initialSort?: "asc" | "desc" | "";
}

export const useTablePagination = (config: PaginationConfig = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialSortBy = "",
    initialSort = "",
  } = config;

  const [pagination, setPagination] = useState<IPaginationQuery>({
    sort: initialSort,
    page: initialPage,
    limit: initialLimit,
    sortBy: initialSortBy,
  });

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

  const handleSortChange = useCallback(
    (sort: "asc" | "desc") => {
      if (pagination.sortBy === "") {
        return;
      }
      setPagination((prev) => ({
        ...prev,
        sort,
      }));
    },
    [pagination.sortBy]
  );

  const handleSortByChange = useCallback((sortBy: string) => {
    setPagination((prev) => ({
      ...prev,
      ...(sortBy === "" ? { sortBy: "", sort: "" } : {}),
      ...(sortBy !== "" && prev.sort === "" ? { sortBy, sort: "desc" } : {}),
    }));
  }, []);

  return {
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSortByChange,
  };
};
