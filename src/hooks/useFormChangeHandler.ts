import { useCallback, ChangeEvent } from "react";
import { UseFormReturnType } from "@mantine/form";
import {
  LeaseFormValues,
  UtilityEnum,
  CoTenant,
} from "@interfaces/lease.interface";

/**
 * Type for forms compatible with this hook
 * Must have coTenants and utilitiesIncluded fields
 */
export type LeaseFormType = UseFormReturnType<
  LeaseFormValues,
  (values: LeaseFormValues) => LeaseFormValues
>;

/**
 * Reusable hook for handling lease form field changes
 * Supports nested fields (e.g., "duration.endDate") and direct field updates
 */
export function useFormChangeHandler(form: LeaseFormType) {
  const handleOnChange = useCallback(
    (
      e:
        | ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | string
        | boolean,
      field?: string
    ) => {
      let actualValue: string | boolean | number;
      let actualField: string | undefined = field;

      if (typeof e === "string" || typeof e === "boolean") {
        actualValue = e;
      } else {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        actualValue =
          type === "checkbox"
            ? checked
            : type === "number"
              ? Number(value)
              : value;
        actualField = field || name;
      }

      if (actualField && actualField.includes(".")) {
        // Handle nested fields like "duration.endDate"
        const [parent, child] = actualField.split(".");
        const parentKey = parent as keyof LeaseFormValues;
        const parentValue = form.values[parentKey];
        if (
          parentValue &&
          typeof parentValue === "object" &&
          !Array.isArray(parentValue)
        ) {
          form.setFieldValue(parentKey, {
            ...parentValue,
            [child]: actualValue,
          });
        }
      } else if (actualField) {
        // Handle non-nested fields
        const fieldKey = actualField as keyof LeaseFormValues;
        form.setFieldValue(fieldKey, actualValue);
      }
    },
    [form]
  );

  const handleCoTenantChange = useCallback(
    (index: number, field: keyof CoTenant, value: string) => {
      const coTenants: CoTenant[] = [...(form.values.coTenants || [])];
      if (coTenants[index]) {
        coTenants[index] = {
          ...coTenants[index],
          [field]: value,
        };
        form.setFieldValue("coTenants", coTenants);
      }
    },
    [form]
  );

  const addCoTenant = useCallback(() => {
    const coTenants: CoTenant[] = form.values.coTenants || [];
    const newCoTenant: CoTenant = {
      name: "",
      email: "",
      phone: "",
      occupation: "",
      relationship: "",
    };
    form.setFieldValue("coTenants", [...coTenants, newCoTenant]);
  }, [form]);

  const removeCoTenant = useCallback(
    (index: number) => {
      const coTenants: CoTenant[] = form.values.coTenants || [];
      const filtered = coTenants.filter((_, i) => i !== index);
      form.setFieldValue("coTenants", filtered);
    },
    [form]
  );

  const handleUtilityToggle = useCallback(
    (utility: UtilityEnum, checked: boolean) => {
      const utilities: UtilityEnum[] = form.values.utilitiesIncluded || [];
      if (checked) {
        form.setFieldValue("utilitiesIncluded", [...utilities, utility]);
      } else {
        const filtered = utilities.filter((u) => u !== utility);
        form.setFieldValue("utilitiesIncluded", filtered);
      }
    },
    [form]
  );

  return {
    handleOnChange,
    handleCoTenantChange,
    addCoTenant,
    removeCoTenant,
    handleUtilityToggle,
  };
}
