import { useCallback, useState } from "react";
import { propertyService } from "@services/property";
import { IPaginationQuery } from "@interfaces/utils.interface";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IPropertyFilterParams } from "@interfaces/property.interface";

export interface FilterOption {
  label: string;
  value: string;
}

export const useGetAllProperties = (cid: string) => {
  const [pagination, setPagination] = useState<IPaginationQuery>({
    page: 1,
    limit: 3,
    sortBy: "",
    sort: "",
  });
  const [filterParams, setFilterParams] = useState<IPropertyFilterParams>({
    propertyType: "",
    status: "",
    occupancyStatus: "",
    minPrice: "",
    maxPrice: "",
    searchTerm: "",
    minYear: "",
    maxYear: "",
    address: "",
    minArea: "",
    maxArea: "",
  });
  const sortOptions: FilterOption[] = [
    { label: "All", value: "" },
    { label: "Status", value: "status" },
    { label: "Property Name", value: "name" },
    { label: "Date Added", value: "createdAt" },
  ];

  const { data, isLoading, isError, error, refetch } = useQuery({
    refetchInterval: false,
    placeholderData: keepPreviousData,
    queryKey: ["/properties", pagination, cid],
    queryFn: () =>
      propertyService.getClientProperties(cid, filterParams, pagination),
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
      console.log("sort", sort);
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

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  return {
    properties: data?.data || [],
    totalCount: data?.pagination?.total || 0,
    pagination,
    isLoading,
    isError,
    error,
    refetch,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    handleSortByChange,
    handleFilterChange,
    filterValue: filterParams,
    filterOptions: sortOptions,
  };
};
