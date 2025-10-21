export interface LeaseStatusStats {
  name: string;
  value: number;
  percentage: number;
}

export interface LeaseDurationStats {
  name: string;
  value: number;
}

/**
 * Format lease date to display format
 */
export const formatLeaseDate = (date?: Date | string): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

/**
 * Calculate lease duration in months
 */
export const calculateLeaseDuration = (
  startDate?: Date | string,
  endDate?: Date | string
): number => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return months;
};

/**
 * Format monthly rent to currency
 */
export const formatRent = (amount?: number): string => {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Get status badge class based on lease status
 */
export const getLeaseStatusBadgeClass = (
  status: string
): "success" | "warning" | "danger" => {
  switch (status) {
    case "active":
      return "success";
    case "pending_renewal":
      return "warning";
    case "inactive":
    default:
      return "danger";
  }
};

/**
 * Get status text for display
 */
export const getLeaseStatusText = (status: string): string => {
  switch (status) {
    case "active":
      return "Active";
    case "pending_renewal":
      return "Pending Renewal";
    case "inactive":
      return "Inactive";
    default:
      return "Unknown";
  }
};

/**
 * Get rent status badge class
 */
export const getRentStatusBadgeClass = (
  status: string
): "success" | "warning" | "danger" | "n/a" => {
  switch (status) {
    case "current":
      return "success";
    case "pending":
      return "warning";
    case "overdue":
    case "n/a":
      return "danger";
    default:
      return "danger";
  }
};

/**
 * Get rent status text for display
 */
export const getRentStatusText = (status: string): string => {
  switch (status) {
    case "current":
      return "Current";
    case "pending":
      return "Pending";
    case "overdue":
      return "Overdue";
    case "n/a":
      return "unavailable";
    default:
      return "Unknown";
  }
};

export const generateLegendColors = (dataLength: number): string[] => {
  const colors: string[] = [];
  const hueStep = 360 / dataLength;

  for (let i = 0; i < dataLength; i++) {
    const hue = Math.round(i * hueStep);
    const saturation = 65 + (i % 3) * 10; // 65%, 75%, 85%
    const lightness = 45 + (i % 2) * 10; // 45%, 55%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};
