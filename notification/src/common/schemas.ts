import * as v from "valibot";

export const idSchema = v.pipe(
  v.string("id should be a uuid"),
  v.uuid("id should be a uuid"),
);

export const subjectSchema = v.pipe(
  v.string("subject should be a non-empty string"),
  v.minLength(1, "subject should be a non-empty string"),
);

export const toSchema = v.pipe(
  v.array(
    v.pipe(
      v.string("to should be a list of email addresses"),
      v.email("to should be a list of email addresses"),
    ),
    "to should be a list of email addresses",
  ),
  v.minLength(1, "to should contain 1-50 email addresses"),
  v.maxLength(50, "to should contain 1-50 email addresses"),
);

export const ccSchema = v.pipe(
  v.array(
    v.pipe(
      v.string("cc should be a list of email addresses"),
      v.email("cc should be a list of email addresses"),
    ),
    "cc should be a list of email addresses",
  ),
  v.maxLength(50, "cc should contain 0-50 email addresses"),
);

export const bccSchema = v.pipe(
  v.array(
    v.pipe(
      v.string("bcc should be a list of email addresses"),
      v.email("bcc should be a list of email addresses"),
    ),
    "bcc should be a list of email addresses",
  ),
  v.maxLength(50, "bcc should contain 0-50 email addresses"),
);

export const contentSchema = v.pipe(
  v.string("content should be a non-empty string"),
  v.minLength(1, "content should be a non-empty string"),
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
