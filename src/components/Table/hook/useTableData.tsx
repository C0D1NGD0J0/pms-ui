import { PaginationQuery } from "@src/interfaces";
import { FilterParams } from "@src/interfaces/common.interface";
import { useTablePagination, PaginationConfig } from "@hooks/index";
import { keepPreviousData, useQuery, QueryKey } from "@tanstack/react-query";

interface UseTableDataOptions<T> {
  queryKeys: QueryKey;
  refetchInterval?: number | false;
  paginationConfig?: PaginationConfig;
  fetchFn: (pagination: PaginationQuery & FilterParams) => Promise<T>;
}

export const useTableData = <TData,>({
  queryKeys,
  fetchFn,
  paginationConfig,
  refetchInterval = false,
}: UseTableDataOptions<TData>) => {
  const {
    pagination,
    filters,
    handlePageChange,
    handleLimitChange,
    handleSortDirectionChange,
    handleSortByChange,
    handleFilterChange,
  } = useTablePagination(paginationConfig);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...queryKeys, pagination, filters],
    queryFn: () => fetchFn({ ...pagination, ...filters }),
    refetchInterval,
    placeholderData: keepPreviousData,
  });
  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    pagination,
    filters,
    handlePageChange,
    handleLimitChange,
    handleSortDirectionChange,
    handleSortByChange,
    handleFilterChange,
  };
};
