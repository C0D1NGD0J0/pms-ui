import { propertyService } from "@services/property";
import { CLIENT_QUERY_KEYS } from "@utils/constants";
import { useTableData } from "@components/Table/hook";
import { FilterOption } from "@interfaces/common.interface";

export const useGetAllProperties = (cuid: string) => {
  const sortOptions: FilterOption[] = [
    { label: "All", value: "" },
    { label: "Status", value: "status" },
    { label: "Property Name", value: "name" },
    { label: "Date Added", value: "createdAt" },
  ];

  const fetchProperties = async (params: any) => {
    const queryParams = {
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.order && { order: params.order }),
      },
      filter: {
        ...params.filter,
      },
    };
    return await propertyService.getClientProperties(cuid, queryParams);
  };

  const tableData = useTableData({
    queryKeys: CLIENT_QUERY_KEYS.getClientProperties(cuid),
    fetchFn: fetchProperties,
    paginationConfig: {
      initialLimit: 6,
    },
  });

  return {
    ...tableData,
    filterOptions: sortOptions,
    properties: tableData.data?.items || [],
    totalCount: tableData.data?.pagination.total || 0,
  };
};
