import {
  formatCurrency,
  getCurrencyInfo,
  CURRENCY_DICTIONARY,
} from "@utils/currencyMapper";

describe("currencyMapper", () => {
  describe("CURRENCY_DICTIONARY", () => {
    it("should have USD currency info", () => {
      expect(CURRENCY_DICTIONARY.USD).toEqual({
        code: "USD",
        symbol: "$",
        icon: "bx-dollar",
        name: "US Dollar",
      });
    });

    it("should have EUR currency info", () => {
      expect(CURRENCY_DICTIONARY.EUR).toEqual({
        code: "EUR",
        symbol: "€",
        icon: "bx-euro",
        name: "Euro",
      });
    });

    it("should have GBP currency info", () => {
      expect(CURRENCY_DICTIONARY.GBP).toEqual({
        code: "GBP",
        symbol: "£",
        icon: "bx-pound",
        name: "British Pound",
      });
    });

    it("should have NGN currency info", () => {
      expect(CURRENCY_DICTIONARY.NGN).toEqual({
        code: "NGN",
        symbol: "₦",
        icon: "bx-money",
        name: "Nigerian Naira",
      });
    });

    it("should have CAD currency info", () => {
      expect(CURRENCY_DICTIONARY.CAD).toEqual({
        code: "CAD",
        symbol: "C$",
        icon: "bx-dollar",
        name: "Canadian Dollar",
      });
    });
  });

  describe("getCurrencyInfo", () => {
    it("should return USD currency info by default", () => {
      const result = getCurrencyInfo();
      expect(result).toEqual(CURRENCY_DICTIONARY.USD);
    });

    it("should return correct currency info for valid code", () => {
      expect(getCurrencyInfo("EUR")).toEqual(CURRENCY_DICTIONARY.EUR);
      expect(getCurrencyInfo("GBP")).toEqual(CURRENCY_DICTIONARY.GBP);
      expect(getCurrencyInfo("NGN")).toEqual(CURRENCY_DICTIONARY.NGN);
      expect(getCurrencyInfo("CAD")).toEqual(CURRENCY_DICTIONARY.CAD);
    });

    it("should return USD for invalid currency code", () => {
      const result = getCurrencyInfo("INVALID");
      expect(result).toEqual(CURRENCY_DICTIONARY.USD);
    });

    it("should be case-sensitive", () => {
      const result = getCurrencyInfo("usd");
      expect(result).toEqual(CURRENCY_DICTIONARY.USD);
    });
  });

  describe("formatCurrency", () => {
    describe("with USD (default)", () => {
      it("should format cents to dollars", () => {
        expect(formatCurrency(250000)).toBe("$2,500.00");
        expect(formatCurrency(100000)).toBe("$1,000.00");
        expect(formatCurrency(50)).toBe("$0.50");
      });

      it("should handle zero", () => {
        expect(formatCurrency(0)).toBe("$0.00");
      });

      it("should handle large amounts", () => {
        expect(formatCurrency(100000000)).toBe("$1,000,000.00");
      });

      it("should handle string input", () => {
        expect(formatCurrency("250000")).toBe("$2,500.00");
      });

      it("should return empty string for invalid input", () => {
        expect(formatCurrency("invalid")).toBe("");
        expect(formatCurrency("abc123")).toBe("");
      });
    });

    describe("with EUR", () => {
      it("should format with Euro symbol", () => {
        expect(formatCurrency(250000, "EUR")).toBe("€2,500.00");
        expect(formatCurrency(100000, "EUR")).toBe("€1,000.00");
      });
    });

    describe("with GBP", () => {
      it("should format with Pound symbol", () => {
        expect(formatCurrency(250000, "GBP")).toBe("£2,500.00");
        expect(formatCurrency(100000, "GBP")).toBe("£1,000.00");
      });
    });

    describe("with NGN", () => {
      it("should format with Naira symbol", () => {
        expect(formatCurrency(250000, "NGN")).toBe("₦2,500.00");
        expect(formatCurrency(100000, "NGN")).toBe("₦1,000.00");
      });
    });

    describe("with CAD", () => {
      it("should format with Canadian Dollar symbol", () => {
        expect(formatCurrency(250000, "CAD")).toBe("C$2,500.00");
        expect(formatCurrency(100000, "CAD")).toBe("C$1,000.00");
      });
    });

    describe("with invalid currency code", () => {
      it("should default to USD", () => {
        expect(formatCurrency(250000, "INVALID")).toBe("$2,500.00");
      });
    });

    describe("decimal precision", () => {
      it("should always show 2 decimal places", () => {
        expect(formatCurrency(100)).toBe("$1.00");
        expect(formatCurrency(150)).toBe("$1.50");
        expect(formatCurrency(125)).toBe("$1.25");
      });
    });

    describe("thousand separators", () => {
      it("should add commas for thousands", () => {
        expect(formatCurrency(1000000)).toBe("$10,000.00");
        expect(formatCurrency(123456789)).toBe("$1,234,567.89");
      });
    });

    describe("negative amounts", () => {
      it("should handle negative values", () => {
        expect(formatCurrency(-250000)).toBe("$-2,500.00");
        expect(formatCurrency(-100000, "EUR")).toBe("€-1,000.00");
      });
    });
  });
});
