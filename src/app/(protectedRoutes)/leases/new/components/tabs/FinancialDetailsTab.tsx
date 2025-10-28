import React from "react";
import {
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

export const FinancialDetailsTab = () => {
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
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="monthlyRent" label="Monthly Rent" required />
          <FormInput
            id="monthlyRent"
            name="fees.monthlyRent"
            type="number"
            onChange={() => {}}
            placeholder="Enter monthly rent"
            value=""
            hasError={false}
            min="0"
            step="0.01"
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
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
            onChange={() => {}}
            placeholder="Enter security deposit"
            value=""
            hasError={false}
            min="0"
            step="0.01"
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
          <FormLabel htmlFor="rentDueDay" label="Rent Due Day" required />
          <FormInput
            id="rentDueDay"
            name="fees.rentDueDay"
            type="number"
            onChange={() => {}}
            placeholder="Day of month (1-31)"
            value=""
            hasError={false}
            min="1"
            max="31"
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="currency" label="Currency" />
          <Select
            id="currency"
            name="fees.currency"
            onChange={() => {}}
            options={currencyOptions}
            value="USD"
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
          <FormLabel htmlFor="paymentMethod" label="Accepted Payment Method" />
          <Select
            id="paymentMethod"
            name="fees.acceptedPaymentMethod"
            onChange={() => {}}
            options={paymentMethodOptions}
            placeholder="Select payment method"
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
          <FormLabel htmlFor="lateFeeAmount" label="Late Fee Amount" />
          <FormInput
            id="lateFeeAmount"
            name="fees.lateFeeAmount"
            type="number"
            onChange={() => {}}
            placeholder="Enter late fee amount"
            value=""
            hasError={false}
            min="0"
            step="0.01"
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
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
            onChange={() => {}}
            placeholder="Days after due date"
            value=""
            hasError={false}
            min="1"
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
          <FormLabel htmlFor="lateFeeType" label="Late Fee Type" />
          <Select
            id="lateFeeType"
            name="fees.lateFeeType"
            onChange={() => {}}
            options={lateFeeTypeOptions}
            placeholder="Select late fee type"
            value=""
          />
        </FormField>
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="lateFeePercentage" label="Late Fee Percentage" />
          <FormInput
            id="lateFeePercentage"
            name="fees.lateFeePercentage"
            type="number"
            onChange={() => {}}
            placeholder="Enter percentage (0-100)"
            value=""
            hasError={false}
            min="0"
            max="100"
            step="0.01"
          />
        </FormField>
      </div>
    </>
  );
};
