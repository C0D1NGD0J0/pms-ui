import React from "react";
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
    </>
  );
};
