import dayjs from "dayjs";
import "dayjs/locale/en-sg";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("en-sg");

dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export function formatIsoAsDate(iso: string) {
  return dayjs(iso).format("dddd, LL");
}

export function formatIsoAsTime(iso: string) {
  return dayjs(iso).format("LT");
}

export function formatDate(date: string) {
  return dayjs(date, "YYYY-MM-DD").format("dddd, LL");
}

export function formatTime(time: string) {
  return dayjs(time, "HH:mm").format("LT");
}

export function computeNextDateOfWeekday(weekday: number) {
  const targetDateObject = dayjs().day(weekday);

  if (dayjs().day() <= weekday) {
    return targetDateObject;
  }

  return targetDateObject.add(1, "week");
}
