import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: Bun.env.OPENAI_API_KEY,
});

export async function createEmbedding(input: string) {
  const { data } = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input,
    dimensions: 512,
  });
  return data[0]!.embedding;
}
