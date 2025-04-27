import * as clinicRepository from "@/repositories/clinic";

export async function createOne(data: { name: string }, createdBy: string) {
  const clinic = await clinicRepository.insertOne({
    name: data.name,
    createdBy,
  });

  return clinic;
}
