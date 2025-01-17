'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { readStreamableValue } from 'ai/rsc';
import {
  Markdown,
  MarkdownComponentConfig,
} from '@schornio/markdown-util/dist';
import Link from 'next/link';
import { MessageCirclePlus } from 'lucide-react';
import { CompanyGPTMessage } from '@/lib/CompanyGPT';
import { Input } from '@/components/ui/input';
import { generatePublicResponse } from '@/action/generatePublicResponse';
import { cn } from '@/lib/utils';
import { usePersistentState } from '@/lib/usePersistentState';

const markdownComponents: MarkdownComponentConfig = {
  link: ({ children, content }) => (
    <Link href={content.url} target="_top">
      {children}
    </Link>
  ),
};

export default function Page() {
  const [loading, setLoading] = useState(false);

  const [messages, setMessages, clearMessages] = usePersistentState<
    CompanyGPTMessage[]
  >(
    [
      {
        content: 'Hallo, wie kann ich dir helfen?',
        role: 'assistant',
      },
    ],
    { store: sessionStorage, storeKey: 'messages' },
  );

  const sendMessage = async (message: string) => {
    setLoading(true);
    const newMessages = [
      ...messages,
      {
        content: message,
        role: 'user' as const,
      },
    ];

    setMessages(newMessages);

    const { messageStream } = await generatePublicResponse(newMessages);

    for await (const message of readStreamableValue(messageStream)) {
      setMessages([
        ...newMessages,
        { content: message ?? '', role: 'assistant' },
      ]);
    }
    setLoading(false);
  };

  const onSendMessage = async (eventArgs: FormEvent<HTMLFormElement>) => {
    eventArgs.preventDefault();

    const formData = new FormData(eventArgs.currentTarget);
    const message = formData.get('message');

    if (typeof message === 'string') {
      await sendMessage(message);
      eventArgs.currentTarget.reset();
    }
  };

  return (
    <div className="relative m-auto flex w-full flex-1 flex-col">
      <Image
        src="/logo.svg"
        alt="Conquest Logo"
        className="mx-auto my-5"
        width={200}
        height={200}
      />
      <button
        className="group absolute right-3 top-3"
        type="button"
        onClick={clearMessages}
      >
        <MessageCirclePlus className="h-5 w-5" strokeWidth={1} />
        <div className="absolute right-0 top-full hidden text-nowrap rounded-md border bg-white px-1 text-sm group-hover:block">
          Neuer Chat
        </div>
      </button>
      <div className="flex flex-1 flex-col gap-3 rounded-sm">
        <div className="flex flex-1 flex-col gap-3 p-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn('flex items-start gap-3', {
                'justify-end': message.role === 'user',
                'justify-start': message.role === 'assistant',
              })}
            >
              {message.role === 'assistant' ? (
                <Image src="/bot.svg" width={30} height={30} alt="Bot" />
              ) : undefined}
              <div className="flex flex-col gap-3">
                <div
                  className={cn('rounded-md p-3', {
                    'rounded-bl-none bg-gray-100 text-secondary-foreground':
                      message.role === 'assistant',
                    'rounded-br-none bg-gray-700 text-primary-foreground':
                      message.role === 'user',
                  })}
                >
                  <Markdown components={markdownComponents}>
                    {message.content}
                  </Markdown>
                </div>
                {messages.length === 1 &&
                message.role === 'assistant' &&
                !loading ? (
                  <>
                    <button
                      className={
                        'rounded-md rounded-bl-none border border-gray-700 p-1 px-2 text-left'
                      }
                      onClick={() => sendMessage('Was macht ihr bei Conquest?')}
                    >
                      Was macht ihr bei Conquest?
                    </button>
                    <button
                      className={
                        'rounded-md rounded-bl-none border border-gray-700 p-1 px-2 text-left'
                      }
                      onClick={() =>
                        sendMessage(
                          'Wo liegen die Spezialgebiete der Conquest?',
                        )
                      }
                    >
                      Wo liegen die Spezialgebiete der Conquest?
                    </button>
                    <button
                      className={
                        'rounded-md rounded-bl-none border border-gray-700 p-1 px-2 text-left'
                      }
                      onClick={() =>
                        sendMessage('Wie erreiche ich einen Ansprechpartner?')
                      }
                    >
                      Wie erreiche ich einen Ansprechpartner?
                    </button>
                  </>
                ) : undefined}
              </div>
            </div>
          ))}
        </div>
        <form
          className="sticky bottom-0 mt-auto flex gap-3 border-t border-t-gray-400 bg-white p-3"
          onSubmit={onSendMessage}
        >
          <Input
            name="message"
            placeholder="Deine Nachricht..."
            className="border-0 shadow-none focus-visible:ring-0"
          />
          <button className="group" disabled={loading} type="submit">
            {loading ? (
              <Image
                src="/CONQUEST_website_CHATBOT_send_pressed.svg"
                width={50}
                height={50}
                alt=""
              />
            ) : (
              <>
                <Image
                  src="/CONQUEST_website_CHATBOT_send_default.svg"
                  width={50}
                  height={50}
                  alt=""
                  className="group-hover:hidden"
                />
                <Image
                  src="/CONQUEST_website_CHATBOT_send_hover.svg"
                  width={50}
                  height={50}
                  alt=""
                  className="hidden group-hover:block"
                />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
