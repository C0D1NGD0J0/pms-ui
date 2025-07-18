import { useAuth } from "@store/index";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { invitationService } from "@src/services/invite";
import { InvitationFormValues } from "@validations/invitation.validations";
import { IInvitationFormData } from "@src/interfaces/invitation.interface";

// Type adapter to convert form values to API format
const transformFormDataToAPIFormat = (
  formData: InvitationFormValues
): Partial<IInvitationFormData> => {
  const transformed: Partial<IInvitationFormData> = {
    personalInfo: formData.personalInfo,
    inviteeEmail: formData.inviteeEmail,
    role: formData.role,
    metadata: formData.metadata,
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

  const sendInvitationMutation = useMutation({
    mutationFn: (data: InvitationFormValues) =>
      invitationService.sendInvite(
        client?.csub || "",
        transformFormDataToAPIFormat(data)
      ),
    onSuccess: (response) => {
      message.success(response.message || "Invitation sent successfully");
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to send invitation");
    },
  });

  const handleSubmit = async (values: InvitationFormValues) => {
    try {
      await sendInvitationMutation.mutateAsync(values);
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
