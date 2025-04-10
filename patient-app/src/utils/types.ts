export type Patient = {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  gender: "male" | "female" | null;
  birthDate: string | null;
  createdAt: string;
};
