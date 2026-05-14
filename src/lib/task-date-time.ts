export const parseTaskDateTime = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const combineTaskDateTime = (
  date: Date | undefined,
  time: string,
) => {
  if (!date) {
    return null;
  }

  const [hours = 0, minutes = 0, seconds = 0] = time
    .split(":")
    .map((part) => Number(part));

  const scheduledAt = new Date(date);
  scheduledAt.setHours(
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    Number.isFinite(seconds) ? seconds : 0,
    0,
  );

  return scheduledAt.toISOString();
};

export const toTimeInputValue = (value?: Date | string | null) => {
  const date = parseTaskDateTime(
    value instanceof Date ? value.toISOString() : value,
  );

  if (!date) {
    return "";
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const formatTaskDateTime = (value?: Date | string | null) => {
  const date = parseTaskDateTime(
    value instanceof Date ? value.toISOString() : value,
  );

  if (!date) {
    return "Sem data definida";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};
