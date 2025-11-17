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
