import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./lib/openai";
import { getWeatherForecast } from "./lib/weather";
import { searchPlaces } from "./lib/places";
import { z } from "zod";
import { 
  insertWaitlistSchema,
  insertChatSchema,
  insertMessageSchema,
  insertItinerarySchema,
  type ChatMessage,
  type ItineraryContent
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/waitlist", async (req: Request, res: Response) => {
    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      
      const existingEntry = await storage.getWaitlistEntryByEmail(validatedData.email);
      if (existingEntry) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      const entry = await storage.createWaitlistEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const chat = await storage.createChat({
        userId: null,
        title: req.body.title || "New Chat"
      });
      
      await storage.createMessage({
        chatId: chat.id,
        content: "Hi there! I'm your TravelPal assistant. Where would you like to travel?",
        role: "assistant"
      });
      
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ message: "Could not create chat" });
    }
  });
  
  app.get("/api/chat/:id", async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.id);
      const chat = await storage.getChat(chatId);
      
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      const messages = await storage.getMessagesByChat(chatId);
      res.json({ chat, messages });
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve chat" });
    }
  });
  
  app.post("/api/chat/:id/message", async (req: Request, res: Response) => {
    try {
      const chatId = parseInt(req.params.id);
      const chat = await storage.getChat(chatId);
      
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      const validatedData = insertMessageSchema.parse({
        chatId,
        content: req.body.content,
        role: "user"
      });
      
      const userMessage = await storage.createMessage(validatedData);
      
      const allMessages = await storage.getMessagesByChat(chatId);
      
      const formattedMessages = allMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }));
      
      const aiResponse = await generateChatResponse(formattedMessages);
      
      const assistantMessage = await storage.createMessage({
        chatId,
        content: aiResponse,
        role: "assistant"
      });
      
      res.status(201).json({
        userMessage,
        assistantMessage
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Could not process message" });
    }
  });
  
  app.post("/api/itinerary", async (req: Request, res: Response) => {
    try {
      const validatedData = insertItinerarySchema.parse(req.body);
      const itinerary = await storage.createItinerary(validatedData);
      res.status(201).json(itinerary);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Could not create itinerary" });
    }
  });
  
  app.get("/api/itinerary/:id", async (req: Request, res: Response) => {
    try {
      const itineraryId = parseInt(req.params.id);
      const itinerary = await storage.getItinerary(itineraryId);
      
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      res.json(itinerary);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve itinerary" });
    }
  });
  
  app.get("/api/weather", async (req: Request, res: Response) => {
    try {
      const { location, days } = req.query;
      
      if (!location) {
        return res.status(400).json({ message: "Location is required" });
      }
      
      const forecast = await getWeatherForecast(
        location as string, 
        days ? parseInt(days as string) : 5
      );
      
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve weather data" });
    }
  });
  
  app.get("/api/places", async (req: Request, res: Response) => {
    try {
      const { query, type } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const places = await searchPlaces(
        query as string,
        type as string
      );
      
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: "Could not retrieve places data" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
