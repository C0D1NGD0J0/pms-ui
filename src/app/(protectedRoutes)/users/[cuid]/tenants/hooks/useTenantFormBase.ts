import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { zodResolver } from "mantine-form-zod-resolver";
import {
  defaultTenantFormValues,
  tenantFormSchema,
  TenantFormValues,
} from "@validations/tenant.validations";

export function useTenantFormBase({
  initialValues = defaultTenantFormValues,
}: {
  initialValues?: TenantFormValues;
} = {}) {
  const [activeTab, setActiveTab] = useState("personal");

  const tenantForm = useForm<TenantFormValues>({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: false,
    validate: zodResolver(tenantFormSchema),
  });

  const handleNestedChange = useCallback(
    (path: string) => (value: any) => {
      tenantForm.setFieldValue(path as any, value);
    },
    [tenantForm]
  );

  const addEmployerInfo = useCallback(() => {
    const currentEmployers = tenantForm.values.tenantInfo.employerInfo || [];
    tenantForm.setFieldValue("tenantInfo.employerInfo", [
      ...currentEmployers,
      {
        companyName: "",
        position: "",
        monthlyIncome: 0,
        contactPerson: "",
        companyAddress: "",
        contactEmail: "",
      },
    ]);
  }, [tenantForm]);

  const removeEmployerInfo = useCallback(
    (index: number) => {
      const currentEmployers = tenantForm.values.tenantInfo.employerInfo || [];
      tenantForm.setFieldValue(
        "tenantInfo.employerInfo",
        currentEmployers.filter((_, i) => i !== index)
      );
    },
    [tenantForm]
  );

  const addRentalReference = useCallback(() => {
    const currentReferences =
      tenantForm.values.tenantInfo.rentalReferences || [];
    tenantForm.setFieldValue("tenantInfo.rentalReferences", [
      ...currentReferences,
      {
        landlordName: "",
        landlordEmail: "",
        landlordContact: "",
        durationMonths: 0,
        reasonForLeaving: "",
        propertyAddress: "",
      },
    ]);
  }, [tenantForm]);

  const removeRentalReference = useCallback(
    (index: number) => {
      const currentReferences =
        tenantForm.values.tenantInfo.rentalReferences || [];
      tenantForm.setFieldValue(
        "tenantInfo.rentalReferences",
        currentReferences.filter((_, i) => i !== index)
      );
    },
    [tenantForm]
  );

  const addPet = useCallback(() => {
    const currentPets = tenantForm.values.tenantInfo.pets || [];
    tenantForm.setFieldValue("tenantInfo.pets", [
      ...currentPets,
      {
        type: "",
        breed: "",
        isServiceAnimal: false,
      },
    ]);
  }, [tenantForm]);

  const removePet = useCallback(
    (index: number) => {
      const currentPets = tenantForm.values.tenantInfo.pets || [];
      tenantForm.setFieldValue(
        "tenantInfo.pets",
        currentPets.filter((_, i) => i !== index)
      );
    },
    [tenantForm]
  );

  return {
    tenantForm,
    activeTab,
    setActiveTab,
    handleNestedChange,
    addEmployerInfo,
    removeEmployerInfo,
    addRentalReference,
    removeRentalReference,
    addPet,
    removePet,
  };
}
