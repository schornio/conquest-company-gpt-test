'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { readStreamableValue } from 'ai/rsc';
import { Markdown } from '@schornio/markdown-util/dist';
import {
  CompanyGPTDataCollection,
  CompanyGPTMessage,
  CompanyGPTRole,
} from '@/lib/CompanyGPT';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateResponse } from '@/action/generateResponse';
import { getMeta } from '@/action/getMeta';

export default function Page() {
  const [apiKey, setApiKey] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDataCollections, setSelectedDataCollections] = useState<
    string[]
  >([]);

  const [meta, setMeta] = useState<{
    dataCollections: CompanyGPTDataCollection[];
    roles: CompanyGPTRole[];
  } | null>(null);

  const [messages, setMessages] = useState<CompanyGPTMessage[]>([
    {
      content: 'Hallo, wie kann ich Ihnen helfen?',
      role: 'assistant',
    },
  ]);

  const onApiKey = (eventArgs: FormEvent<HTMLFormElement>) => {
    eventArgs.preventDefault();
    const formData = new FormData(eventArgs.currentTarget);
    const apiKey = formData.get('apiKey');

    if (typeof apiKey === 'string') {
      setApiKey(apiKey);
      getMeta(apiKey).then(setMeta);
    }
  };

  const onSendMessage = async (eventArgs: FormEvent<HTMLFormElement>) => {
    eventArgs.preventDefault();
    if (!apiKey) {
      throw new Error('API key not set');
    }

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

      const { messageStream } = await generateResponse(
        newMessages,
        selectedRole,
        selectedDataCollections,
        apiKey,
      );

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
    <div className="m-auto w-full max-w-3xl p-3">
      <Image
        src="/logo.svg"
        alt="Conquest Logo"
        className="mx-auto mb-5"
        width={200}
        height={200}
      />
      <div className="flex flex-col gap-3 rounded-sm border p-3">
        {apiKey ? (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`rounded-sm p-3 ${
                    message.role === 'assistant'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            ))}
            <form className="flex gap-3" onSubmit={onSendMessage}>
              <Input name="message" placeholder="Ihre Nachricht..." />
              <Button disabled={loading}>Senden</Button>
            </form>
            <hr />
            <h2 className="text-center font-semibold">Rollen</h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedRole === '' ? undefined : 'outline'}
                onClick={() => setSelectedRole('')}
              >
                Keine Rolle
              </Button>
              {meta?.roles.map((role) => (
                <Button
                  key={role.roleId}
                  variant={role.roleId === selectedRole ? undefined : 'outline'}
                  onClick={() => setSelectedRole(role.roleId)}
                >
                  {role.title}
                </Button>
              ))}
            </div>
            <hr />
            <h2 className="text-center font-semibold">Datenspeicher</h2>
            <div className="flex flex-wrap gap-3">
              {meta?.dataCollections.map((dataCollection) => (
                <Button
                  key={dataCollection.id}
                  variant={
                    selectedDataCollections.includes(dataCollection.id)
                      ? undefined
                      : 'outline'
                  }
                  onClick={() => {
                    setSelectedDataCollections((current) =>
                      current.includes(dataCollection.id)
                        ? current.filter((id) => id !== dataCollection.id)
                        : [...current, dataCollection.id],
                    );
                  }}
                >
                  {dataCollection.name}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <form className="flex gap-3" onSubmit={onApiKey}>
            <Input
              type="password"
              name="apiKey"
              placeholder="Ihre API Key..."
            />
            <Button disabled={loading}>Start</Button>
          </form>
        )}
      </div>
    </div>
  );
}
