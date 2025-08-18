import { FilteredUser } from "@interfaces/user.interface";

export interface DepartmentStats {
  name: string;
  value: number;
  percentage: number;
}

export const aggregateEmployeesByDepartment = (
  employees: FilteredUser[]
): DepartmentStats[] => {
  if (!employees || employees.length === 0) {
    return [];
  }

  // Count employees by department
  const departmentCounts: Record<string, number> = {};

  employees.forEach((employee) => {
    const department = employee.employeeInfo?.department || "Unassigned";
    departmentCounts[department] = (departmentCounts[department] || 0) + 1;
  });

  const total = employees.length;

  // Convert to chart data format with percentages
  return Object.entries(departmentCounts)
    .map(([name, value]) => ({
      name: capitalizeFirstLetter(name),
      value,
      percentage: Math.round((value / total) * 100),
    }))
    .sort((a, b) => b.value - a.value); // Sort by count descending
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generate legend colors based on HSL values for better distribution
export const generateLegendColors = (dataLength: number): string[] => {
  const colors: string[] = [];
  const hueStep = 360 / dataLength;

  for (let i = 0; i < dataLength; i++) {
    const hue = Math.round(i * hueStep);
    // Use varying saturation and lightness for better visual distinction
    const saturation = 65 + (i % 3) * 10; // 65%, 75%, 85%
    const lightness = 45 + (i % 2) * 10; // 45%, 55%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};
