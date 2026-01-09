import React from 'react';

interface ConfiAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'idle' | 'thinking' | 'speaking';
  className?: string;
}

export const ConfiAvatar: React.FC<ConfiAvatarProps> = ({ 
  size = 'md', 
  mood = 'idle',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className} group`}>
      <style>
        {`
          @keyframes blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.4); opacity: 0; }
          }
          @keyframes thinking-eyes {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .animate-blink { animation: blink 4s infinite; }
          .animate-pulse-ring { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          .animate-thinking { animation: thinking-eyes 0.6s ease-in-out infinite; }
        `}
      </style>

      {/* Outer Glow / Aura */}
      <div className="absolute inset-0 bg-neon-blue/30 rounded-full blur-md transform scale-125 group-hover:bg-neon-green/30 transition-colors duration-700"></div>
      
      {/* Pulsing Ring for Thinking State */}
      {mood === 'thinking' && (
        <div className="absolute inset-0 border-2 border-neon-purple rounded-full animate-pulse-ring"></div>
      )}

      {/* Main Body */}
      <div className={`
        relative w-full h-full rounded-full 
        bg-gradient-to-br from-neon-blue via-cyan-500 to-blue-600 
        shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.4),inset_4px_4px_8px_rgba(255,255,255,0.4)]
        flex items-center justify-center
        animate-float
        border-2 border-white/20
        backdrop-blur-sm
        overflow-hidden
      `}>
        {/* Reflection Shine */}
        <div className="absolute top-[15%] left-[15%] w-[25%] h-[15%] bg-white/80 rounded-full blur-[1px] transform -rotate-45"></div>

        {/* Face Container */}
        <div className={`relative w-[60%] h-[40%] flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${mood === 'thinking' ? 'animate-thinking' : ''}`}>
          
          {/* Eyes */}
          <div className="flex justify-between w-full px-1">
            <div className="w-2.5 h-3.5 bg-slate-900 rounded-full animate-blink"></div>
            <div className="w-2.5 h-3.5 bg-slate-900 rounded-full animate-blink" style={{ animationDelay: '0.1s' }}></div>
          </div>

          {/* Mouth */}
          <div className={`
            bg-slate-900 opacity-80 rounded-full transition-all duration-300
            ${mood === 'speaking' ? 'w-4 h-3' : 'w-4 h-1'}
            ${mood === 'thinking' ? 'w-2 h-2' : ''}
          `}></div>
        </div>
      </div>
    </div>
  );
};