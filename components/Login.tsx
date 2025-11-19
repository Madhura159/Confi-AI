
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';
import { Loader } from './Loader';
import { Sparkles, ArrowRight, UserPlus, LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');

    try {
      let user;
      if (isSignup) {
        user = await authService.signup(username);
      } else {
        user = await authService.login(username);
        if (!user) {
          throw new Error("User not found. Please sign up.");
        }
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neon-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-green/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md p-8 bg-neon-surface/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl animate-fade-in-up z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neon-green rounded-2xl flex items-center justify-center text-neon-dark font-bold text-3xl mx-auto mb-4 shadow-lg shadow-neon-green/20">
            C
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Confi</h1>
          <p className="text-gray-400 mt-2">Personal Growth AI Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-gray-900/80 border border-gray-600 rounded-xl px-4 py-3.5 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username}
            className="w-full bg-gradient-to-r from-neon-blue to-neon-green text-neon-dark font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-neon-blue/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                {isSignup ? "Create Account" : "Sign In"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <button
            onClick={() => { setIsSignup(!isSignup); setError(''); }}
            className="text-sm text-gray-400 hover:text-white transition flex items-center justify-center gap-2 mx-auto group"
          >
            {isSignup ? (
              <>Already have an account? <span className="text-neon-blue group-hover:underline">Sign In</span></>
            ) : (
              <>New to Confi? <span className="text-neon-green group-hover:underline">Create Account</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
