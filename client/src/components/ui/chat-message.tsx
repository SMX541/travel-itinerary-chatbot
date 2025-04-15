import { useState } from "react";
import { type ChatMessage } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, User, Loader2 } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export function ChatMessageItem({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "flex items-start gap-2 max-w-[80%]", 
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <Avatar className={cn(
          "h-8 w-8 rounded-full", 
          isUser ? "bg-primary" : "bg-secondary"
        )}>
          <AvatarFallback>
            {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
          </AvatarFallback>
        </Avatar>
        
        <Card className={cn(
          "shadow-sm", 
          isUser 
            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
            : "bg-card text-card-foreground rounded-2xl rounded-tl-sm"
        )}>
          <CardContent className={cn("p-3 text-sm sm:text-base whitespace-pre-wrap")}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            ) : (
              message.content
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ChatMessageLoading() {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2 max-w-[80%]">
        <Avatar className="h-8 w-8 rounded-full bg-secondary">
          <AvatarFallback>
            <Bot className="h-4 w-4 text-white" />
          </AvatarFallback>
        </Avatar>
        
        <Card className="bg-card text-card-foreground rounded-2xl rounded-tl-sm shadow-sm">
          <CardContent className="p-3 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
