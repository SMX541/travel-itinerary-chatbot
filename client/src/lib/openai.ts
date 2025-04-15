import { apiRequest } from "./queryClient";
import { type ChatMessage, type ItineraryContent } from "@shared/schema";

// This is a client-side wrapper for the OpenAI service
// The actual API calls to OpenAI are made from the server for security reasons

/**
 * Sends a message to the chatbot and returns the response
 */
export async function sendChatMessage(chatId: number, message: string): Promise<ChatMessage> {
  try {
    const response = await apiRequest("POST", `/api/chat/${chatId}/message`, { content: message });
    const data = await response.json();
    
    return {
      id: String(data.assistantMessage.id),
      content: data.assistantMessage.content,
      role: 'assistant',
      timestamp: new Date(data.assistantMessage.createdAt)
    };
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

/**
 * Requests generation of a complete itinerary based on a conversation
 */
export async function generateItineraryFromChat(chatId: number): Promise<ItineraryContent> {
  try {
    // In a real implementation, this would extract travel details from the chat
    // and then generate an itinerary
    const response = await apiRequest("POST", `/api/chat/${chatId}/itinerary`, {});
    const data = await response.json();
    
    return data.itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}

/**
 * Generates an itinerary directly from parameters without a chat
 */
export async function generateItinerary(
  destination: string,
  duration: number,
  preferences: string,
  budget?: number
): Promise<ItineraryContent> {
  try {
    const response = await apiRequest("POST", `/api/itinerary/generate`, {
      destination,
      duration,
      preferences,
      budget
    });
    
    const data = await response.json();
    return data.itinerary;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}
