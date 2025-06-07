import { pipeline } from "@huggingface/transformers";

const embedder = await pipeline("feature-extraction", "Supabase/gte-small");

export async function createEmbedding(text: string) {
  const { data } = await embedder(text, { normalize: true, pooling: "mean" });
  return Array.from(data);
}
