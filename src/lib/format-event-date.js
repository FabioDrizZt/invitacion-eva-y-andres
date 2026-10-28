/**
 * Formats a date string into Spanish (Argentine) format
 * @param {string} isoString - The ISO date string to format
 * @param {('full'|'short'|'time')} [format='full'] - The format type to use
 * @param {boolean} [isUtc=false] - Whether the input is UTC
 * @returns {string} The formatted date string in Spanish
 *
 * @example
 * // returns "Viernes, 20 de Noviembre de 2026"
 * formatEventDate("2026-11-20", "full")
 *
 * // returns "20 de Noviembre de 2026"
 * formatEventDate("2026-11-20", "short")
 *
 * // returns "18:00"
 * formatEventDate("2026-11-20T18:00:00", "time")
 */
export const formatEventDate = (
  isoString,
  format = "full",
  isUtc = false,
) => {
  if (!isoString) return "";

  // Handle simple "YYYY-MM-DD" strings without timezone skew
  let date;
  if (typeof isoString === "string" && /^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
    const [year, month, day] = isoString.split("-").map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(isoString);
    if (isUtc && typeof isoString === "string" && !isoString.endsWith("Z")) {
      date = new Date(isoString + "Z");
    }
  }

  const monthsSpanish = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const daysSpanish = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const dayOfWeek = daysSpanish[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthName = monthsSpanish[date.getMonth()];
  const year = date.getFullYear();

  if (format === "time") {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  if (format === "short") {
    return `${dayOfMonth} de ${monthName} de ${year}`;
  }

  // Full format: "Sábado, 22 de Noviembre de 2025"
  return `${dayOfWeek}, ${dayOfMonth} de ${monthName} de ${year}`;
};
