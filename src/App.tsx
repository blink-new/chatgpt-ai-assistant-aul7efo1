
import { useState, useEffect } from 'react';
import { ConversationList } from './components/conversation-list';
import { ChatMessage } from './components/chat-message';
import { ChatInput } from './components/chat-input';
import { ChatHeader } from './components/chat-header';
import { EmptyScreen } from './components/empty-screen';
import { ScrollArea } from './components/ui/scroll-area';
import { Conversation } from './types';
import { 
  getConversations, 
  saveConversations, 
  getActiveConversationId, 
  setActiveConversationId,
  createConversation,
  addMessageToConversation,
  generateAIResponse,
  updateConversationTitle,
  deleteConversation
} from './lib/data';
import { cn } from './lib/utils';
import { useMediaQuery } from 'react-responsive';

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Initialize from local storage
  useEffect(() => {
    const storedConversations = getConversations();
    setConversations(storedConversations);
    
    const storedActiveId = getActiveConversationId();
    if (storedActiveId && storedConversations.some(c => c.id === storedActiveId)) {
      setActiveConversationId(storedActiveId);
    }
  }, []);

  // Close sidebar on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && activeConversationId) {
      setIsSidebarOpen(false);
    }
  }, [activeConversationId, isMobile]);

  // Get active conversation
  const activeConversation = activeConversationId 
    ? conversations.find(c => c.id === activeConversationId) 
    : null;

  // Handle selecting a conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setActiveConversationId(id);
  };

  // Handle creating a new conversation
  const handleNewConversation = (initialMessage?: string) => {
    const newConversation = createConversation();
    const updatedConversations = [...conversations, newConversation];
    
    setConversations(updatedConversations);
    setActiveConversationId(newConversation.id);
    setActiveConversationId(newConversation.id);
    saveConversations(updatedConversations);
    
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return;
    
    // Add user message
    const { conversations: updatedConversations } = addMessageToConversation(
      conversations,
      activeConversationId,
      content,
      'user'
    );
    
    setConversations(updatedConversations);
    
    // Generate AI response
    setIsLoading(true);
    try {
      const aiResponse = await generateAIResponse(content);
      
      // Add AI message
      const { conversations: finalConversations } = addMessageToConversation(
        updatedConversations,
        activeConversationId,
        aiResponse,
        'assistant'
      );
      
      setConversations(finalConversations);
      
      // Update conversation title if it's the first message
      const conversation = updatedConversations.find(c => c.id === activeConversationId);
      if (conversation && conversation.messages.length === 1) {
        // Use the first few words of the first message as the title
        const newTitle = content.split(' ').slice(0, 5).join(' ') + (content.split(' ').length > 5 ? '...' : '');
        const titledConversations = updateConversationTitle(finalConversations, activeConversationId, newTitle);
        setConversations(titledConversations);
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a conversation
  const handleDeleteConversation = (id: string) => {
    const updatedConversations = deleteConversation(conversations, id);
    setConversations(updatedConversations);
    
    if (activeConversationId === id) {
      const newActiveId = updatedConversations.length > 0 ? updatedConversations[0].id : null;
      setActiveConversationId(newActiveId);
      if (newActiveId) {
        setActiveConversationId(newActiveId);
      } else {
        localStorage.removeItem(getActiveConversationId() || '');
      }
    }
  };

  // Handle renaming a conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    const updatedConversations = updateConversationTitle(conversations, id, newTitle);
    setConversations(updatedConversations);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-full max-w-xs border-r bg-background transition-transform duration-300 md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ConversationList 
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={() => handleNewConversation()}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
        />
      </div>
      
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <ChatHeader 
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          conversationTitle={activeConversation?.title || 'New conversation'}
        />
        
        <main className="flex-1 overflow-hidden">
          {activeConversation ? (
            <>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                {activeConversation.messages.length === 0 ? (
                  <EmptyScreen onNewConversation={handleNewConversation} />
                ) : (
                  <div className="pb-[200px]">
                    {activeConversation.messages.map((message, index) => (
                      <ChatMessage 
                        key={message.id} 
                        message={message} 
                        isLastMessage={index === activeConversation.messages.length - 1}
                      />
                    ))}
                    {isLoading && (
                      <div className="py-6 px-4 md:px-8 lg:px-12 flex">
                        <div className="max-w-3xl mx-auto w-full">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0">
                              AI
                            </div>
                            <div className="flex-1">
                              <div className="h-4 w-12 bg-secondary-300 rounded animate-pulse mb-2"></div>
                              <div className="h-4 w-full max-w-md bg-secondary-200 rounded animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              
              <div className="absolute bottom-0 left-0 right-0">
                <ChatInput 
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            </>
          ) : (
            <EmptyScreen onNewConversation={handleNewConversation} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;