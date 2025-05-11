import dayjs from "dayjs";
import "dayjs/locale/en-sg";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.locale("en-sg");
