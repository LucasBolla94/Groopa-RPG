
import React from 'react';
import { Stats } from '../types';

interface Props {
  stats: Stats;
}

const HUD: React.FC<Props> = ({ stats }) => {
  const hpPercent = (stats.hp / stats.maxHp) * 100;
  const manaPercent = (stats.mana / stats.maxMana) * 100;
  const expNeeded = Math.floor(50 * stats.level * 1.4);
  const expPercent = (stats.exp / expNeeded) * 100;

  return (
    <div className="absolute top-8 left-8 w-72 bg-black/90 p-5 border-2 border-slate-600 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl pointer-events-none space-y-4">
      {/* HP BAR */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-end px-1">
            <span className="text-[12px] font-black text-red-500 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]">Health Point</span>
            <span className="text-[14px] font-black text-white tabular-nums">{Math.floor(stats.hp)}<span className="text-slate-500 text-[10px] mx-1">/</span>{stats.maxHp}</span>
        </div>
        <div className="h-6 bg-red-950/40 rounded-md overflow-hidden border border-red-900/50 relative shadow-inner">
          <div className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.6)]" style={{ width: `${hpPercent}%` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* MANA BAR */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-end px-1">
            <span className="text-[12px] font-black text-blue-400 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(37,99,235,0.4)]">Mana Reserve</span>
            <span className="text-[14px] font-black text-white tabular-nums">{Math.floor(stats.mana)}<span className="text-slate-500 text-[10px] mx-1">/</span>{stats.maxMana}</span>
        </div>
        <div className="h-6 bg-blue-950/40 rounded-md overflow-hidden border border-blue-900/50 relative shadow-inner">
          <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.6)]" style={{ width: `${manaPercent}%` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* EXP BAR */}
      <div className="pt-3 border-t border-slate-800">
        <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
          <div className="h-full bg-yellow-500 transition-all shadow-[0_0_10px_rgba(234,179,8,0.4)]" style={{ width: `${expPercent}%` }} />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 mt-2.5 px-1 uppercase tracking-[0.2em] font-black">
            <span className="text-yellow-500">LEVEL {stats.level}</span>
            <span className="text-slate-500">{Math.floor(expPercent)}%</span>
        </div>
      </div>
    </div>
  );
};

export default HUD;
