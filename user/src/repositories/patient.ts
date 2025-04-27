import type { Patient } from "@/utils/types";
import { sql } from "bun";

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
