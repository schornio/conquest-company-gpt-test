'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { readStreamableValue } from 'ai/rsc';
import { Markdown } from '@schornio/markdown-util/dist';
import { CompanyGPTMessage } from '@/lib/CompanyGPT';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generatePublicResponse } from '@/action/generatePublicResponse';

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<CompanyGPTMessage[]>([
    {
      content: 'Hallo, wie kann ich Ihnen helfen?',
      role: 'assistant',
    },
  ]);

  const onSendMessage = async (eventArgs: FormEvent<HTMLFormElement>) => {
    eventArgs.preventDefault();

    const formData = new FormData(eventArgs.currentTarget);
    const message = formData.get('message');

    if (typeof message === 'string') {
      setLoading(true);
      const newMessages = [
        ...messages,
        {
          content: message,
          role: 'user' as const,
        },
      ];

      setMessages(newMessages);
      eventArgs.currentTarget.reset();

      const { messageStream } = await generatePublicResponse(newMessages);

      for await (const message of readStreamableValue(messageStream)) {
        setMessages([
          ...newMessages,
          { content: message ?? '', role: 'assistant' },
        ]);
      }
      setLoading(false);
    }
  };

  return (
    <div className="m-auto flex w-full flex-1 flex-col">
      <Image
        src="/logo.svg"
        alt="Conquest Logo"
        className="mx-auto my-5"
        width={200}
        height={200}
      />
      <div className="flex flex-1 flex-col gap-3 rounded-md p-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`rounded-md p-3 ${
                message.role === 'assistant'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        ))}
        <form className="mt-auto flex gap-3" onSubmit={onSendMessage}>
          <Input name="message" placeholder="Ihre Nachricht..." />
          <Button disabled={loading}>Senden</Button>
        </form>
      </div>
    </div>
  );
}
