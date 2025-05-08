import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { OtpVerification, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

export async function findLastOneByEmail(email: string) {
  const [row] = await sql`
    select id, email, otp, sent_at, verified_at
    from otp_verifications
    where email = ${email}
    order by sent_at desc
    limit 1
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as OtpVerification;
}

export async function createOne(
  data: PartiallyRequired<OtpVerification, "email" | "otp">,
) {
  const [row] = await sql`
    insert into otp_verifications ${sql(camelToSnakeJson(data))}
    returning id, email, otp, sent_at, verified_at
  `;

  if (!row) {
    throw new Error("failed to create otp verification");
  }

  return snakeToCamelJson(row) as OtpVerification;
}

export async function updateOneById(
  id: string,
  data: Partial<Pick<OtpVerification, "verifiedAt">>,
) {
  const [row] = await sql`
    update otp_verifications
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
    returning id, email, otp, sent_at, verified_at
  `;

  if (!row) {
    throw new Error("failed to update otp verification");
  }

  return snakeToCamelJson(row) as OtpVerification;
}
