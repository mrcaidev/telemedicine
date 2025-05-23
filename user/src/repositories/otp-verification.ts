import { camelToSnakeJson } from "@/utils/case";
import type { OtpVerification, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

type Row = {
  id: string;
  email: string;
  otp: string;
  sent_at: Date;
  verified_at: Date | null;
};

function normalizeRow(row: Row): OtpVerification {
  return {
    id: row.id,
    email: row.email,
    otp: row.otp,
    sentAt: row.sent_at.toISOString(),
    verifiedAt: row.verified_at?.toISOString() ?? null,
  };
}

export async function selectLastOneByEmail(email: string) {
  const [row] = (await sql`
    select id, email, otp, sent_at, verified_at
    from otp_verifications
    where email = ${email}
    order by sent_at desc
    limit 1
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function insertOne(
  data: PartiallyRequired<OtpVerification, "email" | "otp">,
) {
  const [row] = (await sql`
    insert into otp_verifications ${sql(camelToSnakeJson(data))}
    returning id, email, otp, sent_at, verified_at
  `) as Row[];

  if (!row) {
    throw new Error("failed to insert otp verification");
  }

  return normalizeRow(row);
}

export async function updateOneById(
  id: string,
  data: Partial<Pick<OtpVerification, "verifiedAt">>,
) {
  const [row] = (await sql`
    update otp_verifications
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
    returning id, email, otp, sent_at, verified_at
  `) as Row[];

  if (!row) {
    throw new Error("failed to update otp verification");
  }

  return normalizeRow(row);
}
