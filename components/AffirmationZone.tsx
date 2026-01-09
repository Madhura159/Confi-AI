
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Affirmation, UserProfile } from '../types';
import { Loader } from './Loader';
import { Sun, RefreshCw, Quote } from 'lucide-react';

interface AffirmationZoneProps {
  user: UserProfile;
}

export const AffirmationZone: React.FC<AffirmationZoneProps> = ({ user }) => {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAffirmations();
  }, []);

  const loadAffirmations = async () => {
    const data = await storageService.getAffirmations();
    setAffirmations(data);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const text = await aiService.generateAffirmation();
    const newAffirmation: Affirmation = {
      id: Date.now().toString(),
      userId: user.id,
      text,
      date: new Date().toISOString()
    };
    await storageService.saveAffirmation(newAffirmation);
    setAffirmations(prev => [newAffirmation, ...prev]);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-center">
      <div className="inline-block p-3 rounded-full bg-yellow-500/20 text-yellow-500 mb-4">
        <Sun size={40} />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Daily Affirmations</h2>
      <p className="text-gray-400 mb-10">Rewire your brain for confidence and success.</p>

      {/* Featured Affirmation */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 p-12 rounded-2xl shadow-2xl mb-12">
        <Quote className="absolute top-6 left-6 text-gray-700" size={40} />
        
        {loading ? (
          <div className="py-8 flex justify-center"><Loader size="lg" /></div>
        ) : (
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue leading-tight">
            "{affirmations[0]?.text || "I am building the future I deserve."}"
          </h1>
        )}

        <div className="mt-8">
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Creating..." : "Generate New Affirmation"}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="text-left">
        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">Recent Affirmations</h3>
        <div className="grid gap-3">
          {affirmations.slice(1, 6).map(aff => (
            <div key={aff.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-800 text-gray-300 text-sm">
              {aff.text}
            </div>
          ))}
          {affirmations.length <= 1 && <p className="text-gray-600 italic text-sm">No history yet.</p>}
        </div>
      </div>
    </div>
  );
};