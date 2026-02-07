
import React from 'react';
import { Item, NPC, Stats } from '../types';
import { getItemSprite } from '../game/sprites';

interface Props {
  npc: NPC;
  playerStats: Stats;
  onBuy: (item: Item) => void;
  onClose: () => void;
}

const ShopMenu: React.FC<Props> = ({ npc, playerStats, onBuy, onClose }) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-slate-900 border-4 border-slate-700 shadow-[0_0_100px_rgba(0,0,0,0.8)] p-6 text-white z-[100] animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6 border-b-2 border-slate-800 pb-3">
        <div>
            <h2 className="text-2xl font-black text-yellow-500 uppercase tracking-widest">{npc.name}</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Merchant Specialist</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white text-2xl p-2 transition-colors">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {npc.shopItems?.map(item => (
          <div 
            key={item.id}
            className="group bg-slate-950 border-2 border-slate-800 p-3 rounded-lg flex items-center gap-4 hover:border-yellow-600 transition-all cursor-pointer"
            onClick={() => onBuy(item)}
          >
            <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded flex items-center justify-center">
                <canvas 
                    ref={el => {
                        if (el) {
                            const ctx = el.getContext('2d');
                            if (ctx) {
                                ctx.clearRect(0, 0, 32, 32);
                                ctx.drawImage(getItemSprite(item.name), 0, 0);
                            }
                        }
                    }}
                    width={32}
                    height={32}
                />
            </div>
            <div className="flex-1">
                <div className="text-xs font-bold text-slate-100">{item.name}</div>
                <div className="text-[9px] text-slate-500 uppercase">
                    {item.stats ? Object.entries(item.stats).map(([k,v]) => `${k}: +${v}`).join(', ') : 'No stats'}
                </div>
                <div className="text-xs font-black text-yellow-500 mt-1">{item.price} Gold</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-950 border-t-2 border-slate-800 p-4 flex justify-between items-center rounded-b-lg">
        <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-500 uppercase font-black">Your Balance</span>
            <span className="text-xl font-black text-yellow-500">{playerStats.gold} <span className="text-[10px]">GP</span></span>
        </div>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase rounded transition-colors"
        >
          Exit Shop
        </button>
      </div>
    </div>
  );
};

export default ShopMenu;
