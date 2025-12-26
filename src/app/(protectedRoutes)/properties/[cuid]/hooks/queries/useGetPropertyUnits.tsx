import { propertyUnitService } from "@services/index";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { NestedQueryParams, PaginationQuery } from "@interfaces/common.interface";
import {
  UseInfiniteQueryOptions,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";

type PropertyUnitsResponse = Awaited<
  ReturnType<typeof propertyUnitService.getPropertyUnits>
>;

export function useGetPropertyUnits(
  cuid: string,
  pid: string,
  pagination: PaginationQuery,
  options?: Partial<
    UseInfiniteQueryOptions<
      PropertyUnitsResponse,
      Error,
      InfiniteData<PropertyUnitsResponse>,
      PropertyUnitsResponse,
      any[],
      number
    >
  >
) {
  const params: NestedQueryParams = {
    pagination: {
      ...pagination,
    },
  };

  return useInfiniteQuery({
    queryKey: PROPERTY_QUERY_KEYS.getPropertyUnits(pid, cuid, params),
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      const queryParams: NestedQueryParams = {
        pagination: {
          ...pagination,
          page: pageParam,
        },
      };
      const data = await propertyUnitService.getPropertyUnits(
        cuid,
        pid,
        queryParams
      );
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.pagination) return undefined;
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!cuid && !!pid,
    ...options,
  });
}
