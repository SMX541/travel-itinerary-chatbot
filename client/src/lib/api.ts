import { apiRequest } from "./queryClient";
import { type ChatMessage, type ItineraryContent } from "@shared/schema";

// Chat API functions
export async function createChat(title: string = "New Chat") {
  const response = await apiRequest("POST", "/api/chat", { title });
  return response.json();
}

export async function getChat(chatId: number) {
  const response = await apiRequest("GET", `/api/chat/${chatId}`);
  return response.json();
}

export async function sendMessage(chatId: number, content: string) {
  const response = await apiRequest("POST", `/api/chat/${chatId}/message`, { content });
  return response.json();
}

// Itinerary API functions
export async function createItinerary(data: {
  userId?: number | null;
  chatId: number;
  destination: string;
  startDate?: string;
  endDate?: string;
  title: string;
  budget?: number;
  content: ItineraryContent;
}) {
  const response = await apiRequest("POST", "/api/itinerary", data);
  return response.json();
}

export async function getItinerary(itineraryId: number) {
  const response = await apiRequest("GET", `/api/itinerary/${itineraryId}`);
  return response.json();
}

// Weather API functions
export async function getWeatherForecast(location: string, days: number = 5) {
  const response = await apiRequest(
    "GET", 
    `/api/weather?location=${encodeURIComponent(location)}&days=${days}`
  );
  return response.json();
}

// Places API functions
export async function searchPlaces(query: string, type?: string) {
  let url = `/api/places?query=${encodeURIComponent(query)}`;
  if (type) {
    url += `&type=${encodeURIComponent(type)}`;
  }
  
  const response = await apiRequest("GET", url);
  return response.json();
}

// Waitlist API functions
export async function addToWaitlist(data: {
  name: string;
  email: string;
  travelInterests?: string;
  newsletter: boolean;
}) {
  const response = await apiRequest("POST", "/api/waitlist", data);
  return response.json();
}
