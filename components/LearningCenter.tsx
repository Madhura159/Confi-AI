import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { Loader } from './Loader';
import { Book, Clock, PlayCircle, X } from 'lucide-react';

const TOPICS = [
  { id: '1', title: 'Stoicism for Modern Work', category: 'Mindset' },
  { id: '2', title: 'The Pomodoro Technique', category: 'Productivity' },
  { id: '3', title: 'Emotional Intelligence 101', category: 'Soft Skills' },
  { id: '4', title: 'Deep Work by Cal Newport', category: 'Focus' },
];

export const LearningCenter: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTopicClick = async (topic: typeof TOPICS[0]) => {
    setActiveTopic(topic.id);
    setSummary('');
    setLoading(true);
    const result = await aiService.getTopicSummary(topic.title);
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Learning Center</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOPICS.map(topic => (
          <div 
            key={topic.id}
            onClick={() => handleTopicClick(topic)}
            className={`bg-neon-surface border border-gray-800 rounded-xl p-6 cursor-pointer transition-all hover:border-neon-blue group ${activeTopic === topic.id ? 'ring-2 ring-neon-blue' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded uppercase tracking-wider">{topic.category}</span>
              <PlayCircle className="text-gray-600 group-hover:text-neon-blue" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-blue transition">{topic.title}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <Clock size={14} /> 5 min read
            </div>

            {activeTopic === topic.id && (
              <div className="mt-4 pt-4 border-t border-gray-700 animate-fade-in cursor-default" onClick={e => e.stopPropagation()}>
                {loading ? (
                  <div className="flex items-center gap-2 text-neon-blue text-sm">
                    <Loader size="sm" /> Generating Summary...
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveTopic(null); }}
                      className="mt-3 text-xs text-gray-500 hover:text-white flex items-center gap-1"
                    >
                      <X size={12} /> Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};