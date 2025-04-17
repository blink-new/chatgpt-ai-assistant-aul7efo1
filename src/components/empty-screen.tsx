
import { Button } from './ui/button';
import { MessageSquarePlusIcon } from 'lucide-react';

interface EmptyScreenProps {
  onNewConversation: () => void;
}

export function EmptyScreen({ onNewConversation }: EmptyScreenProps) {
  const examples = [
    "Explain quantum computing in simple terms",
    "How do I make a HTTP request in JavaScript?",
    "Write a poem about artificial intelligence",
    "What are the best practices for React development?",
    "Tell me about the history of the internet"
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12">
      <div className="max-w-md w-full mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
            AI
          </div>
        </div>
        
        <h1 className="text-2xl font-bold">How can I help you today?</h1>
        
        <p className="text-muted-foreground">
          I'm an AI assistant that remembers our conversations. Ask me anything or try one of these examples:
        </p>
        
        <div className="grid gap-2">
          {examples.map((example, i) => (
            <Button
              key={i}
              variant="outline"
              className="justify-start h-auto py-3 px-4 text-left"
              onClick={() => onNewConversation(example)}
            >
              {example}
            </Button>
          ))}
        </div>
        
        <div className="pt-4">
          <Button onClick={() => onNewConversation()} className="gap-2">
            <MessageSquarePlusIcon className="h-4 w-4" />
            New conversation
          </Button>
        </div>
      </div>
    </div>
  );
}