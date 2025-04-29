import * as v from "valibot";

export const uuidSchema = v.pipe(v.string(), v.uuid("Invalid UUID"));

export const weekdaySchema = v.pipe(
  v.number("Weekday should be an integer between 0 and 6"),
  v.integer("Weekday should be an integer between 0 and 6"),
  v.minValue(0, "Weekday should be an integer between 0 and 6"),
  v.maxValue(6, "Weekday should be an integer between 0 and 6"),
);

export const isoTimeSchema = v.pipe(
  v.string(),
  v.isoTime("Time should be in HH:mm format"),
);
