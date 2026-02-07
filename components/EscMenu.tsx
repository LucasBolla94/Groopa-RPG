
import React from 'react';

interface Props {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
  onResume: () => void;
}

const EscMenu: React.FC<Props> = ({ soundEnabled, onToggleSound, onLogout, onResume }) => {
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-80 bg-slate-900 border-4 border-slate-700 shadow-[0_0_100px_rgba(0,0,0,1)] rounded-2xl overflow-hidden flex flex-col relative scale-110">
        {/* Decorative Header */}
        <div className="bg-slate-800 border-b-4 border-slate-700 p-4 text-center">
          <h2 className="text-xl font-black text-yellow-500 tracking-[0.3em] uppercase drop-shadow-md">Menu</h2>
          <div className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">GAME SETTINGS</div>
        </div>

        <div className="p-8 space-y-4 bg-gradient-to-b from-slate-900 to-black">
          <button 
            onClick={onResume}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-xl border-2 border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            <span className="text-yellow-500 group-hover:animate-bounce">▶</span> RESUME GAME
          </button>

          <button 
            onClick={onToggleSound}
            className={`w-full py-4 font-black rounded-xl border-2 transition-all active:scale-95 flex items-center justify-center gap-3 ${
              soundEnabled 
              ? 'bg-slate-800 border-green-600/50 text-green-400' 
              : 'bg-slate-800 border-red-600/50 text-red-500 opacity-80'
            }`}
          >
            <span className="text-lg">{soundEnabled ? '🔊' : '🔈'}</span>
            SOUND: {soundEnabled ? 'ENABLED' : 'DISABLED'}
          </button>

          <div className="pt-4 border-t border-slate-800/50">
            <button 
              onClick={onLogout}
              className="w-full py-4 bg-red-950/20 hover:bg-red-600 text-red-500 hover:text-white font-black rounded-xl border-2 border-red-900/30 hover:border-red-500 transition-all active:scale-95"
            >
              LOGOUT & EXIT
            </button>
          </div>
        </div>

        <div className="p-4 bg-black/40 text-center">
           <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Groopa Engine v1.0.4</p>
        </div>

        {/* Thematic corners */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-slate-700 rounded-full"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-slate-700 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-slate-700 rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-slate-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default EscMenu;
