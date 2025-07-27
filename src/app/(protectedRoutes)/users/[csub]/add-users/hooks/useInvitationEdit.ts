import { useAuth } from "@store/index";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { useNotification } from "@hooks/useNotification";
import { invitationService } from "@src/services/invite";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { IInvitationFormData } from "@src/interfaces/invitation.interface";
import {
  sanitizeInvitationFormData,
  InvitationFormValues,
} from "@validations/invitation.validations";

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

  // Handle vendor info with proper type transformation
  if (formData.vendorInfo) {
    transformed.vendorInfo = {
      ...formData.vendorInfo,
      // Only include serviceArea if maxDistance is defined
      serviceArea: formData.vendorInfo.serviceArea?.maxDistance
        ? { maxDistance: formData.vendorInfo.serviceArea.maxDistance }
        : undefined,
    };
  }

  return transformed;
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
