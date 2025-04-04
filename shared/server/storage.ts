import { 
  users, type User, type InsertUser,
  chats, type Chat, type InsertChat,
  messages, type Message, type InsertMessage,
  itineraries, type Itinerary, type InsertItinerary,
  waitlist, type Waitlist, type InsertWaitlist,
  type ItineraryContent, type ChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat methods
  getChat(id: number): Promise<Chat | undefined>;
  getChatsByUser(userId: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  
  // Message methods
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesByChat(chatId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Itinerary methods
  getItinerary(id: number): Promise<Itinerary | undefined>;
  getItinerariesByUser(userId: number): Promise<Itinerary[]>;
  getItineraryByChat(chatId: number): Promise<Itinerary | undefined>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  
  // Waitlist methods
  getWaitlistEntry(id: number): Promise<Waitlist | undefined>;
  getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined>;
  createWaitlistEntry(entry: InsertWaitlist): Promise<Waitlist>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Chat methods
  async getChat(id: number): Promise<Chat | undefined> {
    const result = await db.select().from(chats).where(eq(chats.id, id));
    return result[0];
  }
  
  async getChatsByUser(userId: number): Promise<Chat[]> {
    return await db.select().from(chats).where(eq(chats.userId, userId));
  }
  
  async createChat(insertChat: InsertChat): Promise<Chat> {
    const result = await db.insert(chats).values(insertChat).returning();
    return result[0];
  }
  
  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    return result[0];
  }
  
  async getMessagesByChat(chatId: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(insertMessage).returning();
    return result[0];
  }
  
  // Itinerary methods
  async getItinerary(id: number): Promise<Itinerary | undefined> {
    const result = await db.select().from(itineraries).where(eq(itineraries.id, id));
    return result[0];
  }
  
  async getItinerariesByUser(userId: number): Promise<Itinerary[]> {
    return await db.select().from(itineraries).where(eq(itineraries.userId, userId));
  }
  
  async getItineraryByChat(chatId: number): Promise<Itinerary | undefined> {
    const result = await db.select().from(itineraries).where(eq(itineraries.chatId, chatId));
    return result[0];
  }
  
  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const result = await db.insert(itineraries).values(insertItinerary).returning();
    return result[0];
  }
  
  // Waitlist methods
  async getWaitlistEntry(id: number): Promise<Waitlist | undefined> {
    const result = await db.select().from(waitlist).where(eq(waitlist.id, id));
    return result[0];
  }
  
  async getWaitlistEntryByEmail(email: string): Promise<Waitlist | undefined> {
    const result = await db.select().from(waitlist).where(eq(waitlist.email, email));
    return result[0];
  }
  
  async createWaitlistEntry(insertWaitlist: InsertWaitlist): Promise<Waitlist> {
    const result = await db.insert(waitlist).values(insertWaitlist).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
