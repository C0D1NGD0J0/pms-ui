import { useAuth } from "@store/index";
import { useRouter } from "next/navigation";
import { leaseService } from "@services/lease";
import { UseFormReturnType } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "@hooks/useNotification";
import { LeaseFormValues } from "@interfaces/lease.interface";

export function useLeaseForm() {
  const router = useRouter();
  const { client } = useAuth();
  const { openNotification } = useNotification();

  const createLeaseMutation = useMutation({
    mutationFn: (data: Partial<LeaseFormValues>) =>
      leaseService.createLease(client?.cuid || "", data),
    onSuccess: (result) => {
      if (result.data.success) {
        openNotification(
          "success",
          "Lease Created",
          "Lease has been created successfully!"
        );
        router.push("/leases");
      } else {
        openNotification(
          "error",
          "Creation Failed",
          result.data.message || "Failed to create lease"
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create lease. Please try again.";
      openNotification("error", "Creation Failed", errorMessage);
    },
  });

  const handleSubmit = async (
    leaseForm: UseFormReturnType<LeaseFormValues>
  ) => {
    if (!client?.cuid) {
      openNotification("error", "Error", "Client information not found");
      return;
    }

    // Validate form
    const validation = leaseForm.validate();
    if (validation.hasErrors) {
      openNotification(
        "error",
        "Validation Error",
        "Please fix all form errors before submitting"
      );
      return;
    }

    try {
      // Prepare lease data
      const leaseData = {
        ...leaseForm.values,
        // Ensure dates are in correct format
        duration: {
          ...leaseForm.values.duration,
          startDate: leaseForm.values.duration.startDate,
          endDate: leaseForm.values.duration.endDate,
          ...(leaseForm.values.duration.moveInDate && {
            moveInDate: leaseForm.values.duration.moveInDate,
          }),
        },
        // Filter out empty co-tenants
        coTenants: leaseForm.values.coTenants?.filter(
          (ct) => ct.name && ct.email && ct.phone
        ),
      };

      await createLeaseMutation.mutateAsync(leaseData);
    } catch (error) {
      console.error("Error creating lease:", error);
    }
  };

  return {
    isSubmitting: createLeaseMutation.isPending,
    isSuccess: createLeaseMutation.isSuccess,
    isError: createLeaseMutation.isError,
    error: createLeaseMutation.error,
    handleSubmit,
  };
}
