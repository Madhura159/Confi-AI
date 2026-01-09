
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Challenge, ChallengeStatus, JournalEntry, UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PenTool, MessageSquare, Save, BookOpen, Calendar } from 'lucide-react';
import { Loader } from './Loader';

interface ProgressTrackerProps {
  user: UserProfile;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ user }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [reflectionPrompt, setReflectionPrompt] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [savingEntry, setSavingEntry] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [cData, jData] = await Promise.all([
      storageService.getChallenges(),
      storageService.getJournalEntries()
    ]);
    setChallenges(cData);
    setJournalEntries(jData);
  };

  const activeCount = challenges.filter(c => c.status === ChallengeStatus.ACTIVE).length;
  const completedCount = challenges.filter(c => c.status === ChallengeStatus.COMPLETED).length;
  
  const data = [
    { name: 'Active', value: activeCount || 0 },
    { name: 'Completed', value: completedCount || 0 },
    { name: 'Pending', value: Math.max(0, 5 - (activeCount + completedCount)) } // Mock padding
  ];

  const COLORS = ['#22d3ee', '#a3e635', '#334155'];

  const handleGetPrompt = async () => {
    setLoadingAI(true);
    const prompt = await aiService.getReflectionPrompt();
    setReflectionPrompt(prompt);
    setLoadingAI(false);
  };

  const handleSaveEntry = async () => {
    if (!journalEntry.trim()) return;
    
    setSavingEntry(true);
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      userId: user.id,
      date: new Date().toISOString(),
      prompt: reflectionPrompt || "Self Reflection",
      content: journalEntry
    };

    await storageService.saveJournalEntry(newEntry);
    setJournalEntries(prev => [newEntry, ...prev]);
    setJournalEntry('');
    setReflectionPrompt('');
    setSavingEntry(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="bg-neon-surface border border-gray-800 rounded-2xl p-6 h-full">
          <h3 className="text-xl font-bold text-white mb-6">Challenge Status</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Total Challenges: <span className="text-white font-bold">{challenges.length}</span>
            </p>
          </div>
        </div>

        {/* Reflection Section */}
        <div className="flex flex-col gap-6 h-full">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-4 text-neon-purple">
              <PenTool size={24} />
              <h3 className="text-xl font-bold text-white">AI Reflection Coach</h3>
            </div>
            
            {!reflectionPrompt ? (
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-gray-400 mb-6 text-sm">
                  Taking time to reflect reinforces learning. Ask your coach for a targeted question based on your progress.
                </p>
                <button 
                  onClick={handleGetPrompt}
                  disabled={loadingAI}
                  className="w-full py-8 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-neon-purple hover:text-neon-purple transition flex items-center justify-center gap-2 group"
                >
                  {loadingAI ? <Loader /> : <><MessageSquare size={20} /> Generate Reflection Question</>}
                </button>
              </div>
            ) : (
              <div className="animate-fade-in space-y-4 flex-1 flex flex-col">
                <div className="bg-neon-purple/10 border border-neon-purple/30 p-4 rounded-lg">
                  <p className="text-white font-medium italic">"{reflectionPrompt}"</p>
                </div>
                <textarea 
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="w-full flex-1 min-h-[150px] bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-purple outline-none resize-none"
                />
                <div className="flex justify-end gap-2">
                   <button 
                    onClick={() => setReflectionPrompt('')}
                    className="px-4 py-2 rounded-lg text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveEntry}
                    disabled={savingEntry || !journalEntry.trim()}
                    className="bg-neon-purple text-white px-6 py-2 rounded-lg hover:bg-neon-purple/80 flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingEntry ? <Loader size="sm" /> : <><Save size={18} /> Save Entry</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Past Journal Entries */}
      <div className="bg-gray-900/50 border-t border-gray-800 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-neon-blue" size={24} />
          <h3 className="text-2xl font-bold text-white">Your Growth Journal</h3>
        </div>

        <div className="grid gap-4">
          {journalEntries.length === 0 ? (
            <p className="text-gray-500 italic">No journal entries yet. Start reflecting above!</p>
          ) : (
            journalEntries.map(entry => (
              <div key={entry.id} className="bg-neon-surface border-l-4 border-neon-blue rounded-r-xl p-5 hover:bg-gray-800 transition group">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-neon-purple text-sm font-semibold mb-1">{entry.prompt}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{entry.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};