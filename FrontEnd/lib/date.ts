/**
 * 为了保证正确处理时差问题，我们要求：
 * 1. Date在前后端均采用UTC时间，只有在UI层上显示时采用本地时间
 * 2. CalendarDateTime仅用于存储本地时间
 */

// Deterministic date formatting to YYYY-MM-DD (day precision only)
// Automatically converts to local time
import {CalendarDateTime} from "@internationalized/date";

export function formatDate(
  value: Date | string | number | null | undefined
): string {
  if (value === null || value === undefined) return "";

  let d: Date;

  if (typeof value === "string") {
    // Try to parse ISO-like string first
    d = new Date(value);
    if (isNaN(d.getTime())) {
      // Fallback: manually extract YYYY-MM-DD from common formats
      const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (m) return `${m[1]}-${m[2]}-${m[3]}`;
      const m2 = value.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/);
      if (m2) {
        const y = m2[1];
        const mo = m2[2].padStart(2, "0");
        const day = m2[3].padStart(2, "0");
        return `${y}-${mo}-${day}`;
      }
      return ""; // cannot parse
    }
  } else {
    d = new Date(value);
    if (isNaN(d.getTime())) return "";
  }

  // Use local time methods to convert to local date
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

//获取今日CalendarDateTime日期
export function calendarDateUTCToday(): CalendarDateTime {
  return parseCalendarDateTime(new Date());
}

export function parseDate(calendarDate: CalendarDateTime): Date {
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day,
    calendarDate.hour, calendarDate.minute, calendarDate.second);
}

export function parseCalendarDateTime(date: Date): CalendarDateTime {
  return new CalendarDateTime(date.getFullYear(), date.getMonth() + 1, date.getDate(),
    date.getHours(), date.getMinutes(), date.getSeconds());
}

/*
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
*/
