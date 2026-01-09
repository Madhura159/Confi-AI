import React, { useState, useEffect } from 'react';
import { Challenge, ChallengeStatus, SubTask } from '../types';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Loader } from './Loader';
import { Plus, Sparkles, Trash2, CheckSquare, Square, Calendar } from 'lucide-react';

export const ChallengeHub: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [goalInput, setGoalInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<Partial<Challenge> | null>(null);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    const data = await storageService.getChallenges();
    setChallenges(data);
    setLoading(false);
  };

  const handleGeneratePlan = async () => {
    if (!goalInput.trim()) return;
    setIsGenerating(true);
    try {
      const plan = await aiService.generateChallengePlan(goalInput);
      setGeneratedPlan({
        id: `ch-${Date.now()}`,
        title: plan.title,
        description: plan.description,
        status: ChallengeStatus.ACTIVE,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        subTasks: plan.subTasks.map((t, i) => ({ id: `st-${Date.now()}-${i}`, title: t, isCompleted: false }))
      });
    } catch (e) {
      alert("AI is taking a break. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveChallenge = async () => {
    if (generatedPlan) {
      await storageService.saveChallenge(generatedPlan as Challenge);
      setGeneratedPlan(null);
      setGoalInput('');
      setShowForm(false);
      loadChallenges();
    }
  };

  const toggleTask = async (challengeId: string, taskId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const updatedSubTasks = challenge.subTasks.map(t => 
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );
    
    const allDone = updatedSubTasks.every(t => t.isCompleted);
    const newStatus = allDone ? ChallengeStatus.COMPLETED : ChallengeStatus.ACTIVE;

    const updatedChallenge = { ...challenge, subTasks: updatedSubTasks, status: newStatus };
    
    setChallenges(prev => prev.map(c => c.id === challengeId ? updatedChallenge : c));
    await storageService.updateChallenge(updatedChallenge);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this challenge?")) {
      setChallenges(prev => prev.filter(c => c.id !== id));
      await storageService.deleteChallenge(id);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Challenge Hub</h2>
          <p className="text-gray-400">Track your goals and conquer new heights.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-neon-green text-neon-dark px-4 py-2 rounded-lg font-bold hover:bg-neon-green/80 transition flex items-center gap-2"
        >
          <Plus size={18} /> New Challenge
        </button>
      </header>

      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8 animate-float">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Create with AI Coach</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Close</button>
          </div>

          {!generatedPlan ? (
            <div className="space-y-4">
              <label className="block text-sm text-gray-400">What do you want to achieve?</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="e.g., Run a 5k, Learn React, Sleep better..."
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-neon-blue outline-none"
                />
                <button 
                  onClick={handleGeneratePlan}
                  disabled={isGenerating || !goalInput}
                  className="bg-neon-blue text-neon-dark px-6 rounded-lg font-bold hover:bg-neon-blue/80 transition disabled:opacity-50 flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isGenerating ? <Loader size="sm" /> : <><Sparkles size={18} /> Plan It</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-l-4 border-neon-green pl-4">
                <h4 className="text-2xl font-bold text-white">{generatedPlan.title}</h4>
                <p className="text-gray-400 mt-1">{generatedPlan.description}</p>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-3 uppercase tracking-wider font-bold">Action Plan</p>
                <ul className="space-y-2">
                  {generatedPlan.subTasks?.map((task: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-blue"></div>
                      {task.title}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleSaveChallenge}
                  className="flex-1 bg-neon-green text-neon-dark py-3 rounded-lg font-bold hover:bg-neon-green/90"
                >
                  Accept Challenge
                </button>
                <button 
                  onClick={() => setGeneratedPlan(null)}
                  className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader /></div>
      ) : (
        <div className="grid gap-6">
          {challenges.length === 0 && !showForm && (
            <div className="text-center py-12 text-gray-500">
              <p>No active challenges. Start one today!</p>
            </div>
          )}
          {challenges.map(challenge => (
            <div key={challenge.id} className="bg-neon-surface border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      challenge.status === ChallengeStatus.COMPLETED ? 'bg-neon-green text-neon-dark' : 'bg-neon-blue/20 text-neon-blue'
                    }`}>
                      {challenge.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{challenge.description}</p>
                </div>
                <button onClick={() => handleDelete(challenge.id)} className="text-gray-600 hover:text-red-500 transition">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2 mt-4">
                {challenge.subTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-800/50 cursor-pointer group"
                    onClick={() => toggleTask(challenge.id, task.id)}
                  >
                    <div className={`text-gray-500 group-hover:text-neon-blue transition ${task.isCompleted ? 'text-neon-green' : ''}`}>
                      {task.isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                    </div>
                    <span className={`text-sm ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={14} />
                <span>Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};