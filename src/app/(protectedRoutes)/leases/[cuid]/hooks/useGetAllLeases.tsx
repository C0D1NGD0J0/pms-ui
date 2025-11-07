import { leaseService } from "@services/lease";
import { useQuery } from "@tanstack/react-query";
import { LEASE_QUERY_KEYS } from "@utils/constants";
import { useTableData } from "@components/Table/hook";
import { LeaseStatusEnum } from "@interfaces/lease.interface";

export interface FilterOption {
  label: string;
  value: string;
}

export const useGetLeaseStats = (cuid: string) => {
  return useQuery({
    queryKey: LEASE_QUERY_KEYS.getLeaseStats(cuid),
    queryFn: async () => {
      const response = await leaseService.getLeaseStats(cuid);
      return response;
    },
    enabled: !!cuid,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useGetAllLeases = (cuid: string) => {
  const filterOptions: FilterOption[] = [
    { label: "All Leases", value: "" },
    { label: "Active", value: LeaseStatusEnum.ACTIVE },
    { label: "Draft", value: LeaseStatusEnum.DRAFT },
    { label: "Pending Signature", value: LeaseStatusEnum.PENDING_SIGNATURE },
    { label: "Expired", value: LeaseStatusEnum.EXPIRED },
    { label: "Terminated", value: LeaseStatusEnum.TERMINATED },
  ];

  const sortOptions: FilterOption[] = [
    { label: "All", value: "" },
    { label: "Status", value: "status" },
    { label: "Monthly Rent", value: "fees.monthlyRent" },
    { label: "Date Created", value: "createdAt" },
  ];

  const fetchLeases = async (flatParams: any): Promise<any> => {
    const queryParams = {
      pagination: {
        page: flatParams.page || 1,
        limit: flatParams.limit || 10,
        ...(flatParams.sortBy && { sortBy: flatParams.sortBy }),
        ...(flatParams.order && { order: flatParams.order }),
      },
      filter: {
        ...(flatParams.status && { status: flatParams.status }),
      },
    };

    return await leaseService.getFilteredLeases(cuid, queryParams);
  };

  const tableData = useTableData({
    queryKeys: LEASE_QUERY_KEYS.getFilteredLeases(cuid),
    fetchFn: fetchLeases,
    paginationConfig: {
      initialLimit: 10,
      initialSortBy: "createdAt",
      initialOrder: "desc",
      initialFilters: {
        status: "",
      },
    },
  });

  return {
    ...tableData,
    filterOptions,
    sortOptions,
    leases: tableData.data || [],
    totalCount: tableData.data?.pagination?.total || 0,
  };
};
