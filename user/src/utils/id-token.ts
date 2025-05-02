import { createLocalJWKSet, jwtVerify } from "jose";

// https://www.googleapis.com/oauth2/v3/certs
const jwks = createLocalJWKSet({
  keys: [
    {
      n: "jb7Wtq9aDMpiXvHGCB5nrfAS2UutDEkSbK16aDtDhbYJhDWhd7vqWhFbnP0C_XkSxsqWJoku69y49EzgabEiUMf0q3X5N0pNvV64krviH2m9uLnyGP5GMdwZpjTXARK9usGgYZGuWhjfgTTvooKDUdqVQYvbrmXlblkM6xjbA8GnShSaOZ4AtMJCjWnaN_UaMD_vAXvOYj4SaefDMSlSoiI46yipFdggfoIV8RDg1jeffyre_8DwOWsGz7b2yQrL7grhYCvoiPrybKmViXqu-17LTIgBw6TDk8EzKdKzm33_LvxU7AKs3XWW_NvZ4WCPwp4gr7uw6RAkdDX_ZAn0TQ",
      alg: "RS256",
      kty: "RSA",
      kid: "23f7a3583796f97129e5418f9b2136fcc0a96462",
      use: "sig",
      e: "AQAB",
    },
    {
      kid: "07b80a365428525f8bf7cd0846d74a8ee4ef3625",
      use: "sig",
      e: "AQAB",
      kty: "RSA",
      alg: "RS256",
      n: "03Cww27F2O7JxB5Ji9iT9szfKZ4MK-iPzVpQkdLjCuGKfpjaCVAz9zIQ0-7gbZ-8cJRaSLfByWTGMIHRYiX2efdjz1Z9jck0DK9W3mapFrBPvM7AlRni4lPlwUigDd8zxAMDCheqyK3vCOLFW-1xYHt_YGwv8b0dP7rjujarEYlWjeppO_QMNtXdKdT9eZtBEcj_9ms9W0aLdCFNR5AAR3y0kLkKR1H4DW7vncB46rqCJLenhlCbcW0MZ3asqcjqBQ2t9QMRnY83Zf_pNEsCcXlKp4uOQqEvzjAc9ZSr2sOmd_ESZ_3jMlNkCZ4J41TuG-My5illFcW5LajSKvxD3w",
    },
  ],
});

type GoogleIdTokenPayload = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string | null;
  picture: string | null;
  given_name: string | null;
  family_name: string | null;
};

export async function verifyGoogleIdToken(idToken: string) {
  const { payload } = await jwtVerify<GoogleIdTokenPayload>(idToken, jwks, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: Bun.env.GOOGLE_OAUTH_CLIENT_IDS.split(","),
  });
  return payload;
}
