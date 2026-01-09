import React, { useState, useRef, useEffect } from 'react';
import { generateThinkingResponse } from '@/lib/geminiService';
import { ChatMessage } from '@/features/document-analysis/types';
import { Bot, User, Sparkles, Loader2, StopCircle } from 'lucide-react';

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Auto-resize textarea to match content height (responsive input)
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    // reset height to allow shrink
    ta.style.height = 'auto';
    const max = 240; // px max height for textarea
    const newHeight = Math.min(ta.scrollHeight, max);
    ta.style.height = `${newHeight}px`;
  }, [input]);

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
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: '#fff',
          boxShadow: '0 6px 12px rgba(37,99,235,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease'
        }}
        className="hover:bg-[#1f4fd8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 hover:shadow-2xl hover:scale-105"
      >
        <Sparkles size={20} className="text-white" />
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
              <span className="font-semibold text-sm">HVAC Copilot</span>
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
                    : 'bg-[#2563eb]/10 border-[#2563eb]/20 text-[#2563eb]'
                }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </div>
                
                <div className="flex-1 space-y-2 pt-1">
                  <div className="text-sm font-medium text-zinc-400">
                    {msg.role === 'user' ? 'You' : 'Copilot'}
                  </div>
                  <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap font-light">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="max-w-3xl mx-auto flex gap-6">
                <div className="w-8 h-8 rounded border bg-[#2563eb]/10 border-[#2563eb]/20 text-[#2563eb] flex items-center justify-center shrink-0">
              <Sparkles size={14} />
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 text-sm text-[#2563eb] animate-pulse">
                    <Loader2 size={14} className="animate-spin text-[#2563eb]" />
                    <span>Analyzing constraints and physics...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6">
            <div className="max-w-3xl mx-auto relative">
                <div className="relative bg-[#09090b] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                <textarea 
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about compliance or efficiency..."
                  className="w-full bg-transparent p-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none resize-none min-h-[44px] max-h-60 overflow-hidden transition-[height] duration-150"
                  rows={1}
                />
                <div className="flex justify-end items-center px-4 pb-3 pt-1">
                  <button
                    onClick={handleSend}
                    disabled={isThinking || !input.trim()}
                    aria-label="Send message"
                    title="Send"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2563eb] text-white shadow-sm hover:shadow-md transform transition duration-150 ease-out hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isThinking ? (
                      <StopCircle size={14} className="text-white" />
                    ) : (
                      // Clean, minimal triangle "send" icon
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M2 21L23 12 2 3v7l15 2-15 2v7z" />
                      </svg>
                    )}
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