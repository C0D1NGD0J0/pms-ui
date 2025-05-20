import { IPaginationQuery } from "@interfaces/index";
import { useTablePagination, PaginationConfig } from "@hooks/index";
import { keepPreviousData, useQuery, QueryKey } from "@tanstack/react-query";

interface UseTableDataOptions<T> {
  queryKeys: QueryKey;
  refetchInterval?: number | false;
  paginationConfig?: PaginationConfig;
  fetchFn: (pagination: IPaginationQuery) => Promise<T>;
}

export const useTableData = <TData,>({
  queryKeys,
  fetchFn,
  paginationConfig,
  refetchInterval = false,
}: UseTableDataOptions<TData>) => {
  const {
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSortByChange,
  } = useTablePagination(paginationConfig);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...queryKeys, pagination],
    queryFn: () => fetchFn(pagination),
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
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSortByChange,
  };
};
