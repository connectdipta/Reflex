'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiX, FiSend, FiLoader, FiMessageSquare } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your Reflex AI Support Assistant. How can I help you on your wellness journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-[#0d1528]/80 backdrop-blur-xl p-2 pr-6 rounded-full border border-primary-500/30 shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_50px_rgba(14,165,233,0.5)] hover:border-primary-500/60 transition-all duration-300"
          >
            {/* Pulsating Aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 opacity-20 blur-xl group-hover:opacity-40 animate-pulse transition-opacity duration-300" />
            
            {/* Avatar Container */}
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-teal-500 p-[2px] flex items-center justify-center overflow-hidden shadow-lg z-10">
              <div className="w-full h-full rounded-full bg-[#0d1528] flex items-center justify-center overflow-hidden">
                <Image src="/AI.png" alt="AI Support" width={40} height={40} className="object-cover scale-110" />
              </div>
            </div>
            
            {/* Text */}
            <div className="flex flex-col items-start z-10">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Online
              </span>
              <span className="font-bold text-white text-sm tracking-wide leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-teal-400 transition-colors">
                AI Support
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-6rem)] flex flex-col glass-card border border-white/10 shadow-2xl shadow-primary-500/20 overflow-hidden bg-[#0d1528]/95 backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-teal-500 p-0.5 flex items-center justify-center">
                   <div className="w-full h-full rounded-full bg-[#0d1528] flex items-center justify-center overflow-hidden">
                      <Image src="/AI.png" alt="AI Support" width={36} height={36} className="object-cover" />
                   </div>
                </div>
                <div>
                  <h3 className="font-bold text-white">Reflex AI</h3>
                  <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary-500/50 scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 md:p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-primary-500 to-teal-500 text-white rounded-tr-sm' 
                        : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="text-sm leading-relaxed prose prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-white max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {msg.role === 'user' ? 'You' : 'Reflex AI'}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-start"
                >
                  <div className="bg-white/10 border border-white/5 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <FiLoader className="animate-spin text-primary-400" />
                    <span className="text-xs text-gray-400">Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-primary-500 flex items-center justify-center text-white transition-colors"
                >
                  <FiSend className="ml-[-2px]" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
