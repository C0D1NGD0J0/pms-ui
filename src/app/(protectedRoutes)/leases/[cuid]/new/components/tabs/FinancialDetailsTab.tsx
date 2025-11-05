import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { LeaseFormValues } from "@interfaces/lease.interface";
import {
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleOnChange: (e: any, field?: string) => void;
}

export const FinancialDetailsTab = ({ leaseForm, handleOnChange }: Props) => {
  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
  ];

  const paymentMethodOptions = [
    { value: "", label: "Select payment method" },
    { value: "e-transfer", label: "E-Transfer" },
    { value: "credit_card", label: "Credit Card" },
    { value: "crypto", label: "Cryptocurrency" },
  ];

  const lateFeeTypeOptions = [
    { value: "", label: "Select late fee type" },
    { value: "fixed", label: "Fixed Amount" },
    { value: "percentage", label: "Percentage" },
  ];

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors["fees.monthlyRent"] as string) || "",
            touched: leaseForm.isTouched("fees.monthlyRent"),
          }}
        >
          <FormLabel htmlFor="monthlyRent" label="Monthly Rent" required />
          <FormInput
            id="monthlyRent"
            name="fees.monthlyRent"
            type="number"
            onChange={handleOnChange}
            placeholder="Enter monthly rent"
            value={leaseForm.values.fees.monthlyRent?.toString() || ""}
            hasError={!!leaseForm.errors["fees.monthlyRent"]}
            min="0"
            step="0.01"
          />
        </FormField>
        <FormField
          error={{
            msg: (leaseForm.errors["fees.securityDeposit"] as string) || "",
            touched: leaseForm.isTouched("fees.securityDeposit"),
          }}
        >
          <FormLabel
            htmlFor="securityDeposit"
            label="Security Deposit"
            required
          />
          <FormInput
            id="securityDeposit"
            name="fees.securityDeposit"
            type="number"
            onChange={handleOnChange}
            placeholder="Enter security deposit"
            value={leaseForm.values.fees.securityDeposit?.toString() || ""}
            hasError={!!leaseForm.errors["fees.securityDeposit"]}
            min="0"
            step="0.01"
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors["fees.rentDueDay"] as string) || "",
            touched: leaseForm.isTouched("fees.rentDueDay"),
          }}
        >
          <FormLabel htmlFor="rentDueDay" label="Rent Due Day" required />
          <FormInput
            id="rentDueDay"
            name="fees.rentDueDay"
            type="number"
            onChange={handleOnChange}
            placeholder="Day of month (1-31)"
            value={leaseForm.values.fees.rentDueDay?.toString() || ""}
            hasError={!!leaseForm.errors["fees.rentDueDay"]}
            min="1"
            max="31"
          />
        </FormField>
        <FormField
          error={{
            msg: (leaseForm.errors["fees.currency"] as string) || "",
            touched: leaseForm.isTouched("fees.currency"),
          }}
        >
          <FormLabel htmlFor="currency" label="Currency" />
          <Select
            id="currency"
            name="fees.currency"
            onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
              handleOnChange(value, "fees.currency")
            }
            options={currencyOptions}
            value={leaseForm.values.fees.currency || "USD"}
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg:
              (leaseForm.errors["fees.acceptedPaymentMethod"] as string) || "",
            touched: leaseForm.isTouched("fees.acceptedPaymentMethod"),
          }}
        >
          <FormLabel htmlFor="paymentMethod" label="Accepted Payment Method" />
          <Select
            id="paymentMethod"
            name="fees.acceptedPaymentMethod"
            onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
              handleOnChange(value, "fees.acceptedPaymentMethod")
            }
            options={paymentMethodOptions}
            placeholder="Select payment method"
            value={leaseForm.values.fees.acceptedPaymentMethod || ""}
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors["fees.lateFeeAmount"] as string) || "",
            touched: leaseForm.isTouched("fees.lateFeeAmount"),
          }}
        >
          <FormLabel htmlFor="lateFeeAmount" label="Late Fee Amount" />
          <FormInput
            id="lateFeeAmount"
            name="fees.lateFeeAmount"
            type="number"
            onChange={handleOnChange}
            placeholder="Enter late fee amount"
            value={leaseForm.values.fees.lateFeeAmount?.toString() || ""}
            hasError={!!leaseForm.errors["fees.lateFeeAmount"]}
            min="0"
            step="0.01"
          />
        </FormField>
        <FormField
          error={{
            msg: (leaseForm.errors["fees.lateFeeDays"] as string) || "",
            touched: leaseForm.isTouched("fees.lateFeeDays"),
          }}
        >
          <FormLabel
            htmlFor="lateFeeDays"
            label="Late Fee Grace Period (Days)"
          />
          <FormInput
            id="lateFeeDays"
            name="fees.lateFeeDays"
            type="number"
            onChange={handleOnChange}
            placeholder="Days after due date"
            value={leaseForm.values.fees.lateFeeDays?.toString() || ""}
            hasError={!!leaseForm.errors["fees.lateFeeDays"]}
            min="1"
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors["fees.lateFeeType"] as string) || "",
            touched: leaseForm.isTouched("fees.lateFeeType"),
          }}
        >
          <FormLabel htmlFor="lateFeeType" label="Late Fee Type" />
          <Select
            id="lateFeeType"
            name="fees.lateFeeType"
            onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
              handleOnChange(value, "fees.lateFeeType")
            }
            options={lateFeeTypeOptions}
            placeholder="Select late fee type"
            value={leaseForm.values.fees.lateFeeType || ""}
          />
        </FormField>
        <FormField
          error={{
            msg: (leaseForm.errors["fees.lateFeePercentage"] as string) || "",
            touched: leaseForm.isTouched("fees.lateFeePercentage"),
          }}
        >
          <FormLabel htmlFor="lateFeePercentage" label="Late Fee Percentage" />
          <FormInput
            id="lateFeePercentage"
            name="fees.lateFeePercentage"
            type="number"
            onChange={handleOnChange}
            placeholder="Enter percentage (0-100)"
            value={leaseForm.values.fees.lateFeePercentage?.toString() || ""}
            hasError={!!leaseForm.errors["fees.lateFeePercentage"]}
            min="0"
            max="100"
            step="0.01"
          />
        </FormField>
      </div>
    </>
  );
};
