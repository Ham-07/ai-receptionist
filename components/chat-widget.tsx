"use client";

import * as React from "react";
import { WidgetSettings } from "@/lib/supabase/types";
import { LeadForm } from "@/components/lead-form";
import { Bot, X, Send, Minus, Sparkles, MessageSquare, Mail } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  businessId: string;
  businessName: string;
  widgetSettings: WidgetSettings | null;
  primaryColor?: string | null;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700/80">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="chat-widget-dot w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

function AssistantAvatar({ color }: { color: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white dark:ring-slate-900"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
      }}
    >
      <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
    </div>
  );
}

export function ChatWidget({
  businessId,
  businessName,
  widgetSettings,
  primaryColor,
}: ChatWidgetProps) {
  const themeColor =
    widgetSettings?.themeColor || primaryColor || "#6366f1";
  const position = widgetSettings?.position || "bottom-right";
  const greeting =
    widgetSettings?.greeting ||
    `Hello! Welcome to ${businessName}. How can we assist you today?`;

  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"chat" | "lead">("chat");
  const [showTeaser, setShowTeaser] = React.useState(true);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [hasGreeted, setHasGreeted] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isLeft = position === "bottom-left";

  React.useEffect(() => {
    const isIframe = typeof window !== "undefined" && window.self !== window.top;
    if (!isIframe) return;

    // Send initialization info (like alignment/position)
    window.parent.postMessage({ type: "receptionist-init", position }, "*");

    // Send size resize commands
    let state: "open" | "closed-teaser" | "closed-only" = "closed-only";
    if (isOpen) {
      state = "open";
    } else if (showTeaser) {
      state = "closed-teaser";
    }
    window.parent.postMessage({ type: "receptionist-resize", state }, "*");
  }, [isOpen, showTeaser, position]);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    if (activeTab === "chat") {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTab, scrollToBottom]);

  React.useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: greeting,
          timestamp: new Date(),
        },
      ]);
      setHasGreeted(true);
      setShowTeaser(false);
    }
  }, [isOpen, hasGreeted, greeting]);

  React.useEffect(() => {
    if (isOpen && activeTab === "chat") {
      inputRef.current?.focus();
    }
  }, [isOpen, activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setIsTyping(true);

    const appendReply = (content: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content,
          timestamp: new Date(),
        },
      ]);
    };

    try {
      const res = await fetch(`/api/chat/${businessId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (res.status === 429) {
        appendReply("I'll ask our team to contact you.");
      } else if (!res.ok) {
        appendReply("Something went wrong. Please try again later.");
      } else {
        const data = await res.json();
        appendReply(data.reply || "I'll ask our team to contact you.");
      }
    } catch {
      appendReply("Something went wrong. Please try again later.");
    } finally {
      setIsTyping(false);
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setShowTeaser(false);
  };

  return (
    <div
      className={`fixed bottom-5 sm:bottom-6 z-50 flex flex-col items-end gap-3 ${
        isLeft ? "left-5 sm:left-6 items-start" : "right-5 sm:right-6"
      }`}
    >
      {/* Teaser bubble */}
      {!isOpen && showTeaser && (
        <div
          className={`chat-widget-teaser relative max-w-[260px] sm:max-w-[280px] ${
            isLeft ? "self-start" : "self-end"
          }`}
        >
          <button
            onClick={() => setShowTeaser(false)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors z-10"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
          <button
            onClick={openChat}
            className="block w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-shadow"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {businessName}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
              {greeting}
            </p>
            <p
              className="text-xs font-medium mt-2.5"
              style={{ color: themeColor }}
            >
              Start a conversation →
            </p>
          </button>
          <div
            className={`absolute -bottom-2 w-4 h-4 bg-white dark:bg-slate-900 border-r border-b border-slate-100 dark:border-slate-800 rotate-45 ${
              isLeft ? "left-6" : "right-6"
            }`}
          />
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`chat-widget-panel flex flex-col overflow-hidden rounded-[20px] bg-white dark:bg-slate-900 shadow-[0_5px_40px_rgba(0,0,0,0.16)] border border-slate-200/60 dark:border-slate-700/60
            w-[calc(100vw-2.5rem)] sm:w-[400px] h-[min(600px,calc(100vh-5rem))] sm:h-[580px]`}
        >
          {/* Header */}
          <div
            className="relative shrink-0 px-5 pt-5 pb-3 text-white overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${themeColor} 0%, ${themeColor}dd 50%, ${themeColor}bb 100%)`,
            }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-12 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                    <Bot className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white/80" />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="font-semibold text-[15px] leading-tight truncate">
                    {businessName}
                  </p>
                  <p className="text-xs text-white/80 mt-0.5">
                    AI Concierge & Digital Reception
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/15 transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/15 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode Tab Selector (AI Chat vs Leave Message) */}
            <div className="relative flex items-center p-1 rounded-xl bg-black/15 backdrop-blur-md">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "chat"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Chat</span>
              </button>
              <button
                onClick={() => setActiveTab("lead")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "lead"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Leave Message</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "chat" ? (
            <>
              {/* Messages View */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-[#f4f5f7] dark:bg-slate-950/80 chat-widget-scroll">
                <div className="flex justify-center">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700/60">
                    Today
                  </span>
                </div>

                {messages.map((msg) =>
                  msg.role === "assistant" ? (
                    <div key={msg.id} className="flex gap-2.5 items-end max-w-[92%]">
                      <AssistantAvatar color={themeColor} />
                      <div className="space-y-1 min-w-0">
                        <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100/80 dark:border-slate-700/60">
                          {msg.content}
                        </div>
                        <p className="text-[10px] text-slate-400 pl-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div key={msg.id} className="flex flex-col items-end gap-1">
                      <div
                        className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-[13.5px] leading-relaxed text-white shadow-sm"
                        style={{ backgroundColor: themeColor }}
                      >
                        {msg.content}
                      </div>
                      <p className="text-[10px] text-slate-400 pr-1">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  )
                )}

                {isTyping && (
                  <div className="flex gap-2.5 items-end">
                    <AssistantAvatar color={themeColor} />
                    <TypingIndicator />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="shrink-0 px-4 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Write a message..."
                    className="w-full pl-4 pr-12 py-3 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-transparent focus:outline-none focus:border-slate-200 dark:focus:border-slate-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-1.5 p-2.5 rounded-full text-white transition-all disabled:opacity-30 disabled:scale-95 hover:scale-105 active:scale-95 shadow-sm"
                    style={{ backgroundColor: themeColor }}
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </form>
                <p className="text-center text-[10px] text-slate-400 mt-2.5 tracking-wide">
                  Powered by AI Receptionist
                </p>
              </div>
            </>
          ) : (
            /* Lead Form View */
            <div className="flex-1 overflow-y-auto p-5 bg-[#f4f5f7] dark:bg-slate-950/80 chat-widget-scroll">
              <div className="mb-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Direct Lead Inquiry
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Send your details to {businessName}. We will respond directly to your email.
                </p>
              </div>

              <LeadForm
                businessId={businessId}
                businessName={businessName}
                primaryColor={themeColor}
              />
            </div>
          )}
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => (isOpen ? setIsOpen(false) : openChat())}
        className="chat-widget-launcher group relative w-[56px] h-[56px] rounded-full text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{
          background: `linear-gradient(145deg, ${themeColor} 0%, ${themeColor}cc 100%)`,
          boxShadow: `0 4px 14px ${themeColor}66, 0 8px 24px rgba(0,0,0,0.12)`,
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <span
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 rotate-90"
          }`}
        >
          <X className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={2.5} />
        </span>
        <span
          className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? "scale-0 opacity-0 -rotate-90" : "scale-100 opacity-100 rotate-0"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </span>

        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full chat-widget-pulse pointer-events-none"
            style={{ borderColor: `${themeColor}55` }}
          />
        )}
      </button>
    </div>
  );
}
