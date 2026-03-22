"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gavel,
  MessageSquare,
  Send,
  ShieldCheck,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! How can I help with your legal queries or civic rights today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage }),
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "I couldn't process your request.",
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-2 rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border shadow-2xl backdrop-blur-sm h-[500px] flex flex-col">
      <div className="bg-background rounded-2xl overflow-hidden shadow-inner flex flex-col flex-1">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Gavel className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold">Sahayak Assistant</p>
              <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                Online
              </p>
            </div>
          </div>
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Chat Messages */}
        <div
          ref={scrollRef}
          className="flex-1 p-6 space-y-4 overflow-y-auto bg-muted/[0.02] scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                    msg.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <Gavel className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed max-w-full",
                    msg.role === "assistant"
                      ? "bg-muted/30 border border-primary/10 prose prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="markdown-container">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content
                          .replace(/\*\*(✅ DIRECT ANSWER|📖 LEGAL BASIS|🛠️ ACTIONABLE STEPS|⚠️ YOUR RIGHTS & CAUTIONS|❓ NEXT STEP)\*\*/g, "\n\n### $1\n\n")
                          .trim()}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 max-w-[85%]"
              >
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl text-sm italic text-muted-foreground">
                  Analyzing legal context...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t bg-muted/10 flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about BNS, rights, or procedures..."
              className="w-full h-11 bg-background border rounded-xl px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 rounded-xl"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
