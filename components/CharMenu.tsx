
import React from 'react';
import { Stats } from '../types';

interface Props {
  stats: Stats;
  name: string;
  onClose: () => void;
  onAllocate: (attr: keyof Stats) => void;
}

const CharMenu: React.FC<Props> = ({ stats, name, onClose, onAllocate }) => {
  return (
    <div className="absolute right-4 top-4 w-72 bg-slate-900 border-4 border-slate-700 shadow-2xl p-4 text-white z-50">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
        <h3 className="text-lg font-bold text-yellow-500">CHARACTER</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
      </div>

      <div className="mb-6">
        <div className="text-xl font-bold mb-1">{name}</div>
        <div className="text-xs text-slate-400">Level {stats.level} Explorer</div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Strength (Força)</span>
            <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold">{stats.strength}</span>
                <button 
                  onClick={() => onAllocate('strength')}
                  disabled={stats.attributePoints <= 0}
                  className="w-6 h-6 bg-green-700 hover:bg-green-600 disabled:opacity-30 rounded text-sm font-bold flex items-center justify-center"
                >+</button>
            </div>
        </div>

        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Agility (Agilidade)</span>
            <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold">{stats.agility}</span>
                <button 
                  onClick={() => onAllocate('agility')}
                  disabled={stats.attributePoints <= 0}
                  className="w-6 h-6 bg-green-700 hover:bg-green-600 disabled:opacity-30 rounded text-sm font-bold flex items-center justify-center"
                >+</button>
            </div>
        </div>

        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Magic (Magia)</span>
            <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold">{stats.magic}</span>
                <button 
                  onClick={() => onAllocate('magic')}
                  disabled={stats.attributePoints <= 0}
                  className="w-6 h-6 bg-green-700 hover:bg-green-600 disabled:opacity-30 rounded text-sm font-bold flex items-center justify-center"
                >+</button>
            </div>
        </div>

        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Stamina (Resistência)</span>
            <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold">{stats.stamina}</span>
                <button 
                  onClick={() => onAllocate('stamina')}
                  disabled={stats.attributePoints <= 0}
                  className="w-6 h-6 bg-green-700 hover:bg-green-600 disabled:opacity-30 rounded text-sm font-bold flex items-center justify-center"
                >+</button>
            </div>
        </div>

        <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Health (Vida)</span>
            <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold">{stats.health}</span>
                <button 
                  onClick={() => onAllocate('health')}
                  disabled={stats.attributePoints <= 0}
                  className="w-6 h-6 bg-green-700 hover:bg-green-600 disabled:opacity-30 rounded text-sm font-bold flex items-center justify-center"
                >+</button>
            </div>
        </div>
      </div>

      <div className="bg-slate-800 p-3 rounded border border-slate-700 mb-4">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Available Points</div>
        <div className="text-2xl font-bold text-green-400">{stats.attributePoints}</div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-950 p-2 rounded">
          <div>ATK: {stats.atk}</div>
          <div>DEF: {Math.floor(stats.def)}</div>
          <div>MAX HP: {stats.maxHp}</div>
          <div>MAX MP: {stats.maxMana}</div>
      </div>

      <div className="mt-4 text-[9px] text-slate-600 text-center uppercase tracking-tighter">
        Press 'C' to Close Menu
      </div>
    </div>
  );
};

export default CharMenu;
