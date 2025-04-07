export type InsightCardData = {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: "up" | "down" | "none";
    period?: string;
  };
  description?: React.ReactNode;
};
