import { propertyService } from "@services/property";
import { useTableData } from "@components/Table/hook";
import { IPaginationQuery } from "@interfaces/utils.interface";

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

  const fetchProperties = (pagination: IPaginationQuery) =>
    propertyService.getClientProperties(cuid, pagination);

  const tableData = useTableData({
    queryKeys: ["/properties", cuid],
    fetchFn: fetchProperties,
    paginationConfig: {
      initialLimit: 4,
    },
  });

  return {
    ...tableData,
    filterOptions: sortOptions,
    properties: tableData.data?.items || [],
    totalCount: 15,
  };
};
