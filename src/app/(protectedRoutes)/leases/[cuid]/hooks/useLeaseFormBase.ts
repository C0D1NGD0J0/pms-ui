import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { leaseSchema } from "@validations/lease.validations";
import { useCallback, ChangeEvent, useState, useMemo } from "react";
import {
  defaultLeaseFormValues,
  LeaseableProperty,
  PaymentMethodEnum,
  SigningMethodEnum,
  LeaseFormValues,
  LeaseTypeEnum,
  UtilityEnum,
} from "@interfaces/lease.interface";

import { useLeaseableProperties } from "./useLeaseableProperties";

export type LeaseFormBaseProps = {
  initialValues?: LeaseFormValues;
};

const defaultVal: LeaseFormValues = {
  property: {
    id: "68ad1888b4879d5b5db77f0c", // Palm View ResidencesQ
    address: "38 Bourdillon Rd, Ikoyi, Lagos 106104, Lagos, Nigeria",
    unitId: "68ada748db028243e41628fb", // Unit 101
  },
  tenantInfo: {
    email: "tenant@example.com",
  },
  duration: {
    startDate: new Date().toISOString().split("T")[0], // Today
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 1 year from now
    moveInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 1 week from now
  },
  fees: {
    monthlyRent: 2500,
    currency: "USD",
    rentDueDay: 1,
    securityDeposit: 5000,
    lateFeeAmount: 100,
    lateFeeDays: 5,
    lateFeeType: "fixed",
    lateFeePercentage: 5,
    acceptedPaymentMethod: PaymentMethodEnum.E_TRANSFER,
  },
  type: LeaseTypeEnum.FIXED_TERM,
  signingMethod: SigningMethodEnum.ELECTRONIC,
  utilitiesIncluded: [
    UtilityEnum.WATER,
    UtilityEnum.ELECTRICITY,
    UtilityEnum.TRASH,
  ],
  coTenants: [
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1234567890",
      occupation: "Software Engineer",
    },
  ],
  petPolicy: {
    allowed: true,
    types: ["Dogs", "Cats"],
    maxPets: 2,
    deposit: 500,
    monthlyFee: 50,
  },
  renewalOptions: {
    autoRenew: true,
    noticePeriodDays: 60,
    renewalTermMonths: 12,
  },
  internalNotes: "Test lease - preferred tenant with excellent credit history",
  leaseDocument: [],
};
export function useLeaseFormBase({
  initialValues = defaultVal,
}: LeaseFormBaseProps = {}) {
  const [selectedProperty, setSelectedProperty] =
    useState<LeaseableProperty | null>(null);

  const leaseForm = useForm<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >({
    initialValues,
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: zodResolver(leaseSchema),
  });

  // Use TanStack Query to fetch leaseable properties
  const { data: properties = [], isLoading: isLoadingProperties } =
    useLeaseableProperties(true);

  // Get property options for dropdown
  const propertyOptions = useMemo(() => {
    return properties.map((property) => ({
      value: property.id,
      label: `${property.name} - ${property.address}`,
      property,
    }));
  }, [properties]);

  // Get unit options for selected property
  const unitOptions = useMemo(() => {
    if (!selectedProperty || !selectedProperty.units) return [];

    return selectedProperty.units.map((unit) => ({
      value: unit.id,
      label: unit.unitNumber,
      unit,
    }));
  }, [selectedProperty]);

  const handleOnChange = useCallback(
    (
      e:
        | ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | string
        | boolean,
      field?: keyof LeaseFormValues | string
    ) => {
      // Extract the actual value from event or use direct value
      let actualValue: string | boolean;
      let actualField: string | undefined = field;

      if (typeof e === "string" || typeof e === "boolean") {
        actualValue = e;
      } else {
        // It's an event object
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        actualValue = type === "checkbox" ? checked : value;
        actualField = field || name;
      }

      // Update form field value
      if (
        actualField &&
        typeof actualField === "string" &&
        actualField.includes(".")
      ) {
        const [parent, child] = actualField.split(".");
        const parentValue = leaseForm.values[parent as keyof LeaseFormValues];
        if (
          parentValue &&
          typeof parentValue === "object" &&
          !Array.isArray(parentValue)
        ) {
          leaseForm.setFieldValue(parent as any, {
            ...parentValue,
            [child]: actualValue,
          });
        }
      } else if (actualField) {
        leaseForm.setFieldValue(actualField as any, actualValue);
      }

      // Handle property selection - update selected property and populate financial info
      if (actualField === "property.id" && typeof actualValue === "string") {
        const property = properties.find((p) => p.id === actualValue);
        console.log("Property selected:", {
          selectedId: actualValue,
          foundProperty: property,
          hasUnits: property?.units?.length,
          allProperties: properties,
        });
        setSelectedProperty(property || null);

        if (property) {
          leaseForm.setFieldValue("property.address", property.address);

          // Pre-fill financial info from property
          if (property.financialInfo) {
            if (property.financialInfo.monthlyRent) {
              leaseForm.setFieldValue(
                "fees.monthlyRent",
                property.financialInfo.monthlyRent
              );
            }
            if (property.financialInfo.securityDeposit) {
              leaseForm.setFieldValue(
                "fees.securityDeposit",
                property.financialInfo.securityDeposit
              );
            }
            if (property.financialInfo.currency) {
              leaseForm.setFieldValue(
                "fees.currency",
                property.financialInfo.currency
              );
            }
          }
        }
      }

      // Handle unit selection - update financial info if unit has specific fees
      if (
        actualField === "property.unitId" &&
        typeof actualValue === "string"
      ) {
        const unit = selectedProperty?.units?.find((u) => u.id === actualValue);
        if (unit?.financialInfo) {
          if (unit.financialInfo.monthlyRent) {
            leaseForm.setFieldValue(
              "fees.monthlyRent",
              unit.financialInfo.monthlyRent
            );
          }
          if (unit.financialInfo.securityDeposit) {
            leaseForm.setFieldValue(
              "fees.securityDeposit",
              unit.financialInfo.securityDeposit
            );
          }
          if (unit.financialInfo.currency) {
            leaseForm.setFieldValue(
              "fees.currency",
              unit.financialInfo.currency
            );
          }
        }
      }
    },
    [leaseForm, properties, selectedProperty]
  );

  const handleCoTenantChange = useCallback(
    (index: number, field: string, value: string) => {
      const coTenants = [...(leaseForm.values.coTenants || [])];
      if (coTenants[index]) {
        coTenants[index] = {
          ...coTenants[index],
          [field]: value,
        };
        leaseForm.setFieldValue("coTenants", coTenants);
      }
    },
    [leaseForm]
  );

  const addCoTenant = useCallback(() => {
    const coTenants = leaseForm.values.coTenants || [];
    leaseForm.setFieldValue("coTenants", [
      ...coTenants,
      { name: "", email: "", phone: "", occupation: "" },
    ]);
  }, [leaseForm]);

  const removeCoTenant = useCallback(
    (index: number) => {
      const coTenants = leaseForm.values.coTenants || [];
      leaseForm.setFieldValue(
        "coTenants",
        coTenants.filter((_, i) => i !== index)
      );
    },
    [leaseForm]
  );

  const handleUtilityToggle = useCallback(
    (utility: string, checked: boolean) => {
      const utilities = leaseForm.values.utilitiesIncluded || [];
      if (checked) {
        leaseForm.setFieldValue("utilitiesIncluded", [...utilities, utility]);
      } else {
        leaseForm.setFieldValue(
          "utilitiesIncluded",
          utilities.filter((u) => u !== utility)
        );
      }
    },
    [leaseForm]
  );

  return {
    leaseForm,
    handleOnChange,
    properties,
    propertyOptions,
    unitOptions,
    selectedProperty,
    isLoadingProperties,
    handleCoTenantChange,
    addCoTenant,
    removeCoTenant,
    handleUtilityToggle,
  };
}
