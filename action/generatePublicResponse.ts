'use server';

import { createStreamableValue } from 'ai/rsc';
import { CompanyGPT, CompanyGPTMessage } from '@/lib/CompanyGPT';

const { PUBLIC_ROLE_ID } = process.env;
const PUBLIC_DATA_COLLECTIONS = [process.env.PUBLIC_DATA_COLLECTION!];

export async function generatePublicResponse(messages: CompanyGPTMessage[]) {
  const cgpt = new CompanyGPT();

  const response = cgpt.chat({
    messages,
    model: {
      id: 'gpt-4o-mini',
    },
    roleId: PUBLIC_ROLE_ID,
    selectedDataCollections: PUBLIC_DATA_COLLECTIONS,
    selectedMode: 'QA',
  });

  const messageStream = createStreamableValue('');

  (async () => {
    for await (const messageChunk of response) {
      messageStream.append(messageChunk);
    }
    messageStream.done();
  })();

  return {
    messageStream: messageStream.value,
  };
}
