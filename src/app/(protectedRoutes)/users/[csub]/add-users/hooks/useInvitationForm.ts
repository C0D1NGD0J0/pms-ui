import { useAuth } from "@store/index";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { invitationService } from "@src/services/invite";
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
