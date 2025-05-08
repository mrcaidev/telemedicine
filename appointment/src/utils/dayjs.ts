import dayjs from "dayjs";
import "dayjs/locale/en-sg";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

dayjs.locale("en-sg");
dayjs.tz.setDefault("Asia/Singapore");
