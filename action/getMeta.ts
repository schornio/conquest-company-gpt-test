'use server';

import { CompanyGPT } from '@/lib/CompanyGPT';

export async function getMeta(apiKey: string) {
  const cgpt = new CompanyGPT({ apiKey });
  const [dataCollections, roles] = await Promise.all([
    cgpt.getDataCollections(),
    cgpt.getRoles(),
  ]);

  return {
    dataCollections,
    roles,
  };
}
