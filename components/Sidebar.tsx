
import React from 'react';
import { ViewState, UserProfile } from '../types';
import { LayoutDashboard, Target, TrendingUp, BookOpen, Smile, User, LogOut, Sparkles } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: UserProfile;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, user, onLogout }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.CHALLENGES, label: 'Challenge Hub', icon: Target },
    { id: ViewState.PROGRESS, label: 'Progress', icon: TrendingUp },
    { id: ViewState.LEARNING, label: 'Learning Center', icon: BookOpen },
    { id: ViewState.AFFIRMATIONS, label: 'Affirmations', icon: Smile },
  ];

  return (
    <aside className="w-64 bg-neon-surface border-r border-gray-800 flex flex-col h-full hidden md:flex">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neon-green rounded-lg flex items-center justify-center text-neon-dark font-bold">
            C
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">Confi</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">AI Growth Platform</p>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 rounded-xl p-3 mb-6">
          <div className="flex items-center gap-2 text-neon-blue mb-1">
            <Sparkles size={16} />
            <span className="text-sm font-bold">AI Coach Active</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-tight">
            Your personal growth engine is ready to assist.
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                currentView === item.id
                  ? 'bg-neon-green/10 text-neon-green font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-neon-green' : 'text-gray-500 group-hover:text-white'} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user.username}</p>
            <p className="text-xs text-gray-500">Pro Member</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-white transition-colors py-2 hover:bg-gray-800 rounded-lg"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
