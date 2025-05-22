import { type JWTVerifyOptions, createRemoteJWKSet, jwtVerify } from "jose";

type GoogleIdTokenPayload = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string | null;
  picture: string | null;
  given_name: string | null;
  family_name: string | null;
};

const googleJwks = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

const googleJwtOptions: JWTVerifyOptions = {
  issuer: ["https://accounts.google.com", "accounts.google.com"],
  audience: Bun.env.GOOGLE_OAUTH_CLIENT_IDS.split(","),
};

export async function verifyGoogleIdToken(idToken: string) {
  const { payload } = await jwtVerify<GoogleIdTokenPayload>(
    idToken,
    googleJwks,
    googleJwtOptions,
  );
  return payload;
}
