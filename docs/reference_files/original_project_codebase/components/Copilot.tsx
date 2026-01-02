import React, { useState, useRef, useEffect } from 'react';
import { generateThinkingResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, BrainCircuit, Loader2 } from 'lucide-react';

const Copilot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hello, I am the HVAC AI Copilot. I have access to full ASHRAE standards, your project blueprints, and advanced geometric reasoning. Ask me to analyze efficiency, check compliance, or optimize distribution layouts.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Prepare history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await generateThinkingResponse(userMsg.text, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error while thinking. Please check your API configuration.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-200">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BrainCircuit className="text-purple-400" />
            Neuro-Symbolic Copilot
          </h2>
          <p className="text-sm text-slate-400">Powered by Gemini 3.0 Pro • Thinking Mode Enabled (32k Budget)</p>
        </div>
        <div className="px-3 py-1 rounded bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20">
          DEEP REASONING ACTIVE
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-slate-700' : 'bg-cyan-900/50 text-cyan-400'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={`max-w-[80%] rounded-lg p-4 ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-slate-100' 
                : 'bg-slate-900 border border-slate-800 text-slate-300'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed text-sm">
                {msg.text}
              </p>
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan-900/50 text-cyan-400 flex items-center justify-center shrink-0">
               <Bot size={20} />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-3">
              <Loader2 className="animate-spin text-purple-400" size={18} />
              <span className="text-sm text-purple-300 animate-pulse">Reasoning through complex constraints...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <div className="relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about compliance, load calculations, or complex system relationships..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 pr-14 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none h-24 scrollbar-thin"
          />
          <button 
            onClick={handleSend}
            disabled={isThinking || !input.trim()}
            className="absolute bottom-4 right-4 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-2 text-center">
          AI generated responses can be inaccurate. Always verify with a licensed Professional Engineer (PE).
        </p>
      </div>
    </div>
  );
};

export default Copilot;