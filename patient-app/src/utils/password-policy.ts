import * as v from "valibot";

export const passwordPolicy = v.pipe(
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
