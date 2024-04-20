"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CornerDownLeft, Mic, Paperclip, type User } from "lucide-react";
import { useWebSocket } from "next-ws/client";
import { useCallback, useEffect, useRef, useState } from "react";

type MessageType = {
  text: string;
  recipient: string;
};

export function Message({ user, message }: { user: string; message: MessageType }) {
  return (
    <Alert>
      {/* <RocketIcon className="h-4 w-4" /> */}
      <AlertTitle>{user}</AlertTitle>
      <AlertDescription>{message.text}</AlertDescription>
    </Alert>
  );
}

export function MessagePane({ user, conversating }: { user: string; conversating: string }) {
  const ws = useWebSocket();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const onMessage = useCallback((event: MessageEvent<string>) => {
    const message = JSON.parse(event.data) as MessageType;

    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    ws?.addEventListener("message", onMessage);
    return () => ws?.removeEventListener("message", onMessage);
  }, [onMessage, ws]);

  return (
    <div hx-ext="ws" ws-connect="/api/ws" className={cn("relative flex h-full", "flex-col rounded-xl bg-muted/50 p-4")}>
      <Badge variant="outline" className="absolute right-3 top-3">
        {user}
      </Badge>
      <div className="flex-1 overflow-y-auto space-y-4 mt-10" id="messages" hx-swap-oob="beforeend">
        {messages
          .filter((message) => message.recipient === user)
          .map((message, index) => (
            <Message key={index} user={user} message={message} />
          ))}
      </div>

      <form
        id="form"
        // hx-boost="true"
        ws-send="true"
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        x-chunk="dashboard-03-chunk-1"
      >
        <>
          <input type="hidden" value={conversating} name="recipient" />
        </>
        <>
          <Label htmlFor="message" className="sr-only">
            Message
          </Label>
          <Textarea
            id="message"
            name="text"
            placeholder="Type your message here..."
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
            ref={inputRef}
          />
          <div className="flex items-center p-3 pt-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="size-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach File</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Mic className="size-4" />
                    <span className="sr-only">Use Microphone</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Use Microphone</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button type="submit" size="sm" className="ml-auto gap-1.5" value="send">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </>
      </form>
    </div>
  );
}
