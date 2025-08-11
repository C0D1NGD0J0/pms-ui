import { propertyUnitService } from "@services/index";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { IPaginationQuery } from "@interfaces/utils.interface";
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
  pagination: Omit<IPaginationQuery, "page">,
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
  return useInfiniteQuery({
    queryKey: PROPERTY_QUERY_KEYS.getPropertyUnits(cuid, pid, pagination),
    queryFn: async ({ pageParam = 1 }: { pageParam: number }) => {
      const data = await propertyUnitService.getPropertyUnits(cuid, pid, {
        ...pagination,
        page: pageParam,
      });
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
