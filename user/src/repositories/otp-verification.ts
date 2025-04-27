import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { OtpVerification } from "@/utils/types";
import { sql } from "bun";

export async function findLastOneByEmail(email: string) {
  const [otpVerification] = await sql`
    select *
    from otp_verifications
    where email = ${email}
    order by sent_at desc
    limit 1
  `;
  return snakeToCamelJson(otpVerification) as OtpVerification | undefined;
}

export async function insertOne(data: Pick<OtpVerification, "email" | "otp">) {
  const [otpVerification] = await sql`
    insert into otp_verifications ${sql(camelToSnakeJson(data))}
    returning *
  `;
  return snakeToCamelJson(otpVerification) as OtpVerification;
}

export async function updateOneById(
  id: string,
  data: Partial<Pick<OtpVerification, "verifiedAt">>,
) {
  const [otpVerification] = await sql`
    update otp_verifications
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
    returning *
  `;
  return snakeToCamelJson(otpVerification) as OtpVerification | undefined;
}
