import clsx from 'clsx';
import Image from 'next/image';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import ReactMarkdown from 'react-markdown';
import { CopyButton } from './CopyButton';

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
      className={clsx('group w-full flex gap-4 p-4 border rounded-lg transition-all hover:shadow-md', {
        'bg-gray-50 border-gray-200': isUser,
        'bg-white border-gray-200': !isUser,
      })}
    >
      <div className="w-10 h-10 flex-shrink-0">
        <Image src={imageUrl} width={40} height={40} alt="Avatar" className="rounded-full object-cover" />
      </div>
      <div className="prose prose-sm md:prose-base w-full flex-1 max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      
      {/* Bouton Copy - visible au survol pour les messages de l'assistant */}
      {!isUser && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <CopyButton text={content} />
        </div>
      )}
    </li>
  );
};
