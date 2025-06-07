import { pipeline } from "@huggingface/transformers";
import type { Doctor } from "./types";

const embedder = await pipeline("feature-extraction", "Supabase/gte-small");

export async function embedDoctor(doctor: Doctor) {
  const { data } = await embedder(
    `${doctor.firstName} ${doctor.lastName} ${doctor.description} ${doctor.specialties.join(" ")}`,
    { normalize: true, pooling: "mean" },
  );
  return Array.from(data);
}
