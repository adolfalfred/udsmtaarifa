export function convertISOToReadable(
  isoDateString: string | Date,
  locale: string = "en",
  options: Intl.DateTimeFormatOptions = {}
) {
  const date = new Date(isoDateString);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formatOptions = { ...defaultOptions, ...options };
  // Ensure the locale is valid
  return date.toLocaleString(locale, formatOptions);
}

export function isVideo(url: string) {
  return /\.(mp4|mov|webm|m4v)$/i.test(url);
}
