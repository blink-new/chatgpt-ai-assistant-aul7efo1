
import { nanoid } from 'nanoid';
import { Conversation, Message } from '../types';

// Local storage keys
const CONVERSATIONS_KEY = 'ai-assistant-conversations';
const ACTIVE_CONVERSATION_KEY = 'ai-assistant-active-conversation';

// Get conversations from local storage
export function getConversations(): Conversation[] {
  const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
  if (!storedConversations) return [];
  
  try {
    const parsed = JSON.parse(storedConversations);
    return parsed.map((conversation: any) => ({
      ...conversation,
      createdAt: new Date(conversation.createdAt),
      updatedAt: new Date(conversation.updatedAt),
      messages: conversation.messages.map((message: any) => ({
        ...message,
        createdAt: new Date(message.createdAt)
      }))
    }));
  } catch (error) {
    console.error('Failed to parse conversations:', error);
    return [];
  }
}

// Save conversations to local storage
export function saveConversations(conversations: Conversation[]): void {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

// Get active conversation ID
export function getActiveConversationId(): string | null {
  return localStorage.getItem(ACTIVE_CONVERSATION_KEY);
}

// Set active conversation ID
export function setActiveConversationId(id: string): void {
  localStorage.setItem(ACTIVE_CONVERSATION_KEY, id);
}

// Create a new conversation
export function createConversation(title: string = 'New conversation'): Conversation {
  const now = new Date();
  return {
    id: nanoid(),
    title,
    messages: [],
    createdAt: now,
    updatedAt: now
  };
}

// Add message to conversation
export function addMessageToConversation(
  conversations: Conversation[],
  conversationId: string,
  content: string,
  role: 'user' | 'assistant'
): { conversations: Conversation[], message: Message } {
  const message: Message = {
    id: nanoid(),
    content,
    role,
    createdAt: new Date()
  };

  const updatedConversations = conversations.map(conversation => {
    if (conversation.id === conversationId) {
      return {
        ...conversation,
        messages: [...conversation.messages, message],
        updatedAt: new Date()
      };
    }
    return conversation;
  });

  saveConversations(updatedConversations);
  return { conversations: updatedConversations, message };
}

// Generate AI response (simulated)
export async function generateAIResponse(message: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    "I understand what you're saying. Can you tell me more?",
    "That's an interesting perspective. Let me think about that.",
    "Based on our previous conversations, I think we should explore this further.",
    "I remember you mentioned something similar before. Let's build on that idea.",
    "Thanks for sharing that with me. I've noted it for future reference.",
    "I'm here to help you with any questions or tasks you have.",
    "Let me analyze that information and provide you with a thoughtful response.",
    "I appreciate your patience as I process this information.",
    "That's a great question. Let me provide a comprehensive answer.",
    "I'm learning from our conversation and adapting to better assist you."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Update conversation title
export function updateConversationTitle(
  conversations: Conversation[],
  conversationId: string,
  newTitle: string
): Conversation[] {
  const updatedConversations = conversations.map(conversation => {
    if (conversation.id === conversationId) {
      return {
        ...conversation,
        title: newTitle,
        updatedAt: new Date()
      };
    }
    return conversation;
  });

  saveConversations(updatedConversations);
  return updatedConversations;
}

// Delete conversation
export function deleteConversation(
  conversations: Conversation[],
  conversationId: string
): Conversation[] {
  const updatedConversations = conversations.filter(
    conversation => conversation.id !== conversationId
  );

  saveConversations(updatedConversations);
  return updatedConversations;
}