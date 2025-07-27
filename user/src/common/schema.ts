import * as v from "valibot";

export const uuidSchema = v.pipe(
  v.string("id should be a uuid"),
  v.uuid("id should be a uuid"),
);

export const emailSchema = v.pipe(
  v.string("email should be a valid email address"),
  v.email("email should be a valid email address"),
);

export const passwordSchema = v.pipe(
  v.string(
    "password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
  v.minLength(
    8,
    "password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
  v.maxLength(
    20,
    "password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
  v.regex(
    /[A-Za-z]/,
    "password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
  v.regex(
    /\d/,
    "password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
  v.regex(
    /[`~!@#$%^&*()\-_=+\[{\]}\\|;:'",<.>\/?]/,
    "password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
);

export const clinicNameSchema = v.pipe(
  v.string("name should be 1-30 characters long"),
  v.minLength(1, "name should be 1-30 characters long"),
  v.maxLength(30, "name should be 1-30 characters long"),
);

export const firstNameSchema = v.pipe(
  v.string("firstName should be 1-20 characters long"),
  v.minLength(1, "firstName should be 1-20 characters long"),
  v.maxLength(20, "firstName should be 1-20 characters long"),
);

export const lastNameSchema = v.pipe(
  v.string("lastName should be 1-20 characters long"),
  v.minLength(1, "lastName should be 1-20 characters long"),
  v.maxLength(20, "lastName should be 1-20 characters long"),
);

export const genderSchema = v.union(
  [v.literal("male"), v.literal("female")],
  "gender should be either male or female",
);

export const doctorDescriptionSchema = v.pipe(
  v.string("description should be 1-200 characters long"),
  v.minLength(1, "description should be 1-200 characters long"),
  v.maxLength(200, "description should be 1-200 characters long"),
);

export const nicknameSchema = v.pipe(
  v.string("nickname should be 1-20 characters long"),
  v.minLength(1, "nickname should be 1-20 characters long"),
  v.maxLength(20, "nickname should be 1-20 characters long"),
);

export const birthDateSchema = v.pipe(
  v.string("birthDate should be an ISO 8601 date"),
  v.isoDate("birthDate should be an ISO 8601 date"),
);

export const otpSchema = v.pipe(
  v.string("otp should be 6 digits"),
  v.length(6, "otp should be 6 digits"),
  v.digits("otp should be 6 digits"),
);

export const metaTimeRangeSchema = v.object({
  startAt: v.pipe(
    v.string("startAt should be an ISO 8601 timestamp"),
    v.isoTimestamp("startAt should be an ISO 8601 timestamp"),
  ),
  endAt: v.pipe(
    v.string("endAt should be an ISO 8601 timestamp"),
    v.isoTimestamp("endAt should be an ISO 8601 timestamp"),
  ),
});
