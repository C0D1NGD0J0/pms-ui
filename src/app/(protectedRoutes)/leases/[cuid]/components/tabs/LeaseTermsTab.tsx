import React, { useMemo } from "react";
import { UseFormReturnType } from "@mantine/form";
import { LeaseFormValues, LeaseTypeEnum } from "@interfaces/lease.interface";
import {
  DatePicker,
  FormField,
  FormLabel,
  Select,
} from "@components/FormElements";

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleOnChange: (e: any, field?: string) => void;
}

export const LeaseTermsTab = ({ leaseForm, handleOnChange }: Props) => {
  const leaseTypeOptions = [
    { value: "", label: "Select lease type" },
    { value: LeaseTypeEnum.FIXED_TERM, label: "Fixed Term" },
    { value: LeaseTypeEnum.MONTH_TO_MONTH, label: "Month to Month" },
  ];

  const calculateDuration = () => {
    const { startDate, endDate } = leaseForm.values.duration;
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    const days = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (months > 0) {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;

      if (years > 0 && remainingMonths > 0) {
        return `${years} year${years > 1 ? "s" : ""}, ${remainingMonths} month${
          remainingMonths > 1 ? "s" : ""
        }`;
      } else if (years > 0) {
        return `${years} year${years > 1 ? "s" : ""}`;
      } else {
        return `${months} month${months > 1 ? "s" : ""}`;
      }
    } else {
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
  };

  const isFixedTerm = leaseForm.values.type === LeaseTypeEnum.FIXED_TERM;
  const duration = isFixedTerm ? calculateDuration() : null;

  const templateTypeOptions = useMemo(() => {
    const propertyType = leaseForm.values.property.propertyType?.toLowerCase();

    const allTemplates = [
      { value: "", label: "Select lease template" },
      {
        value: "residential-single-family",
        label: "Residential - Single Family Home",
        propertyTypes: ["house", "townhouse"],
      },
      {
        value: "residential-apartment",
        label: "Residential - Apartment/Condo",
        propertyTypes: ["apartment", "condominium", "condo"],
      },
      {
        value: "commercial-office",
        label: "Commercial - Office Space",
        propertyTypes: ["commercial", "industrial"],
      },
      {
        value: "commercial-retail",
        label: "Commercial - Retail/Storefront",
        propertyTypes: ["commercial"],
      },
      {
        value: "short-term-rental",
        label: "Short-Term Rental Agreement",
        propertyTypes: [
          "house",
          "townhouse",
          "apartment",
          "condominium",
          "condo",
        ],
      },
    ];

    // If no property selected or no propertyType, show only residential templates
    if (!propertyType) {
      return allTemplates
        .filter(
          (t) =>
            t.value === "" ||
            t.value.startsWith("residential") ||
            t.value === "short-term-rental"
        )
        .map(({ propertyTypes: _, ...rest }) => rest); // eslint-disable-line @typescript-eslint/no-unused-vars
    }

    // filter templates based on property type (excluding propertyTypes)
    const filtered = allTemplates.filter(
      (template) =>
        !template.propertyTypes || template.propertyTypes.includes(propertyType)
    );

    return filtered.map(({ propertyTypes: _, ...rest }) => rest); // eslint-disable-line @typescript-eslint/no-unused-vars
  }, [leaseForm.values.property.propertyType]);

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors.type as string) || "",
            touched: leaseForm.isTouched("type"),
          }}
        >
          <FormLabel htmlFor="leaseType" label="Lease Type" required />
          <Select
            id="leaseType"
            name="type"
            onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
              handleOnChange(value, "type")
            }
            options={leaseTypeOptions}
            placeholder="Select lease type"
            value={leaseForm.values.type}
          />
        </FormField>

        <FormField
          error={{
            msg: (leaseForm.errors.templateType as string) || "",
            touched: leaseForm.isTouched("templateType"),
          }}
        >
          <FormLabel htmlFor="templateType" label="Lease Template" required />
          <Select
            id="templateType"
            name="templateType"
            onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
              handleOnChange(value, "templateType")
            }
            options={templateTypeOptions}
            placeholder="Select lease template"
            value={leaseForm.values.templateType || ""}
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors["duration.startDate"] as string) || "",
            touched: leaseForm.isTouched("duration.startDate"),
          }}
        >
          <FormLabel htmlFor="startDate" label="Start Date" required />
          <DatePicker
            id="startDate"
            name="duration.startDate"
            onChange={(value) => handleOnChange(value, "duration.startDate")}
            placeholder="Select start date"
            disablePastDates={false}
            value={
              leaseForm.values.duration.startDate
                ? typeof leaseForm.values.duration.startDate === "string"
                  ? leaseForm.values.duration.startDate
                  : leaseForm.values.duration.startDate
                      .toISOString()
                      .split("T")[0]
                : null
            }
          />
        </FormField>
        <FormField
          error={{
            msg: (leaseForm.errors["duration.endDate"] as string) || "",
            touched: leaseForm.isTouched("duration.endDate"),
          }}
        >
          <FormLabel htmlFor="endDate" label="End Date" required />
          <DatePicker
            id="endDate"
            name="duration.endDate"
            onChange={(value) => handleOnChange(value, "duration.endDate")}
            placeholder="Select end date"
            value={
              leaseForm.values.duration.endDate
                ? typeof leaseForm.values.duration.endDate === "string"
                  ? leaseForm.values.duration.endDate
                  : leaseForm.values.duration.endDate
                      .toISOString()
                      .split("T")[0]
                : null
            }
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors["duration.moveInDate"] as string) || "",
            touched: leaseForm.isTouched("duration.moveInDate"),
          }}
        >
          <FormLabel htmlFor="moveInDate" label="Move-In Date" />
          <DatePicker
            id="moveInDate"
            name="duration.moveInDate"
            onChange={(value) => handleOnChange(value, "duration.moveInDate")}
            placeholder="Select move-in date (optional)"
            value={
              leaseForm.values.duration.moveInDate
                ? typeof leaseForm.values.duration.moveInDate === "string"
                  ? leaseForm.values.duration.moveInDate
                  : leaseForm.values.duration.moveInDate
                      .toISOString()
                      .split("T")[0]
                : null
            }
          />
        </FormField>
      </div>

      {/* Display calculated duration for fixed-term leases */}
      {isFixedTerm && duration && (
        <div className="info-banner">
          <i className="bx bx-time-five"></i>
          <div>
            <strong>Lease Duration:</strong> {duration}
          </div>
        </div>
      )}
    </>
  );
};
