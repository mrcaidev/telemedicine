import * as v from "valibot";

export const idSchema = v.pipe(
  v.string("id should be a uuid"),
  v.uuid("id should be a uuid"),
);

export const remarkSchema = v.pipe(
  v.string(),
  v.maxLength(200, "remark should be 0-200 characters long"),
);

export const statusSchema = v.pipe(
  v.string(
    "status should be one or more of normal, to_be_rescheduled or cancelled, separated by commas",
  ),
  v.transform((value) => [...new Set(value.split(",").map((s) => s.trim()))]),
  v.array(
    v.union(
      [
        v.literal("normal"),
        v.literal("to_be_rescheduled"),
        v.literal("cancelled"),
      ],
      "status should be one or more of normal, to_be_rescheduled or cancelled, separated by commas",
    ),
    "status should be one or more of normal, to_be_rescheduled or cancelled, separated by commas",
  ),
  v.minLength(
    1,
    "status should be one or more of normal, to_be_rescheduled or cancelled, separated by commas",
  ),
);

export const weekdaySchema = v.pipe(
  v.number("Weekday should be an integer between 0 and 6"),
  v.integer("Weekday should be an integer between 0 and 6"),
  v.minValue(0, "Weekday should be an integer between 0 and 6"),
  v.maxValue(6, "Weekday should be an integer between 0 and 6"),
);

export const isoTimeSchema = v.pipe(
  v.string("time should be in HH:mm format"),
  v.isoTime("time should be in HH:mm format"),
);
