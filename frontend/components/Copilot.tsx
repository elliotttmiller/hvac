import React, { useState, useRef, useEffect } from 'react';
import { generateThinkingResponse } from '@/lib/geminiService';
import { ChatMessage } from '@/features/document-analysis/types';
import { Send, Bot, User, Sparkles, Loader2, StopCircle } from 'lucide-react';

const Copilot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Engineering Copilot online. I can assist with ASHRAE 62.1 compliance checks, load calculations, and schematic optimization.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to toggle Copilot panel
  // Updated to restrict movement to predefined positions only
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
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
        text: "Error in reasoning pipeline. Please check system logs.",
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

  const predefinedPositions = [
    { name: 'Bottom Right', x: -96, y: -96 },
    { name: 'Bottom Left', x: 96, y: -96 },
    { name: 'Bottom Center', x: 0, y: -96 },
    { name: 'Right Center', x: -96, y: 0 },
    { name: 'Top Right', x: -96, y: 96 },
    { name: 'Top Center', x: 0, y: 96 },
    { name: 'Top Left', x: 96, y: 96 },
    { name: 'Left Center', x: 96, y: 0 }
  ];

  const handlePositionChange = (position) => {
    setPos({ x: position.x, y: position.y });
  };

  return (
    <>
      {/* Floating Button (with hover animation) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          right: `calc(24px + ${pos.x}px)`,
          bottom: `calc(24px + ${pos.y}px)`,
          zIndex: 60,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#6b46c1',
          color: '#fff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        className="hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 hover:shadow-xl hover:scale-105"
      >
        <Sparkles size={20} />
      </button>

      {/* Position Selector */}
      {isOpen && (
        <div className="fixed bottom-16 right-16 bg-white p-4 rounded shadow-lg">
          <h4 className="text-sm font-semibold mb-2">Move Button</h4>
          <ul>
            {predefinedPositions.map((pos, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePositionChange(pos)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  {pos.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Copilot Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-16 w-96 h-[80vh] bg-[#09090b] text-zinc-200 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="h-14 border-b border-border bg-zinc-900/20 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-400" size={16} />
              <span className="font-semibold text-sm">Reasoning Engine</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-zinc-300 focus:outline-none"
            >
              ✕
            </button>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`max-w-3xl mx-auto flex gap-6 ${msg.role === 'model' ? 'animate-in fade-in slide-in-from-bottom-2' : ''}`}>
                <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-300' 
                    : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className="flex-1 space-y-2 pt-1">
                  <div className="text-sm font-medium text-zinc-400">
                    {msg.role === 'user' ? 'You' : 'AI Architect'}
                  </div>
                  <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-light">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="max-w-3xl mx-auto flex gap-6">
                <div className="w-8 h-8 rounded border bg-purple-500/10 border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 text-sm text-purple-400 animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Analyzing constraints and physics...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6">
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur"></div>
              <div className="relative bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about compliance or efficiency..."
                  className="w-full bg-transparent p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none resize-none h-14 max-h-48"
                  rows={1}
                />
                <div className="flex justify-between items-center px-4 pb-3 pt-1">
                  <div className="text-[10px] text-zinc-600 font-medium">
                    <span className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 mr-2">PRO</span>
                    32k Token Context Window
                  </div>
                  <button 
                    onClick={handleSend}
                    disabled={isThinking || !input.trim()}
                    className="p-1.5 bg-zinc-100 hover:bg-white text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isThinking ? <StopCircle size={16}/> : <Send size={16} />}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 mt-3 text-center">
                AI responses should be validated by a certified Professional Engineer (PE).
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Copilot;