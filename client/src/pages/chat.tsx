import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { ChatMessageItem, ChatMessageLoading } from "@/components/ui/chat-message";
import { ChatInput } from "@/components/ui/chat-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";
import { type ChatMessage } from "@shared/schema";
import { useChatContext } from "@/contexts/ChatContext";
import { Plane } from "lucide-react";

export default function ChatPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isNewChat, setIsNewChat] = useState(true);
  const { 
    messages, 
    addMessage, 
    setMessages, 
    chatId, 
    setChatId,
    isGeneratingItinerary,
    setIsGeneratingItinerary 
  } = useChatContext();
  
  // Create a new chat when the component mounts if we don't have one already
  useEffect(() => {
    if (!chatId) {
      createChat();
    }
  }, [chatId]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const createChat = async () => {
    try {
      const response = await apiRequest("POST", "/api/chat", { title: "New Chat" });
      const data = await response.json();
      setChatId(data.id);
      
      // Fetch messages for the new chat
      refetchMessages();
    } catch (error) {
      console.error("Error creating chat:", error);
      toast({
        title: "Error",
        description: "Failed to create a new chat session",
        variant: "destructive",
      });
    }
  };
  
  // Fetch chat messages
  const { 
    data: chatData,
    refetch: refetchMessages,
    isLoading: isLoadingMessages
  } = useQuery({
    queryKey: [chatId ? `/api/chat/${chatId}` : null],
    enabled: !!chatId,
  });
  
  // Update messages when chat data is loaded
  useEffect(() => {
    if (chatData && chatData.messages) {
      const formattedMessages: ChatMessage[] = chatData.messages.map((msg: any) => ({
        id: String(msg.id),
        content: msg.content,
        role: msg.role,
        timestamp: new Date(msg.createdAt)
      }));
      
      setMessages(formattedMessages);
      setIsNewChat(false);
    }
  }, [chatData]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!chatId) throw new Error("No active chat");
      
      return apiRequest("POST", `/api/chat/${chatId}/message`, { content });
    },
    onSuccess: async () => {
      // Refetch messages
      queryClient.invalidateQueries({ queryKey: [`/api/chat/${chatId}`] });
      await refetchMessages();
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  });
  
  const handleSendMessage = async (message: string) => {
    // Optimistically add user message to UI
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    
    // Show loading state
    const loadingMessage: ChatMessage = {
      id: 'loading',
      content: 'Thinking...',
      role: 'assistant',
      timestamp: new Date()
    };
    
    addMessage(loadingMessage);
    
    // Send message to API
    try {
      await sendMessageMutation.mutateAsync(message);
    } catch (error) {
      // Error is handled in the mutation's onError
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const generateItinerary = () => {
    setIsGeneratingItinerary(true);
    toast({
      title: "Generating Itinerary",
      description: "We're creating your personalized travel plan. You'll be redirected when it's ready.",
    });
    
    // In a real application, you would extract travel info and generate an itinerary
    // For demo purposes, we'll redirect to the itinerary page after a delay
    setTimeout(() => {
      setIsGeneratingItinerary(false);
      window.location.href = "/itinerary";
    }, 3000);
  };
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-grow md:w-3/4">
          <Card className="h-[calc(100vh-150px)] flex flex-col shadow-lg">
            <CardHeader className="bg-primary p-4 text-white">
              <CardTitle className="flex items-center">
                <Plane className="h-5 w-5 mr-2" />
                TravelPal Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 bg-muted/50 relative">
              <ScrollArea className="h-[calc(100vh-280px)] p-4">
                <div className="space-y-4">
                  {isLoadingMessages ? (
                    <ChatMessageLoading />
                  ) : (
                    messages.map((message) => (
                      <ChatMessageItem 
                        key={message.id} 
                        message={message} 
                        isLoading={message.id === 'loading'} 
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t bg-background">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  disabled={sendMessageMutation.isPending || isLoadingMessages}
                  placeholder="Ask about destinations, activities, or travel tips..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/4">
          <Card className="shadow-lg">
            <CardHeader className="bg-primary p-4 text-white">
              <CardTitle className="text-base">Travel Planning Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>Ask TravelPal about:</p>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li>Destination recommendations</li>
                    <li>Activities and attractions</li>
                    <li>Travel budgeting</li>
                    <li>Local customs and tips</li>
                    <li>Weather information</li>
                    <li>Accommodation options</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={generateItinerary}
                    disabled={
                      isNewChat || 
                      messages.length < 3 || 
                      isGeneratingItinerary
                    }
                  >
                    {isGeneratingItinerary ? "Generating..." : "Generate Itinerary"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={createChat}
                    disabled={sendMessageMutation.isPending || isGeneratingItinerary}
                  >
                    New Conversation
                  </Button>
                  
                  <Link href="/">
                    <Button variant="ghost" className="w-full">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
