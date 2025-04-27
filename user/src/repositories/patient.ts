import type { Patient } from "@/utils/types";
import { sql } from "bun";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const [row] = await sql`
    select u.id, u.role, u.email, p.nickname, p.avatar_url, p.gender, p.birth_date
    from patients p
    left outer join users u on p.id = u.id
    where u.id = ${id} and u.deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    role: row.role,
    email: row.email,
    nickname: row.nickname,
    avatarUrl: row.avatar_url,
    gender: row.gender,
    birthDate: row.birth_date,
  } as Patient;
}

export async function insertOne(data: Pick<Patient, "id">) {
  const [row] = await sql`
    insert into patients ${sql(data)}
    returning
      id,
      nickname,
      avatar_url,
      gender,
      birth_date
  `;

  if (!row) {
    throw new HTTPException(500, { message: "Failed to create patient" });
  }

  return {
    id: row.id,
    nickname: row.nickname,
    avatarUrl: row.avatar_url,
    gender: row.gender,
    birthDate: row.birth_date,
  } as Pick<Patient, "id" | "nickname" | "avatarUrl" | "gender" | "birthDate">;
}
