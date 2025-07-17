import { useAuth } from "@store/index";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { InvitationFormValues } from "@validations/invitation.validations";

// TODO: Replace with actual service when available
const invitationService = {
  sendInvitation: async (data: InvitationFormValues & { cuid: string }) => {
    // Mock API call - replace with actual service
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Sending invitation:", data);
    return { success: true, message: "Invitation sent successfully" };
  },
};

export function useInvitationForm() {
  const { client } = useAuth();
  const { message } = useNotification();

  const sendInvitationMutation = useMutation({
    mutationFn: (data: InvitationFormValues) =>
      invitationService.sendInvitation({
        ...data,
        cuid: client?.csub ?? "",
      }),
    onSuccess: (response) => {
      message.success(response.message || "Invitation sent successfully");
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to send invitation");
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: (data: InvitationFormValues) => {
      // Mock save draft - replace with actual service
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Saving draft:", data);
          resolve({ success: true, message: "Draft saved successfully" });
        }, 500);
      });
    },
    onSuccess: () => {
      message.success("Draft saved successfully");
    },
    onError: (error: any) => {
      message.error(error.message || "Failed to save draft");
    },
  });

  const handleSubmit = async (values: InvitationFormValues) => {
    try {
      await sendInvitationMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  };

  const handleSaveDraft = async (values: InvitationFormValues) => {
    try {
      await saveDraftMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  return {
    handleSubmit,
    handleSaveDraft,
    isSubmitting: sendInvitationMutation.isPending,
    isSavingDraft: saveDraftMutation.isPending,
    submitError: sendInvitationMutation.error,
    draftError: saveDraftMutation.error,
    isSuccess: sendInvitationMutation.isSuccess,
    isDraftSuccess: saveDraftMutation.isSuccess,
  };
}
