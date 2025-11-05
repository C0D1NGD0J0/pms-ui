import { FilteredUser } from "@interfaces/user.interface";
import {
  aggregateEmployeesByDepartment,
  generateLegendColors,
} from "@utils/employeeUtils";

describe("employeeUtils", () => {
  describe("aggregateEmployeesByDepartment", () => {
    it("should return empty array for empty/null input", () => {
      expect(aggregateEmployeesByDepartment([])).toEqual([]);
      expect(aggregateEmployeesByDepartment(null as any)).toEqual([]);
    });

    it("should aggregate employees by department with correct percentages", () => {
      const employees: FilteredUser[] = [
        {
          uid: "1",
          email: "emp1@test.com",
          displayName: "Employee 1",
          employeeInfo: { department: "IT" },
        } as FilteredUser,
        {
          uid: "2",
          email: "emp2@test.com",
          displayName: "Employee 2",
          employeeInfo: { department: "IT" },
        } as FilteredUser,
        {
          uid: "3",
          email: "emp3@test.com",
          displayName: "Employee 3",
          employeeInfo: { department: "HR" },
        } as FilteredUser,
      ];

      const result = aggregateEmployeesByDepartment(employees);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          { name: "It", value: 2, percentage: 67 },
          { name: "Hr", value: 1, percentage: 33 },
        ])
      );
    });

    it("should assign unassigned department for missing department info", () => {
      const employees: FilteredUser[] = [
        {
          uid: "1",
          email: "emp1@test.com",
          displayName: "Employee 1",
          employeeInfo: { department: "IT" },
        } as FilteredUser,
        {
          uid: "2",
          email: "emp2@test.com",
          displayName: "Employee 2",
        } as FilteredUser,
      ];

      const result = aggregateEmployeesByDepartment(employees);

      expect(result).toEqual(
        expect.arrayContaining([
          { name: "It", value: 1, percentage: 50 },
          { name: "Unassigned", value: 1, percentage: 50 },
        ])
      );
    });

    it("should sort departments by count descending", () => {
      const employees: FilteredUser[] = [
        { uid: "1", employeeInfo: { department: "IT" } } as FilteredUser,
        { uid: "2", employeeInfo: { department: "HR" } } as FilteredUser,
        { uid: "3", employeeInfo: { department: "HR" } } as FilteredUser,
        { uid: "4", employeeInfo: { department: "HR" } } as FilteredUser,
        { uid: "5", employeeInfo: { department: "Finance" } } as FilteredUser,
        { uid: "6", employeeInfo: { department: "Finance" } } as FilteredUser,
      ];

      const result = aggregateEmployeesByDepartment(employees);

      expect(result[0].value).toBe(3); // HR has most
      expect(result[1].value).toBe(2); // Finance second
      expect(result[2].value).toBe(1); // IT last
    });

    it("should capitalize department names correctly", () => {
      const employees: FilteredUser[] = [
        {
          uid: "1",
          employeeInfo: { department: "SALES" },
        } as FilteredUser,
        {
          uid: "2",
          employeeInfo: { department: "marketing" },
        } as FilteredUser,
      ];

      const result = aggregateEmployeesByDepartment(employees);

      expect(result).toEqual(
        expect.arrayContaining([
          { name: "Sales", value: 1, percentage: 50 },
          { name: "Marketing", value: 1, percentage: 50 },
        ])
      );
    });
  });

  describe("generateLegendColors", () => {
    it("should return empty array for 0 length", () => {
      expect(generateLegendColors(0)).toEqual([]);
    });

    it("should generate correct number of colors in HSL format", () => {
      const colors = generateLegendColors(5);

      expect(colors).toHaveLength(5);
      colors.forEach((color) => {
        expect(color).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/);
      });
    });

    it("should generate evenly distributed hue values", () => {
      const colors = generateLegendColors(4);

      const hues = colors.map((color) => {
        const match = color.match(/hsl\((\d+),/);
        return match ? parseInt(match[1]) : 0;
      });

      expect(hues).toEqual([0, 90, 180, 270]);
    });

    it("should vary saturation and lightness levels", () => {
      const colors = generateLegendColors(6);

      const saturations = colors.map((color) => {
        const match = color.match(/hsl\(\d+, (\d+)%,/);
        return match ? parseInt(match[1]) : 0;
      });

      const lightnesses = colors.map((color) => {
        const match = color.match(/hsl\(\d+, \d+%, (\d+)%\)/);
        return match ? parseInt(match[1]) : 0;
      });

      expect(new Set(saturations).size).toBeGreaterThan(1);
      expect(new Set(lightnesses).size).toBeGreaterThan(1);
    });

    it("should produce consistent results for same input", () => {
      expect(generateLegendColors(5)).toEqual(generateLegendColors(5));
    });
  });
});
