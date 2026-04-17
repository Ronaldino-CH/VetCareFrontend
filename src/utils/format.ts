export function formatValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Activo" : "Inactivo";
  return String(value);
}

export function resolveFieldValue(obj, fieldName) {
  if (!obj || !fieldName) return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, fieldName)) return obj[fieldName];

  const camelCaseField = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
  if (Object.prototype.hasOwnProperty.call(obj, camelCaseField)) return obj[camelCaseField];

  const matchKey = Object.keys(obj).find((key) => key.toLowerCase() === fieldName.toLowerCase());
  return matchKey ? obj[matchKey] : undefined;
}

export function formatDateForInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

export function formatDateTime12(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  const period = hour >= 12 ? "pm" : "am";

  hour %= 12;
  if (hour === 0) hour = 12;

  return `${year}-${month}-${day} ${String(hour).padStart(2, "0")}:${minute}:${second} ${period}`;
}

export function formatDateOnly(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
