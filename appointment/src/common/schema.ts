import * as v from "valibot";

export const idSchema = v.pipe(
  v.string("id should be a uuid"),
  v.uuid("id should be a uuid"),
);

export const remarkSchema = v.pipe(
  v.string(),
  v.maxLength(200, "remark should be 0-200 characters long"),
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
