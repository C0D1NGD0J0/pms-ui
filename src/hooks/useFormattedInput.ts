import { useState } from "react";

interface UseFormattedInputProps<T> {
  value: T | undefined | null;
  onChange: (value: T) => void;
  formatForDisplay: (value: T | undefined | null) => string;
  parseFromInput: (input: string) => T;
  validateInput?: (input: string) => boolean;
}

interface UseFormattedInputReturn {
  displayValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Generic hook for formatted inputs (currency, phone, SSN, etc.)
 * Manages local editing state and handles format/parse conversions
 *
 * @example Currency Input
 * const monthlyRent = useFormattedInput({
 *   value: leaseForm.values.fees.monthlyRent,  // 180000 (cents)
 *   onChange: (cents) => leaseForm.setFieldValue("fees.monthlyRent", cents),
 *   formatForDisplay: (cents) => centsToDollars(cents),  // 180000 → "1800.00"
 *   parseFromInput: (str) => dollarsToCents(str),  // "1800" → 180000
 *   validateInput: (str) => /^\d*\.?\d{0,2}$/.test(str),
 * });
 *
 * @example Phone Input
 * const phone = useFormattedInput({
 *   value: form.values.phone,  // "1234567890"
 *   onChange: (val) => form.setFieldValue("phone", val),
 *   formatForDisplay: (val) => formatPhone(val),  // "(123) 456-7890"
 *   parseFromInput: (str) => str.replace(/\D/g, ""),
 *   validateInput: (str) => /^[\d\s()-]*$/.test(str),
 * });
 */
export function useFormattedInput<T>({
  value,
  onChange,
  formatForDisplay,
  parseFromInput,
  validateInput,
}: UseFormattedInputProps<T>): UseFormattedInputReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFocus = (_e: React.FocusEvent<HTMLInputElement>) => {
    // When user focuses input, load current value as editable string
    setIsEditing(true);
    setEditingValue(formatForDisplay(value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Validate input if validator provided
    if (validateInput && !validateInput(input)) {
      return; // Don't update if invalid
    }

    // Update local editing state
    setEditingValue(input);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
    // When user leaves input, parse and save to form
    const parsedValue = parseFromInput(editingValue);
    onChange(parsedValue);
    setIsEditing(false);
  };

  // Show raw editing value while editing, formatted value when not
  const displayValue = isEditing ? editingValue : formatForDisplay(value);

  return {
    displayValue,
    handleChange,
    handleBlur,
    handleFocus,
  };
}
