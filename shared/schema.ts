import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  travelInterests: text("travel_interests"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // user or assistant
  createdAt: timestamp("created_at").defaultNow(),
});

export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  chatId: integer("chat_id"),
  destination: text("destination").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  title: text("title").notNull(),
  budget: integer("budget"),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  travelInterests: text("travel_interests"),
  newsletter: boolean("newsletter").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  travelInterests: true,
});

export const insertChatSchema = createInsertSchema(chats).pick({
  userId: true,
  title: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  chatId: true,
  content: true,
  role: true,
});

export const insertItinerarySchema = createInsertSchema(itineraries).pick({
  userId: true,
  chatId: true,
  destination: true,
  startDate: true,
  endDate: true,
  title: true,
  budget: true,
  content: true,
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  name: true,
  email: true,
  travelInterests: true,
  newsletter: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChat = z.infer<typeof insertChatSchema>;
export type Chat = typeof chats.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

// Chatbot specific types
export type ChatMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
};

export type ItineraryDay = {
  day: number;
  title: string;
  activities: Array<{
    type: string;
    title: string;
    description: string;
    cost?: number;
    icon?: string;
  }>;
};

export type Weather = {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
};

export type Budget = {
  accommodation: number;
  food: number;
  activities: number;
  transportation: number;
  miscellaneous: number;
  total: number;
};

export type ItineraryContent = {
  destination: string;
  duration: number;
  startDate?: string;
  endDate?: string;
  summary: string;
  days: ItineraryDay[];
  weather?: Weather[];
  budget?: Budget;
  mapLocation?: string;
};
