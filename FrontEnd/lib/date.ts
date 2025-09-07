// Deterministic date formatting to YYYY-MM-DD (day precision only)
export function formatDate(value: Date | string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  // If string already in ISO-like format, slice the date part
  if (typeof value === "string") {
    // Normalize common formats: 2025-09-07T00:00:00Z or 2025-09-07 00:00:00
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
    // 2025/9/7 or 2025/09/07 -> normalize to YYYY-MM-DD
    const m2 = value.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/);
    if (m2) {
      const y = m2[1];
      const mo = m2[2].padStart(2, "0");
      const d = m2[3].padStart(2, "0");
      return `${y}-${mo}-${d}`;
    }
    // Fallback to Date parsing
  }
  const d = new Date(value as any);
  if (isNaN(d.getTime())) return "";
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

