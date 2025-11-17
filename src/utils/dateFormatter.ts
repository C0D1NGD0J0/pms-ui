import {
  formatDistanceToNow,
  isYesterday,
  isTomorrow,
  parseISO,
  isToday,
  isValid,
  format,
} from "date-fns";

export type DateDisplayFormat = "shortMonth" | "full" | "numeric" | "relative";

interface DateFormatterOptions {
  displayFormat: DateDisplayFormat;
  locale?: string;
}

export const formatDate = (
  date: string | Date | null | undefined,
  options: DateFormatterOptions
): string => {
  const { displayFormat } = options;

  if (!date) return "--";

  let dateObj: Date;
  try {
    dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "Invalid Date";
  } catch {
    return "Invalid Date";
  }

  switch (displayFormat) {
    case "shortMonth":
      return format(dateObj, "MMM d, yyyy");

    case "full":
      return format(dateObj, "MMMM d, yyyy");

    case "numeric":
      return format(dateObj, "MM/dd/yyyy");

    case "relative":
      if (isToday(dateObj)) return "Today";
      if (isTomorrow(dateObj)) return "Tomorrow";
      if (isYesterday(dateObj)) return "Yesterday";
      return formatDistanceToNow(dateObj, { addSuffix: true });

    default:
      return format(dateObj, "MMM d, yyyy");
  }
};
