import React from "react";
import {
  DatePicker,
  FormField,
  FormLabel,
  Select,
} from "@components/FormElements";

export const LeaseTermsTab = () => {
  const leaseTypeOptions = [
    { value: "", label: "Select lease type" },
    { value: "fixed_term", label: "Fixed Term" },
    { value: "month_to_month", label: "Month to Month" },
  ];

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="leaseType" label="Lease Type" required />
          <Select
            id="leaseType"
            name="type"
            onChange={() => {}}
            options={leaseTypeOptions}
            placeholder="Select lease type"
            value=""
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="startDate" label="Start Date" required />
          <DatePicker
            id="startDate"
            name="duration.startDate"
            onChange={() => {}}
            placeholder="Select start date"
            value={null}
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="endDate" label="End Date" required />
          <DatePicker
            id="endDate"
            name="duration.endDate"
            onChange={() => {}}
            placeholder="Select end date"
            value={null}
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="moveInDate" label="Move-In Date" />
          <DatePicker
            id="moveInDate"
            name="duration.moveInDate"
            onChange={() => {}}
            placeholder="Select move-in date (optional)"
            value={null}
          />
        </FormField>
      </div>
    </>
  );
};
