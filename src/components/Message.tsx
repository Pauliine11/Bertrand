import clsx from 'clsx';
import Image from 'next/image';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import ReactMarkdown from 'react-markdown';

type MessageProps = {
  message: ChatCompletionMessageParam;
};

export const Message = ({ message }: MessageProps) => {
  if (message.role === 'system') return null;

  const isUser = message.role === 'user';

  const imageUrl = isUser ? '/avatar.jpg' : '/concierge.png';

  const content = typeof message.content === 'string' ? message.content : '';

  return (
    <li
      className={clsx('w-full flex gap-4 p-4 border-[#d4af37] border mt-1 rounded-lg transition-all hover:shadow-md hover:shadow-[#d4af37]/10', {
        'bg-[#1e293b]': isUser,
        'bg-[#0f172a]/50 border-[#c9a961]': !isUser,
      })}
    >
      <div className="w-12 h-12">
        <Image src={imageUrl} width={42} height={42} alt="Avatar" />
      </div>
      <div className="prose dark:prose-invert w-full">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </li>
  );
};