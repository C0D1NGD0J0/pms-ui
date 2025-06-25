import { propertyUnitService } from "@services/index";
import { PROPERTY_QUERY_KEYS } from "@utils/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { IPaginationQuery } from "@interfaces/utils.interface";

export function useGetPropertyUnits(
  cid: string,
  pid: string,
  pagination: Omit<IPaginationQuery, "page">
) {
  return useInfiniteQuery({
    queryKey: PROPERTY_QUERY_KEYS.getPropertyUnits(cid, pid, pagination),
    queryFn: async ({ pageParam = 1 }) => {
      if (!cid || !pid) {
        return null;
      }
      const data = await propertyUnitService.getPropertyUnits(cid, pid, {
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
  });
}
