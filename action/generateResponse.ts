'use server';

import { createStreamableValue } from 'ai/rsc';
import { CompanyGPT, CompanyGPTMessage } from '@/lib/CompanyGPT';

export async function generateResponse(
  messages: CompanyGPTMessage[],
  roleId: string | undefined,
  selectedDataCollections: string[],
  apiKey: string,
) {
  const cgpt = new CompanyGPT({ apiKey });

  const response = cgpt.chat({
    messages,
    model: {
      id: 'gpt-3.5-turbo',
    },
    roleId,
    selectedDataCollections,
    selectedMode: 'BASIC',
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
