import OpenAI from "openai";
import { type ChatMessage, type ItineraryContent } from "@shared/schema";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-demo-key"  // Using environment variable
});

// Helper to make a system prompt for travel planning
function createTravelSystemPrompt() {
  return `You are TravelPal, an AI travel planning assistant specialized in creating personalized itineraries. 
Help users plan their trips by suggesting destinations, activities, accommodations, and transportation options.
Provide clear, concise, and practical travel advice based on the user's preferences, budget, and timeline.
For specific destinations, include local insights about cultural norms, best times to visit attractions, and hidden gems.
Respond in a friendly, enthusiastic tone and format your responses for easy reading.`;
}

// Generate a response to a chat message
export async function generateChatResponse(messages: Array<{role: string, content: string}>): Promise<string> {
  try {
    // Format messages for OpenAI API
    const formattedMessages: ChatCompletionMessageParam[] = messages.map(msg => {
      const role = msg.role === 'user' ? 'user' : 
                  msg.role === 'assistant' ? 'assistant' : 
                  msg.role === 'system' ? 'system' : 'user';
      return {
        role: role as 'system' | 'user' | 'assistant',
        content: msg.content
      };
    });
    
    // Add system message if not present
    if (!formattedMessages.some(msg => msg.role === "system")) {
      formattedMessages.unshift({
        role: "system",
        content: createTravelSystemPrompt()
      });
    }

    // Validate API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-demo-key") {
      console.warn("Missing or invalid OpenAI API key");
      return "I'm currently in demo mode. To enable full functionality, a valid OpenAI API key is required. Please contact the administrator.";
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "I'm having trouble generating a response. Please try again.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    
    // Provide more helpful error messages based on error type
    if (error.status === 429) {
      if (error.error?.type === "insufficient_quota") {
        return "My AI capabilities are temporarily unavailable due to API usage limits. Please try again later or contact the administrator about upgrading the API plan.";
      }
      return "I'm currently handling too many requests. Please try again in a moment.";
    } else if (error.status === 401) {
      return "I'm having authentication issues. Please contact the administrator to verify the API key.";
    }
    
    return "Sorry, I'm having trouble connecting to my AI capabilities right now. Please try again in a moment.";
  }
}

// Generate a complete itinerary based on user requirements
export async function generateItinerary(
  destination: string, 
  duration: number, 
  preferences: string, 
  budget?: number
): Promise<ItineraryContent> {
  try {
    // Validate API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-demo-key") {
      console.warn("Missing or invalid OpenAI API key for itinerary generation");
      throw new Error("API key required for itinerary generation");
    }
    
    const prompt = `Create a detailed ${duration}-day travel itinerary for ${destination} with these preferences: ${preferences}. ${budget ? `The budget is approximately $${budget}.` : ""}
    Format the response as a JSON object with the following structure:
    {
      "destination": "Destination name",
      "duration": number of days,
      "summary": "Brief description of the trip",
      "days": [
        {
          "day": day number,
          "title": "Title for this day",
          "activities": [
            {
              "type": "accommodation/food/activity/transportation",
              "title": "Name of place or activity",
              "description": "Brief description",
              "cost": estimated cost in USD,
              "icon": "suggested Font Awesome icon class"
            }
          ]
        }
      ],
      "budget": {
        "accommodation": total accommodation cost,
        "food": total food cost,
        "activities": total activities cost,
        "transportation": total transportation cost,
        "miscellaneous": miscellaneous costs,
        "total": total trip cost
      }
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: createTravelSystemPrompt() },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const itineraryJson = response.choices[0].message.content || "{}";
    const itinerary: ItineraryContent = JSON.parse(itineraryJson);
    
    return {
      ...itinerary,
      mapLocation: destination // For Google Maps integration
    };
  } catch (error: any) {
    console.error("Error generating itinerary:", error);
    
    // Provide more helpful error messages based on error type
    if (error.status === 429) {
      if (error.error?.type === "insufficient_quota") {
        throw new Error("AI capabilities are temporarily unavailable due to API usage limits. Please try again later.");
      }
      throw new Error("Currently handling too many requests. Please try again in a moment.");
    } else if (error.status === 401) {
      throw new Error("Authentication issues detected. Please verify API credentials.");
    }
    
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}

// Extract travel information from chat history
export async function extractTravelInfo(messages: Array<{role: string, content: string}>) {
  try {
    // Validate API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-demo-key") {
      console.warn("Missing or invalid OpenAI API key for travel info extraction");
      return null;
    }
    
    const prompt = `Based on the conversation, extract the following travel information:
    - Destination
    - Duration (number of days)
    - Preferred travel dates (if mentioned)
    - Budget (if mentioned)
    - Interests and preferences
    
    Format the response as a JSON object with these fields. If any information is not provided, use null for that field.`;

    // Format messages to ensure they have valid role values
    const formattedMessages = messages.map(msg => {
      const role = msg.role === 'user' ? 'user' : 
                  msg.role === 'assistant' ? 'assistant' : 
                  msg.role === 'system' ? 'system' : 'user';
      return {
        role: role as 'system' | 'user' | 'assistant',
        content: msg.content
      };
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        ...formattedMessages,
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const travelInfoJson = response.choices[0].message.content || "{}";
    return JSON.parse(travelInfoJson);
  } catch (error: any) {
    console.error("Error extracting travel info:", error);
    
    // Handle specific API errors
    if (error.status === 429 || error.status === 401) {
      return null;
    }
    
    return null;
  }
}
