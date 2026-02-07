
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
  isChatting: boolean;
  onSendMessage: (text: string) => void;
  onToggleChat: (force?: boolean) => void;
  onInputEmptyChange?: (isEmpty: boolean) => void;
}

const Chat: React.FC<Props> = ({ messages, isChatting, onSendMessage, onToggleChat, onInputEmptyChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isChatting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatting]);

  useEffect(() => {
    onInputEmptyChange?.(inputValue.trim().length === 0);
  }, [inputValue, onInputEmptyChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
    onToggleChat(false);
  };

  const getMsgColor = (type: ChatMessage['type']) => {
    switch (type) {
      case 'combat': return 'text-red-400';
      case 'loot': return 'text-yellow-400';
      case 'level': return 'text-green-400 font-black text-[15px]';
      case 'system': return 'text-slate-400 italic';
      default: return 'text-white';
    }
  };

  return (
    <div className={`absolute bottom-4 left-4 w-[500px] flex flex-col pointer-events-none transition-transform duration-300 ${isChatting ? 'scale-[1.02]' : 'scale-100'}`}>
      {/* Messages Window */}
      <div className="h-72 bg-black/60 border-2 border-slate-700/60 rounded-t-2xl p-5 backdrop-blur-2xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="text-[11px] uppercase font-black text-slate-500 mb-4 border-b border-slate-800 pb-3 tracking-[0.4em] flex justify-between items-center">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            KINGDOM CHAT
          </span>
          <span className="text-[9px] text-slate-600 font-bold px-2 py-1 bg-slate-900/50 rounded">PRESS ENTER TO TALK</span>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-2.5 pr-3 scrollbar-hide"
        >
          {messages.length === 0 && (
            <div className="text-slate-700 text-xs italic text-center mt-10">No messages yet...</div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`text-[14px] leading-relaxed break-words drop-shadow-sm font-semibold tracking-wide ${getMsgColor(m.type)}`}>
              <span className="text-slate-600 font-bold mr-3 tabular-nums opacity-60">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              {m.text}
            </div>
          ))}
        </div>
      </div>

      {/* Persistent Input Field Area */}
      <div className="pointer-events-auto h-16 relative">
        <form onSubmit={handleSubmit} className="h-full">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => onToggleChat(true)}
            onBlur={() => onToggleChat(false)}
            placeholder={isChatting ? "Say something to the realm..." : "Click or press Enter to speak..."}
            className={`w-full h-full bg-slate-900/95 border-x-2 border-b-2 border-t border-t-slate-800/50 px-6 text-yellow-50 text-base outline-none font-bold transition-all duration-300 rounded-b-2xl shadow-inner
              ${isChatting 
                ? 'border-yellow-600/70 ring-2 ring-yellow-600/20 bg-slate-800 placeholder:text-slate-500' 
                : 'border-slate-700/60 placeholder:text-slate-600 hover:bg-slate-800/80 cursor-pointer'
              }`}
          />
          <div className={`absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase transition-opacity duration-300 ${isChatting ? 'opacity-40 text-yellow-500' : 'opacity-0'}`}>
            Enter to Send
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
