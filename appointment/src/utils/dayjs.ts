import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/en-sg";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("en-sg");
dayjs.tz.setDefault("Asia/Singapore");
