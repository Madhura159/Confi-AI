import React, { useEffect, useState, useRef } from 'react';
import { aiService } from '../services/aiService';
import { UserProfile } from '../types';
import { Loader } from './Loader';
import { ConfiAvatar } from './ConfiAvatar';
import { Zap, CheckCircle, Clock, Send, User } from 'lucide-react';
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
  const [mood, setMood] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chat = aiService.createCoachChat();
    setChatSession(chat);
    setMessages([{ role: 'model', text: `Hi ${user.username}! I'm Confi, your AI Coach. Ready to conquer your goals today?` }]);
  }, [user.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !chatSession) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    setMood('thinking');

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      setMood('speaking');
      setMessages(prev => [...prev, { role: 'model', text: result.text || "I'm listening." }]);
      setTimeout(() => setMood('idle'), 2000);
    } catch (error) {
      setMood('idle');
      setMessages(prev => [...prev, { role: 'model', text: "I hit a snag. Let's try that again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <header className="flex items-end gap-4">
        <ConfiAvatar size="lg" mood={mood} />
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Welcome, <span className="text-neon-green">{user.username}</span></h2>
          <p className="text-gray-400">Confi is ready to help you grow.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-neon-surface border border-gray-700 rounded-3xl flex flex-col h-[550px] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="p-5 border-b border-gray-700 bg-gray-800/40 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ConfiAvatar size="sm" mood={mood} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Confi Coach</h3>
                <p className="text-[10px] text-neon-blue uppercase tracking-widest font-black">AI Active</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/40">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} items-end`}>
                <div className="flex-shrink-0">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-neon-blue/20 border border-neon-blue/40 flex items-center justify-center text-neon-blue">
                      <User size={16} />
                    </div>
                  ) : (
                    <ConfiAvatar size="sm" mood="idle" />
                  )}
                </div>
                <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 rounded-br-none' 
                    : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4 items-end animate-pulse">
                <ConfiAvatar size="sm" mood="thinking" />
                <div className="bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-gray-700 bg-gray-800/60 backdrop-blur-lg">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message Confi..."
                className="flex-1 bg-gray-950/50 border border-gray-700 rounded-2xl px-5 py-3.5 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all placeholder:text-gray-600"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isTyping}
                className="bg-neon-blue text-neon-dark px-5 rounded-2xl font-bold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-neon-blue/20"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </section>

        <div className="flex flex-col gap-6">
          {[
            { label: 'Tasks Completed', value: '0', color: 'green', icon: CheckCircle },
            { label: 'Focus Hours', value: '0h', color: 'blue', icon: Clock },
            { label: 'Current Streak', value: '0 Days', color: 'purple', icon: Zap }
          ].map((stat, i) => (
            <div key={i} className={`bg-gray-800/80 rounded-2xl p-6 border-l-4 border-neon-${stat.color} shadow-xl hover:translate-x-1 transition-transform cursor-default`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 bg-neon-${stat.color}/10 rounded-xl`}>
                  <stat.icon className={`text-neon-${stat.color}`} size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};