import { useAuth } from "@src/store";
import { invitationService } from "@services/invite";
import { useTableData } from "@components/Table/hook";
import { useNotification, useErrorHandler } from "@src/hooks";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { IPaginationQuery, FilterOption } from "@interfaces/utils.interface";
import {
  sanitizeInvitationFormData,
  InvitationFormValues,
} from "@src/validations";
import {
  IInvitationFormData,
  IInvitationQuery,
  IUserRole,
} from "@interfaces/invitation.interface";

const transformFormDataToAPIFormat = (
  formData: InvitationFormValues
): Partial<IInvitationFormData> => {
  const transformed: Partial<IInvitationFormData> = {
    personalInfo: formData.personalInfo,
    inviteeEmail: formData.inviteeEmail,
    role: formData.role,
    metadata: formData.metadata,
    status: formData.status,
    employeeInfo: formData.employeeInfo,
  };

  if (formData.vendorInfo) {
    transformed.vendorInfo = {
      ...formData.vendorInfo,
      serviceArea: formData.vendorInfo.serviceArea?.maxDistance
        ? { maxDistance: formData.vendorInfo.serviceArea.maxDistance }
        : undefined,
    };
  }

  if (formData.tenantInfo) {
    transformed.tenantInfo = formData.tenantInfo;
  }

  return transformed;
};

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

export function useInvitationEdit() {
  const { client } = useAuth();
  const { message } = useNotification();
  const { handleValidationError } = useErrorHandler();
  const queryClient = useQueryClient();

  const updateInvitationMutation = useMutation({
    mutationFn: ({
      iuid,
      data,
    }: {
      iuid: string;
      data: InvitationFormValues;
    }) =>
      invitationService.updateInvitation(
        client?.cuid || "",
        iuid,
        transformFormDataToAPIFormat(data)
      ),
    onSuccess: (response) => {
      message.success(response.message || "Invitation updated successfully");
      queryClient.invalidateQueries({
        queryKey: [`/invitations/${client?.cuid}`, client?.cuid],
      });
    },
    onError: (error: any) => {
      handleValidationError(error);
    },
  });

  const handleUpdate = async (iuid: string, values: InvitationFormValues) => {
    try {
      const sanitizedData = sanitizeInvitationFormData(values);
      await updateInvitationMutation.mutateAsync({ iuid, data: sanitizedData });
    } catch (error) {
      console.error("Error updating invitation:", error);
    }
  };

  return {
    handleUpdate,
    isUpdating: updateInvitationMutation.isPending,
    updateError: updateInvitationMutation.error,
    isSuccess: updateInvitationMutation.isSuccess,
  };
}

export function useInvitationForm() {
  const { client } = useAuth();
  const { message } = useNotification();
  const { handleValidationError } = useErrorHandler();

  const sendInvitationMutation = useMutation({
    mutationFn: (data: InvitationFormValues) =>
      invitationService.sendInvite(
        client?.cuid || "",
        transformFormDataToAPIFormat(data)
      ),
    onSuccess: (response) => {
      message.success(response.message || "Invitation sent successfully");
    },
    onError: (error: any) => {
      handleValidationError(error);
    },
  });

  const handleSubmit = async (values: InvitationFormValues) => {
    try {
      const sanitizedData = sanitizeInvitationFormData(values);
      await sendInvitationMutation.mutateAsync(sanitizedData);
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  };

  return {
    handleSubmit,
    isSubmitting: sendInvitationMutation.isPending,
    submitError: sendInvitationMutation.error,
    isSuccess: sendInvitationMutation.isSuccess,
  };
}
