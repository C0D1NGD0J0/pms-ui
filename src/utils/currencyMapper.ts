export interface CurrencyInfo {
  name: string;
  symbol: string;
  icon: string;
}

export const CURRENCY_DICTIONARY: Record<string, CurrencyInfo> = {
  USD: {
    name: "dollar",
    symbol: "$",
    icon: "bx-dollar-circle",
  },
  EUR: {
    name: "euro",
    symbol: "€",
    icon: "bx-euro",
  },
  GBP: {
    name: "pound",
    symbol: "£",
    icon: "bx-pound",
  },
  NGN: {
    name: "naira",
    symbol: "₦",
    icon: "bx-money-withdraw",
  },
  CAD: {
    name: "dollar",
    symbol: "C$",
    icon: "bx-dollar-circle",
  },
};

export const getCurrencyInfo = (currencyCode: string): CurrencyInfo => {
  return (
    CURRENCY_DICTIONARY[currencyCode] || {
      name: "currency",
      symbol: currencyCode,
      icon: "bx-money",
    }
  );
};

export const formatCurrency = (
  amountInCents: number | string,
  currencyCode: string = "USD"
): string => {
  console.log("Formatting currency:", amountInCents, currencyCode);
  if (isNaN(Number(amountInCents))) {
    return "";
  }

  const currencyInfo = getCurrencyInfo(currencyCode);
  const amount = (Number(amountInCents) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currencyInfo.symbol}${amount}`;
};

/**
 * Converts cents to dollars for form display (without currency symbol)
 * @param cents - Amount in cents
 * @returns Formatted string with 2 decimal places (e.g., "1800.00")
 */
export const centsToDollars = (cents: number | undefined | null): string => {
  if (cents === undefined || cents === null || isNaN(Number(cents))) {
    return "";
  }
  return (Number(cents) / 100).toFixed(2);
};

/**
 * Converts dollars to cents for storage
 * @param dollars - Amount in dollars as string or number
 * @returns Amount in cents as number
 */
export const dollarsToCents = (dollars: string | number): number => {
  const amount = typeof dollars === "string" ? parseFloat(dollars) : dollars;
  if (isNaN(amount)) {
    return 0;
  }
  return Math.round(amount * 100);
};
