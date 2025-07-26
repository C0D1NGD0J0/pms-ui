import { invitationService } from "@services/invite";
import { useTableData } from "@components/Table/hook";
import { IPaginationQuery } from "@interfaces/utils.interface";
import { IInvitationQuery, IUserRole } from "@interfaces/invitation.interface";

export interface FilterOption {
  label: string;
  value: string;
}

export const useGetInvitations = (cuid: string) => {
  const sortOptions: FilterOption[] = [
    { label: "All", value: "" },
    { label: "Status", value: "status" },
    { label: "Email", value: "inviteeEmail" },
    { label: "Date Invited", value: "createdAt" },
  ];

  const fetchInvitations = (
    pagination: IPaginationQuery & {
      status?: IInvitationQuery["status"];
      role?: IUserRole;
    }
  ) => {
    const invitationQuery: IInvitationQuery = {
      page: pagination.page,
      limit: pagination.limit,
      sort: pagination.sort,
      sortBy: pagination.sortBy as "createdAt" | "inviteeEmail" | "status",
      ...(pagination?.status && { status: pagination.status }),
      ...(pagination?.role && { role: pagination.role }),
    };

    return invitationService.getInvitations(cuid, invitationQuery);
  };

  const tableData = useTableData({
    queryKeys: [`/invitations/${cuid}`, cuid],
    fetchFn: fetchInvitations,
    paginationConfig: {
      initialLimit: 5,
    },
  });

  return {
    filterOptions: sortOptions,
    pagination: tableData?.pagination || {},
    invitations: tableData.data?.data || [],
    handleSortChange: tableData.handleSortChange,
    handlePageChange: tableData.handlePageChange,
    totalCount: tableData.data?.pagination.total || 0,
    handleSortByChange: tableData.handleSortByChange,
  };
};
