import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { storageService } from '../services/storageService';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Hi! I am Alex\'s AI assistant. Ask me anything about his work, skills, or availability.',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Save message to storage for Dashboard moderation (Async)
      await storageService.saveMessage(userMsg);

      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(userMsg.text, history);

      const botMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-m3-surface rounded-3xl shadow-2xl overflow-hidden border border-m3-surface-variant flex flex-col origin-bottom-right animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-m3-primary-container px-6 py-4 flex justify-between items-center">
             <div>
                <h3 className="font-bold text-m3-on-primary-container">AI Assistant</h3>
                <span className="text-xs text-m3-on-primary-container/70">Powered by Gemini</span>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-m3-on-primary-container hover:bg-black/5 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-m3-surface">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-m3-primary text-m3-on-primary rounded-tr-sm' 
                      : 'bg-m3-secondary-container text-m3-on-secondary-container rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-m3-secondary-container p-4 rounded-2xl rounded-tl-sm flex gap-2 items-center">
                    <div className="w-2 h-2 bg-m3-on-secondary-container/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-m3-on-secondary-container/50 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-m3-on-secondary-container/50 rounded-full animate-bounce delay-200"></div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-m3-surface border-t border-m3-surface-variant">
             <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about my skills..."
                  className="w-full bg-m3-surface-variant/50 border-none rounded-full py-3 pl-4 pr-12 text-m3-on-surface placeholder:text-m3-on-surface-variant/50 focus:ring-2 focus:ring-m3-primary focus:outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2 p-2 bg-m3-primary text-m3-on-primary rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-16 h-16 bg-m3-primary-container text-m3-on-primary-container rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl hover:rotate-3 transition-all duration-300"
      >
        <span className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        ) : (
          /* Sparkle Icon for AI */
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 4V2M15 4V6M15 4H13M15 4H17M5 16V14M5 16V18M5 16H3M5 16H7M12 15L10 10L12 5L14 10L12 15ZM19 13L18 11L19 9L20 11L19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;