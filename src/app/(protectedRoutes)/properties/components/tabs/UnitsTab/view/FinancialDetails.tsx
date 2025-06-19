import React from "react";
import { UnitFormValues } from "@interfaces/unit.interface";
import {
  FormField,
  FormInput,
  FormLabel,
  Select,
} from "@components/FormElements";

interface Props {
  unit: UnitFormValues;
  errors: Record<string, any>;
  isTouched: (field: string) => boolean;
  currencyOptions: { value: string; label: string }[];
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export function UnitFinancialInfo({
  unit,
  onFieldChange,
  currencyOptions,
  errors,
  isTouched,
}: Props) {
  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: (errors["fees.currency"] as string) || "",
            touched: isTouched("fees.currency"),
          }}
        >
          <FormLabel htmlFor="unit-currency" label="Currency" />
          <Select
            id="unit-currency"
            name="fees.currency"
            onChange={onFieldChange}
            options={currencyOptions}
            value={unit.fees.currency}
            placeholder="Select currency"
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: (errors["fees.rentAmount"] as string) || "",
            touched: isTouched("fees.rentAmount"),
          }}
        >
          <FormLabel htmlFor="rental-amount" label="Monthly Rent" />
          <FormInput
            type="number"
            id="rental-amount"
            name="fees.rentAmount"
            onChange={onFieldChange}
            value={unit.fees.rentAmount}
            hasError={!!errors["fees.rentAmount"]}
            placeholder="Enter monthly rental amount"
          />
        </FormField>

        <FormField
          error={{
            msg: (errors["fees.securityDeposit"] as string) || "",
            touched: isTouched("fees.securityDeposit"),
          }}
        >
          <FormLabel htmlFor="security-deposit" label="Security Deposit" />
          <FormInput
            type="number"
            id="security-deposit"
            onChange={onFieldChange}
            name="fees.securityDeposit"
            value={unit.fees.securityDeposit}
            hasError={!!errors["fees.securityDeposit"]}
            placeholder="Enter security deposit amount"
          />
        </FormField>
      </div>
    </>
  );
}
