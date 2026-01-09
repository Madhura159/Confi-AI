
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChallengeHub } from './components/ChallengeHub';
import { ProgressTracker } from './components/ProgressTracker';
import { LearningCenter } from './components/LearningCenter';
import { AffirmationZone } from './components/AffirmationZone';
import { Login } from './components/Login';
import { ViewState, UserProfile } from './types';
import { storageService } from './services/storageService';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // When user logs in
  const handleLogin = (loggedInUser: UserProfile) => {
    storageService.setContext(loggedInUser.id);
    setUser(loggedInUser);
    setCurrentView(ViewState.DASHBOARD);
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    storageService.setContext('');
    // Optional: Clear local storage key if you want to forget session
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return <Dashboard user={user} />;
      case ViewState.CHALLENGES: return <ChallengeHub />;
      case ViewState.PROGRESS: return <ProgressTracker user={user} />;
      case ViewState.LEARNING: return <LearningCenter />;
      case ViewState.AFFIRMATIONS: return <AffirmationZone user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-neon-dark text-white overflow-hidden font-sans">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:block">
        <Sidebar 
          currentView={currentView} 
          onChangeView={setCurrentView} 
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-neon-surface border-b border-gray-800 p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold text-white">Confi</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          <Menu />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-neon-dark pt-20 px-4">
          <Sidebar 
            currentView={currentView} 
            onChangeView={(view) => {
              setCurrentView(view);
              setIsMobileMenuOpen(false);
            }}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
        {renderView()}
      </main>
    </div>
  );
};

export default App;