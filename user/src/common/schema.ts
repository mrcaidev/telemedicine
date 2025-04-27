import * as v from "valibot";

export const uuidSchema = v.pipe(v.string(), v.uuid("Invalid UUID"));

export const emailSchema = v.pipe(v.string(), v.email("Invalid email"));

export const passwordSchema = v.pipe(
  v.string(),
  v.minLength(
    8,
    "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
  v.maxLength(
    20,
    "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
  v.regex(
    /[A-Za-z]/,
    "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
  v.regex(
    /\d/,
    "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
  v.regex(
    /[`~!@#$%^&*()\-_=+\[{\]}\\|;:'",<.>\/?]/,
    "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
  ),
);

export const otpSchema = v.pipe(
  v.string(),
  v.length(6, "OTP should be 6 digits"),
  v.digits("OTP should be 6 digits"),
);

export const firstNameSchema = v.pipe(
  v.string(),
  v.minLength(1, "First name should be 1-20 characters long"),
  v.maxLength(20, "First name should be 1-20 characters long"),
);

export const lastNameSchema = v.pipe(
  v.string(),
  v.minLength(1, "Last name should be 1-20 characters long"),
  v.maxLength(20, "Last name should be 1-20 characters long"),
);

export const genderSchema = v.union([v.literal("male"), v.literal("female")]);
