/**
 * 为了保证正确处理时差问题，我们要求：
 * 1. Date在前后端均采用UTC时间，只有在UI层上显示时采用本地时间
 * 2. CalendarDateTime仅用于存储本地时间
 */

import {CalendarDateTime} from "@internationalized/date";

/**
 * 获取YYYY-MM-DD格式的日期字符串
 * @param value 日期
 */
export function formatDate(value: Date | string): string {
  const date = (value instanceof Date) ? value : new Date(value);

  return `${date.getFullYear().toString().padStart(4, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${(date.getDate()).toString().padStart(2, "0")}`
}

//获取今日CalendarDateTime日期
export function calendarDateUTCToday(): CalendarDateTime {
  return parseCalendarDateTime(new Date());
}

export function parseDate(calendarDateTime: CalendarDateTime): Date {
  return new Date(calendarDateTime.year, calendarDateTime.month - 1, calendarDateTime.day,
    calendarDateTime.hour, calendarDateTime.minute, calendarDateTime.second, calendarDateTime.millisecond);
}

export function parseCalendarDateTime(date: Date): CalendarDateTime {
  return new CalendarDateTime(date.getFullYear(), date.getMonth() + 1, date.getDate(),
    date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

export function truncateToDate(calendarDateTime: CalendarDateTime): CalendarDateTime {
  return new CalendarDateTime(calendarDateTime.year, calendarDateTime.month, calendarDateTime.day,
    0, 0, 0, 0)
}
