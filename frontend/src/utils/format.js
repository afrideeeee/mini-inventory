import { appConfig } from "../config/appConfig";

const { locale, currency } = appConfig;

export const formatNumber = (n) => new Intl.NumberFormat(locale).format(n);

export const formatCurrency = (n) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);

// 4 -> "04"
export const padCount = (n) => String(n).padStart(2, "0");

// "Tue, 13 Oct 2026" (upper-cased in CSS where needed)
export const formatDateLong = (date) =>
  new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(/(\w{3}), (\w{3}) (\d{2}), (\d{4})/, "$1, $3 $2 $4");

export const formatTime = (date) =>
  new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

export const pluralise = (count, singular, plural = `${singular}s`) =>
  count === 1 ? singular : plural;
