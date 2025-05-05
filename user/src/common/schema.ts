import * as v from "valibot";

export const idSchema = v.pipe(
  v.string("id should be a uuid"),
  v.uuid("id should be a uuid"),
);

export const emailSchema = v.pipe(
  v.string("email should be a valid address"),
  v.email("email should be a valid address"),
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

export const otpSchema = v.pipe(
  v.string("otp should be 6 digits"),
  v.length(6, "otp should be 6 digits"),
  v.digits("otp should be 6 digits"),
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
