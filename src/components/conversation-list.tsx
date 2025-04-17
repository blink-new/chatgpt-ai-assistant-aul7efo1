
import { useState } from 'react';
import { Conversation } from '../types';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';
import { MessageSquarePlusIcon, Trash2Icon, PencilIcon, CheckIcon, XIcon } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation
}: ConversationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEditing = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle);
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button 
          onClick={onNewConversation} 
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <MessageSquarePlusIcon className="h-4 w-4" />
          New conversation
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {conversations.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No conversations yet
            </div>
          ) : (
            conversations
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map(conversation => (
                <div key={conversation.id} className="group relative">
                  {editingId === conversation.id ? (
                    <div className="flex items-center gap-1 p-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 p-2 text-sm rounded border focus:outline-none focus:ring-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing(conversation.id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => saveEditing(conversation.id)}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={cancelEditing}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant={activeConversationId === conversation.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-left font-normal truncate pr-8",
                        activeConversationId === conversation.id ? "bg-secondary" : "hover:bg-secondary/50"
                      )}
                      onClick={() => onSelectConversation(conversation.id)}
                    >
                      {conversation.title}
                    </Button>
                  )}
                  
                  {!editingId && activeConversationId === conversation.id && (
                    <div className="absolute right-1 top-1 flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(conversation);
                        }}
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                        <span className="sr-only">Rename</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                      >
                        <Trash2Icon className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}