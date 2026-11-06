const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

export interface FormattedTimestamp {
  date: string;
  time: string;
  value: number | null;
  isAvailable: boolean;
}

export function formatTimestamp(value: string | null | undefined): FormattedTimestamp {
  if (!value || !value.trim()) {
    return {
      date: "Not available",
      time: "No timestamp",
      value: null,
      isAvailable: false,
    };
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return {
      date: "Not available",
      time: "Invalid timestamp",
      value: null,
      isAvailable: false,
    };
  }

  return {
    date: dateFormatter.format(parsed),
    time: timeFormatter.format(parsed),
    value: parsed.getTime(),
    isAvailable: true,
  };
}

export function formatTimestampCompact(value: string | null | undefined): string {
  const timestamp = formatTimestamp(value);
  return timestamp.isAvailable
    ? `${timestamp.date} at ${timestamp.time}`
    : timestamp.date;
}

export function toTimestampValue(value: string | null | undefined): number {
  return formatTimestamp(value).value ?? 0;
}
