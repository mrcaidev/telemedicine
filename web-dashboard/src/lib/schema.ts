import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["PATIENT", "DOCTOR"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  acceptPolicy: z.literal(true, {
    errorMap: () => ({ message: "You must accept our terms." }),
  }),
});
