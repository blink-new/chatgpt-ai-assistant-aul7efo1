
import { Message } from '../types';
import { cn } from '../lib/utils';
import { useEffect, useRef } from 'react';

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}

export function ChatMessage({ message, isLastMessage = false }: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isLastMessage && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLastMessage]);

  return (
    <div
      ref={messageRef}
      className={cn(
        "py-6 px-4 md:px-8 lg:px-12 flex flex-col",
        message.role === 'assistant' ? "bg-secondary/30" : "bg-background"
      )}
    >
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-start gap-4 md:gap-6">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            message.role === 'assistant' 
              ? "bg-primary-600 text-white" 
              : "bg-secondary-300"
          )}>
            {message.role === 'assistant' ? 'AI' : 'You'}
          </div>
          <div className="flex-1 space-y-2 overflow-hidden">
            <div className="font-medium">
              {message.role === 'assistant' ? 'Assistant' : 'You'}
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}