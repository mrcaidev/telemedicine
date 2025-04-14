import dayjs from "dayjs";
import "dayjs/locale/en-sg";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("en-sg");

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
