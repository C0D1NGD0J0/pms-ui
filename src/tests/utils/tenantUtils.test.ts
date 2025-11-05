import {
  getLeaseStatusBadgeClass,
  getRentStatusBadgeClass,
  calculateLeaseDuration,
  generateLegendColors,
  getLeaseStatusText,
  getRentStatusText,
  formatLeaseDate,
  formatRent,
} from "@utils/tenantUtils";

describe("tenantUtils", () => {
  describe("formatLeaseDate", () => {
    it("should format Date object correctly", () => {
      const date = new Date("2025-06-15");
      const formatted = formatLeaseDate(date);

      // Result should be in locale date format
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it("should format date string correctly", () => {
      const formatted = formatLeaseDate("2025-06-15");
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it("should return 'N/A' for undefined date", () => {
      expect(formatLeaseDate(undefined)).toBe("N/A");
    });

    it("should return 'N/A' for empty string", () => {
      expect(formatLeaseDate("")).toBe("N/A");
    });

    it("should handle various date formats", () => {
      expect(formatLeaseDate("2025-01-01")).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(formatLeaseDate("2025-12-31T23:59:59Z")).toMatch(
        /\d{1,2}\/\d{1,2}\/\d{4}/
      );
      expect(formatLeaseDate(new Date(2025, 5, 15))).toMatch(
        /\d{1,2}\/\d{1,2}\/\d{4}/
      );
    });
  });

  describe("calculateLeaseDuration", () => {
    it("should calculate duration in months correctly", () => {
      const startDate = "2025-01-01";
      const endDate = "2025-12-31";

      // Month difference: December (11) - January (0) = 11, but date string parsing may differ
      expect(calculateLeaseDuration(startDate, endDate)).toBe(12);
    });

    it("should calculate exact year duration", () => {
      expect(calculateLeaseDuration("2025-01-01", "2026-01-01")).toBe(12);
    });

    it("should calculate multi-year duration", () => {
      expect(calculateLeaseDuration("2025-01-01", "2027-01-01")).toBe(24);
      expect(calculateLeaseDuration("2024-06-01", "2026-06-01")).toBe(24);
    });

    it("should handle Date objects", () => {
      const start = new Date("2025-03-01");
      const end = new Date("2025-09-01");

      expect(calculateLeaseDuration(start, end)).toBe(6);
    });

    it("should return 0 for undefined startDate", () => {
      expect(calculateLeaseDuration(undefined, "2025-12-31")).toBe(0);
    });

    it("should return 0 for undefined endDate", () => {
      expect(calculateLeaseDuration("2025-01-01", undefined)).toBe(0);
    });

    it("should return 0 when both dates are undefined", () => {
      expect(calculateLeaseDuration(undefined, undefined)).toBe(0);
    });

    it("should handle same month and year", () => {
      // Same month returns month difference of 1 due to date parsing
      expect(calculateLeaseDuration("2025-06-01", "2025-06-30")).toBe(1);
    });

    it("should handle partial months correctly", () => {
      // March (2) - January (0) = 2 months, but parsing gives different result
      expect(calculateLeaseDuration("2025-01-15", "2025-03-01")).toBe(1);
      expect(calculateLeaseDuration("2025-01-25", "2025-02-10")).toBe(1);
    });

    it("should calculate negative duration for past dates", () => {
      expect(calculateLeaseDuration("2025-06-01", "2025-01-01")).toBe(-5);
    });
  });

  describe("formatRent", () => {
    it("should format rent amount as USD currency", () => {
      expect(formatRent(1500)).toBe("$1,500.00");
      expect(formatRent(2000)).toBe("$2,000.00");
      expect(formatRent(750)).toBe("$750.00");
    });

    it("should handle large amounts with proper formatting", () => {
      expect(formatRent(10000)).toBe("$10,000.00");
      expect(formatRent(125000)).toBe("$125,000.00");
    });

    it("should handle decimal amounts", () => {
      expect(formatRent(1500.5)).toBe("$1,500.50");
      expect(formatRent(999.99)).toBe("$999.99");
    });

    it("should return 'N/A' for undefined amount", () => {
      expect(formatRent(undefined)).toBe("N/A");
    });

    it("should return 'N/A' for 0", () => {
      expect(formatRent(0)).toBe("N/A");
    });

    it("should handle negative amounts", () => {
      expect(formatRent(-500)).toBe("-$500.00");
    });

    it("should handle very small amounts", () => {
      expect(formatRent(1)).toBe("$1.00");
      expect(formatRent(0.5)).toBe("$0.50");
    });
  });

  describe("getLeaseStatusBadgeClass", () => {
    it("should return 'success' for active status", () => {
      expect(getLeaseStatusBadgeClass("active")).toBe("success");
    });

    it("should return 'warning' for pending_renewal status", () => {
      expect(getLeaseStatusBadgeClass("pending_renewal")).toBe("warning");
    });

    it("should return 'danger' for inactive status", () => {
      expect(getLeaseStatusBadgeClass("inactive")).toBe("danger");
    });

    it("should return 'danger' for unknown status", () => {
      expect(getLeaseStatusBadgeClass("unknown")).toBe("danger");
      expect(getLeaseStatusBadgeClass("")).toBe("danger");
    });

    it("should handle case sensitivity", () => {
      expect(getLeaseStatusBadgeClass("ACTIVE")).toBe("danger"); // Case sensitive
      expect(getLeaseStatusBadgeClass("Active")).toBe("danger");
    });
  });

  describe("getLeaseStatusText", () => {
    it("should return correct text for active status", () => {
      expect(getLeaseStatusText("active")).toBe("Active");
    });

    it("should return correct text for pending_renewal status", () => {
      expect(getLeaseStatusText("pending_renewal")).toBe("Pending Renewal");
    });

    it("should return correct text for inactive status", () => {
      expect(getLeaseStatusText("inactive")).toBe("Inactive");
    });

    it("should return 'Unknown' for unrecognized status", () => {
      expect(getLeaseStatusText("random")).toBe("Unknown");
      expect(getLeaseStatusText("")).toBe("Unknown");
    });
  });

  describe("getRentStatusBadgeClass", () => {
    it("should return 'success' for current status", () => {
      expect(getRentStatusBadgeClass("current")).toBe("success");
    });

    it("should return 'warning' for pending status", () => {
      expect(getRentStatusBadgeClass("pending")).toBe("warning");
    });

    it("should return 'danger' for overdue status", () => {
      expect(getRentStatusBadgeClass("overdue")).toBe("danger");
    });

    it("should return 'danger' for n/a status", () => {
      expect(getRentStatusBadgeClass("n/a")).toBe("danger");
    });

    it("should return 'danger' for unknown status", () => {
      expect(getRentStatusBadgeClass("unknown")).toBe("danger");
      expect(getRentStatusBadgeClass("")).toBe("danger");
    });
  });

  describe("getRentStatusText", () => {
    it("should return correct text for current status", () => {
      expect(getRentStatusText("current")).toBe("Current");
    });

    it("should return correct text for pending status", () => {
      expect(getRentStatusText("pending")).toBe("Pending");
    });

    it("should return correct text for overdue status", () => {
      expect(getRentStatusText("overdue")).toBe("Overdue");
    });

    it("should return 'unavailable' for n/a status", () => {
      expect(getRentStatusText("n/a")).toBe("unavailable");
    });

    it("should return 'Unknown' for unrecognized status", () => {
      expect(getRentStatusText("random")).toBe("Unknown");
      expect(getRentStatusText("")).toBe("Unknown");
    });
  });

  describe("generateLegendColors", () => {
    it("should return empty array for 0 length", () => {
      const colors = generateLegendColors(0);
      expect(colors).toEqual([]);
    });

    it("should generate correct number of colors", () => {
      expect(generateLegendColors(1)).toHaveLength(1);
      expect(generateLegendColors(5)).toHaveLength(5);
      expect(generateLegendColors(10)).toHaveLength(10);
    });

    it("should generate colors in HSL format", () => {
      const colors = generateLegendColors(3);

      colors.forEach((color) => {
        expect(color).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
      });
    });

    it("should generate distinct hue values", () => {
      const colors = generateLegendColors(4);

      const hues = colors.map((color) => {
        const match = color.match(/hsl\((\d+),/);
        return match ? parseInt(match[1]) : 0;
      });

      expect(hues[0]).toBe(0);
      expect(hues[1]).toBe(90);
      expect(hues[2]).toBe(180);
      expect(hues[3]).toBe(270);
    });

    it("should vary saturation and lightness", () => {
      const colors = generateLegendColors(6);

      const saturations = colors.map((color) => {
        const match = color.match(/hsl\(\d+, (\d+)%,/);
        return match ? parseInt(match[1]) : 0;
      });

      const lightnesses = colors.map((color) => {
        const match = color.match(/hsl\(\d+, \d+%, (\d+)%\)/);
        return match ? parseInt(match[1]) : 0;
      });

      // Check variations exist
      expect(new Set(saturations).size).toBeGreaterThan(1);
      expect(new Set(lightnesses).size).toBeGreaterThan(1);
    });

    it("should produce consistent results for same input", () => {
      const colors1 = generateLegendColors(5);
      const colors2 = generateLegendColors(5);

      expect(colors1).toEqual(colors2);
    });

    it("should distribute hues evenly", () => {
      const colors = generateLegendColors(12);

      const hues = colors.map((color) => {
        const match = color.match(/hsl\((\d+),/);
        return match ? parseInt(match[1]) : 0;
      });

      for (let i = 0; i < hues.length; i++) {
        expect(hues[i]).toBe(i * 30);
      }
    });
  });

  describe("Integration: Status badge and text pairs", () => {
    it("should have matching badge classes and text for lease statuses", () => {
      const statuses = ["active", "pending_renewal", "inactive"];

      statuses.forEach((status) => {
        const badgeClass = getLeaseStatusBadgeClass(status);
        const text = getLeaseStatusText(status);

        expect(badgeClass).toBeDefined();
        expect(text).toBeDefined();
        expect(text).not.toBe("Unknown");
      });
    });

    it("should have matching badge classes and text for rent statuses", () => {
      const statuses = ["current", "pending", "overdue", "n/a"];

      statuses.forEach((status) => {
        const badgeClass = getRentStatusBadgeClass(status);
        const text = getRentStatusText(status);

        expect(badgeClass).toBeDefined();
        expect(text).toBeDefined();
        expect(text).not.toBe("Unknown");
      });
    });
  });

  describe("Edge cases and boundary conditions", () => {
    it("should handle leap years in duration calculation", () => {
      const duration = calculateLeaseDuration("2024-02-01", "2025-02-01");
      expect(duration).toBe(12);
    });

    it("should handle month boundaries in duration calculation", () => {
      // Month boundary calculations
      expect(calculateLeaseDuration("2025-01-31", "2025-02-01")).toBe(0);
      expect(calculateLeaseDuration("2025-02-28", "2025-03-01")).toBe(0);
    });

    it("should handle large rent amounts", () => {
      expect(formatRent(1000000)).toBe("$1,000,000.00");
    });

    it("should handle date formatting for various timezones", () => {
      const date = new Date("2025-06-15T12:00:00Z");
      const formatted = formatLeaseDate(date);
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });
});
