import { useState } from "react";
import { userService } from "@src/services";
import { useQuery } from "@tanstack/react-query";

export interface PropertyManagerQueryParams {
  role?: "admin" | "staff" | "manager" | "all";
  department?: "maintenance" | "operations" | "accounting" | "management";
  search?: string;
  page?: number;
  limit?: number;
}

export const useGetClientPropertyManagers = (
  cuid: string,
  initialParams?: PropertyManagerQueryParams
) => {
  const [queryParams, setQueryParams] = useState<PropertyManagerQueryParams>(
    initialParams || {}
  );

  // Define filter options
  const roleOptions = [
    { label: "All", value: "all" },
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Staff", value: "staff" },
  ];

  const departmentOptions = [
    { label: "All", value: "" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Operations", value: "operations" },
    { label: "Accounting", value: "accounting" },
    { label: "Management", value: "management" },
  ];

  const query = useQuery({
    queryKey: ["/property_managers", cuid, queryParams],
    queryFn: async () => {
      const resp = await userService.getClientPropertyManagers(
        cuid,
        queryParams
      );
      return resp;
    },
  });

  const updateQueryParams = (
    newParams: Partial<PropertyManagerQueryParams>
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  const processData = (data: any) => {
    return (
      data?.items?.map((item: any) => ({
        label: item.displayName,
        value: item._id,
      })) || []
    );
  };

  return {
    data: query.data,
    propertyManagers: processData(query.data),
    totalCount: query.data?.pagination?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    queryParams,
    updateQueryParams,
    roleOptions,
    departmentOptions,
  };
};
