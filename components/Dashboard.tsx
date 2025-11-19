
import React, { useEffect, useState, useRef } from 'react';
import { aiService } from '../services/aiService';
import { UserProfile } from '../types';
import { Loader } from './Loader';
import { Zap, CheckCircle, Clock, BrainCircuit, Send, User, Bot } from 'lucide-react';
import { Chat } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface DashboardProps {
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Chat Session
    const chat = aiService.createCoachChat();
    setChatSession(chat);
    
    // Initial greeting
    setMessages([
      { role: 'model', text: `Hi ${user.username}! I'm Confi, your AI Coach. I see you're ready to grow. What shall we focus on today?` }
    ]);
  }, [user.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !chatSession) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      const responseText = result.text;
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: responseText || "I'm here, but I couldn't think of a response. Try again?" 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I'm having trouble connecting right now. Please check your connection." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back, <span className="text-neon-green">{user.username}</span></h2>
        <p className="text-gray-400">Here is your daily growth overview.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Coach Chat Section - Takes up 2/3rds on large screens */}
        <section className="lg:col-span-2 bg-neon-surface border border-gray-700 rounded-2xl flex flex-col h-[500px] overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex items-center gap-3">
            <div className="bg-neon-purple/20 p-2 rounded-full">
              <BrainCircuit className="text-neon-purple" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Growth Coach</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-neon-blue text-neon-dark' : 'bg-gray-700 text-neon-green'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 rounded-tr-none' 
                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 text-neon-green">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-gray-700 bg-gray-800/30">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for advice, motivation, or a plan..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple outline-none transition"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isTyping}
                className="bg-neon-purple text-white p-3 rounded-xl hover:bg-neon-purple/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </section>

        {/* Quick Stats Section - Takes up 1/3rd */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-neon-green shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Tasks Completed</p>
                <p className="text-3xl font-bold text-white mt-1">0</p>
              </div>
              <CheckCircle className="text-neon-green opacity-50" size={24} />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-neon-blue shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Focus Hours</p>
                <p className="text-3xl font-bold text-white mt-1">0h</p>
              </div>
              <Clock className="text-neon-blue opacity-50" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-neon-purple shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                <p className="text-3xl font-bold text-white mt-1">0 Days</p>
              </div>
              <Zap className="text-neon-purple opacity-50" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
