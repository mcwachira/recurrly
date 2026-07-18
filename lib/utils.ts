import dayjs from "dayjs";

export type CurrencyCode = "USD" | "KES" | "NGN" | "ZAR" | "GHS" | "EUR";

/**
 * Formats a numeric value into a currency string based on the provided currency code.
 *
 * @param value - The numeric value to format.
 * @param currency - The ISO 4217 currency code (e.g., "USD", "KES", "NGN").
 * @returns A formatted currency string.
 */
export const formatCurrency = (value: number, currency: CurrencyCode | string): string => {
  try {
    const localeMap: Record<string, string> = {
      USD: "en-US",
      KES: "en-KE",
      NGN: "en-NG",
      ZAR: "en-ZA",
      GHS: "en-GH",
      EUR: "en-IE", // Using en-IE for Euro gives € prefix and comma separator
    };

    const locale = localeMap[currency.toUpperCase()] || "en-US";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return `${currency.toUpperCase()} ${value.toFixed(2)}`;
  }
};


export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};
