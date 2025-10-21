import { useEffect, useState } from "react";
import { userService } from "@services/users";
import { extractChanges } from "@utils/helpers";
import { UseFormReturnType } from "@mantine/form";
import { USER_QUERY_KEYS } from "@utils/constants";
import { useNotification } from "@hooks/useNotification";
import { TenantFormValues } from "@validations/tenant.validations";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { useGetClientTenant } from "./tenantHooks";

export function useTenantEditForm({
  tenantForm,
  cuid,
  uid,
}: {
  tenantForm: UseFormReturnType<TenantFormValues>;
  cuid: string;
  uid: string;
}) {
  const queryClient = useQueryClient();
  const { message } = useNotification();
  const [originalValues, setOriginalValues] = useState<TenantFormValues | null>(
    null
  );

  const { tenant, isLoading: isDataLoading } = useGetClientTenant(cuid, uid, [
    "all",
  ]);

  useEffect(() => {
    if (tenant?.profile && tenant?.tenantInfo) {
      const employerInfo = tenant.tenantInfo.employerInfo || [];
      const clientEmployerInfo = employerInfo.filter(
        (emp: any) => emp.cuid === cuid
      );

      const formValues: TenantFormValues = {
        personalInfo: {
          firstName: tenant.profile.firstName || "",
          lastName: tenant.profile.lastName || "",
          email: tenant.profile.email || "",
          phoneNumber: tenant.profile.phoneNumber || "",
        },
        tenantInfo: {
          employerInfo: clientEmployerInfo.map((emp: any) => ({
            companyName: emp.companyName || "",
            position: emp.position || "",
            monthlyIncome: emp.monthlyIncome || 0,
            contactPerson: emp.contactPerson || "",
            companyAddress: emp.companyAddress || "",
            contactEmail: emp.contactEmail || "",
          })),
          rentalReferences: (tenant.tenantInfo.rentalReferences || []).map(
            (ref: any) => ({
              landlordName: ref.landlordName || "",
              landlordEmail: ref.landlordEmail || "",
              landlordContact: ref.landlordContact || "",
              durationMonths: ref.durationMonths || 0,
              reasonForLeaving: ref.reasonForLeaving || "",
              propertyAddress: ref.propertyAddress || "",
            })
          ),
          pets: (tenant.tenantInfo.pets || []).map((pet: any) => ({
            type: pet.type || "",
            breed: pet.breed || "",
            isServiceAnimal: pet.isServiceAnimal || false,
          })),
          emergencyContact: {
            name: tenant.tenantInfo.emergencyContact?.name || "",
            phone: tenant.tenantInfo.emergencyContact?.phone || "",
            relationship:
              tenant.tenantInfo.emergencyContact?.relationship || "",
            email: tenant.tenantInfo.emergencyContact?.email || "",
          },
        },
      };

      tenantForm.setValues(formValues);
      setOriginalValues(formValues);
    }
  }, [tenant, cuid]);

  const updateTenantMutation = useMutation({
    mutationFn: async (data: Partial<TenantFormValues>) =>
      await userService.updateTenant(cuid, uid, data),
    onSuccess: () => {
      message.success("Tenant updated successfully!");
      queryClient.invalidateQueries({
        queryKey: [`/users/${cuid}/filtered-tenants`],
      });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.getClientTenant(cuid, uid),
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update tenant"
      );
    },
  });

  const handleUpdateSubmit = async (values: TenantFormValues) => {
    if (!originalValues) {
      console.warn("Original values not available for comparison");
      return;
    }

    try {
      const changedValues: Partial<TenantFormValues> | null = extractChanges(
        originalValues,
        values
      );

      if (changedValues && Object.keys(changedValues).length > 0) {
        await updateTenantMutation.mutateAsync(changedValues);
        setOriginalValues(values);
      } else {
        message.info("No changes detected to save.");
      }
    } catch (error) {
      console.error("Error updating tenant:", error);
    }
  };

  return {
    isDataLoading,
    tenantData: tenant,
    isSubmitting: updateTenantMutation.isPending,
    handleUpdate: tenantForm.onSubmit(handleUpdateSubmit),
  };
}
