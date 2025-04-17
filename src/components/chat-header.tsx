
import { Button } from './ui/button';
import { MenuIcon, XIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  conversationTitle: string;
}

export function ChatHeader({ isSidebarOpen, toggleSidebar, conversationTitle }: ChatHeaderProps) {
  return (
    <header className="border-b bg-background h-14 flex items-center px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3 w-full max-w-screen-2xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <XIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </Button>
        
        <div className={cn(
          "font-semibold truncate transition-opacity",
          isSidebarOpen ? "opacity-0 md:opacity-100" : "opacity-100"
        )}>
          {conversationTitle}
        </div>
      </div>
    </header>
  );
}