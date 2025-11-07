import { PaginationQuery } from "@src/interfaces";
import { propertyService } from "@services/property";
import { CLIENT_QUERY_KEYS } from "@utils/constants";
import { useTableData } from "@components/Table/hook";

export interface FilterOption {
  label: string;
  value: string;
}

export const useGetAllProperties = (cuid: string) => {
  const sortOptions: FilterOption[] = [
    { label: "All", value: "" },
    { label: "Status", value: "status" },
    { label: "Property Name", value: "name" },
    { label: "Date Added", value: "createdAt" },
  ];

  const fetchProperties = async (pagination: PaginationQuery) =>
    await propertyService.getClientProperties(cuid, pagination);

  const tableData = useTableData({
    queryKeys: CLIENT_QUERY_KEYS.getClientProperties(cuid),
    fetchFn: fetchProperties,
    paginationConfig: {
      initialLimit: 5,
    },
  });

  return {
    ...tableData,
    filterOptions: sortOptions,
    properties: tableData.data?.items || [],
    totalCount: tableData.data?.pagination.total || 0,
    handleSortChange: tableData.handleSortDirectionChange,
  };
};
