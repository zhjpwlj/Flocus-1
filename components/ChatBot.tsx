import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Sparkles, Loader2, Minimize2, Maximize2, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your FocusFlow assistant. I can help you plan your schedule, break down tasks, or answer complex questions using my deep reasoning capabilities. How can I help?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Add a placeholder message for the streaming response
      const responseId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: responseId,
        role: 'model',
        text: '',
        isThinking: true
      }]);

      const stream = await sendMessageStream(chatSessionRef.current, userMessage.text);

      let fullText = '';
      
      for await (const chunk of stream) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => prev.map(msg => 
            msg.id === responseId 
              ? { ...msg, text: fullText, isThinking: false } 
              : msg
          ));
        }
      }
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed right-0 bottom-0 z-50 bg-white dark:bg-slate-900 shadow-2xl border-l border-t border-gray-200 dark:border-slate-800 transition-all duration-300 flex flex-col
        ${isExpanded ? 'w-full md:w-[600px] h-[80vh] rounded-tl-xl' : 'w-full md:w-96 h-[600px] rounded-tl-xl'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800 bg-indigo-600 rounded-tl-xl text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">FocusFlow AI</h3>
            <div className="flex items-center gap-1">
               <BrainCircuit size={10} className="text-indigo-200" />
               <span className="text-[10px] text-indigo-200 uppercase tracking-wider font-medium">Thinking Model Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors hidden md:block"
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-gray-100 dark:border-slate-700'
                }`}
            >
              {msg.isThinking && !msg.text ? (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <BrainCircuit size={16} className="animate-pulse text-indigo-500" />
                  <span className="text-xs font-medium italic">Reasoning deeply...</span>
                </div>
              ) : (
                 <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-pre:bg-slate-900 dark:prose-pre:bg-black/50 prose-pre:p-2 prose-pre:rounded-lg">
                   <ReactMarkdown>{msg.text}</ReactMarkdown>
                 </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything (e.g., 'Plan my study schedule for finals')..."
            className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none h-14 min-h-[56px] max-h-32 scrollbar-hide text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-lg transition-colors"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-indigo-500" />
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                Powered by Gemini 3 Pro • Optimized for complex reasoning
            </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
