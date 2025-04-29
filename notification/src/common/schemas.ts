import * as v from "valibot";

export const idSchema = v.pipe(
  v.string("id should be a uuid"),
  v.uuid("id should be a uuid"),
);

export const subjectSchema = v.pipe(
  v.string("subject should be a string"),
  v.minLength(1, "subject should be non-empty"),
);

export const toSchema = v.pipe(
  v.array(v.string(), "to should be an array of strings"),
  v.minLength(1, "to should have 1-50 items"),
  v.maxLength(50, "to should have 1-50 items"),
);

export const ccSchema = v.pipe(
  v.array(v.string(), "cc should be an array of strings"),
  v.maxLength(50, "cc should have 0-50 items"),
);

export const bccSchema = v.pipe(
  v.array(v.string(), "bcc should be an array of strings"),
  v.maxLength(50, "bcc should have 0-50 items"),
);

export const contentSchema = v.pipe(
  v.string("content should be a string"),
  v.minLength(1, "content should be non-empty"),
);

export const scheduledAtSchema = v.pipe(
  v.string("scheduledAt should be an ISO 8601 timestamp"),
  v.isoTimestamp("scheduledAt should be an ISO 8601 timestamp"),
  v.check((value) => {
    return Date.now() < new Date(value).getTime();
  }, "scheduledAt should be in the future"),
  v.check((value) => {
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
    return new Date(value).getTime() < Date.now() + ONE_MONTH;
  }, "scheduledAt should be within one month from now"),
);
