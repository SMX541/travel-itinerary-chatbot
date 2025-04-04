import React, { createContext, useContext, useState, useEffect } from "react";
import { type ChatMessage, type ItineraryContent } from "@shared/schema";

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  chatId: number | null;
  setChatId: (id: number | null) => void;
  itinerary: ItineraryContent | null;
  setItinerary: (itinerary: ItineraryContent | null) => void;
  isGeneratingItinerary: boolean;
  setIsGeneratingItinerary: (isGenerating: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryContent | null>(null);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  
  const addMessage = (message: ChatMessage) => {
    
    if (message.id === 'loading') {
      setMessages(prev => {
        const hasLoading = prev.some(m => m.id === 'loading');
        if (hasLoading) {
          return prev.map(m => m.id === 'loading' ? message : m);
        }
        return [...prev, message];
      });
    } else {

      setMessages(prev => {
        if (message.role === 'assistant' && prev.some(m => m.id === 'loading')) {
          return prev.filter(m => m.id !== 'loading').concat(message);
        }
        return [...prev, message];
      });
    }
  };
  
  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        addMessage, 
        setMessages, 
        chatId, 
        setChatId,
        itinerary,
        setItinerary,
        isGeneratingItinerary,
        setIsGeneratingItinerary
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  
  return context;
}
