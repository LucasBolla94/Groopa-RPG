
import React from 'react';
import { Item, Equipment, Stats } from '../types';
import { getItemSprite } from '../game/sprites';

interface Props {
  inventory: Item[];
  equipment: Equipment;
  stats: Stats;
  onClose: () => void;
  onEquip: (item: Item) => void;
  onUnequip: (slot: keyof Equipment) => void;
}

const ItemIcon: React.FC<{ name: string; type: Item['type'] }> = ({ name, type }) => (
    <canvas 
        ref={el => {
            if (el) {
                const ctx = el.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, 32, 32);
                    ctx.drawImage(getItemSprite(type, name), 0, 0);
                }
            }
        }}
        width={32}
        height={32}
    />
);

const InventoryMenu: React.FC<Props> = ({ inventory, equipment, stats, onClose, onEquip, onUnequip }) => {
  const maxInventorySlots = equipment.backpack ? 28 : 12;
  const slots = Array.from({ length: maxInventorySlots });

  const renderSlot = (slotKey: keyof Equipment, label: string) => {
    const item = equipment[slotKey];
    return (
      <div 
        onClick={() => item && onUnequip(slotKey)}
        className="group relative w-12 h-12 bg-slate-800 border-2 border-slate-700 flex items-center justify-center cursor-pointer hover:border-yellow-500 transition-colors"
      >
        {item ? (
          <ItemIcon name={item.name} type={item.type} />
        ) : (
          <span className="text-[8px] text-slate-600 uppercase font-bold text-center">{label}</span>
        )}
        {item && item.stats && (
            <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-32 bg-slate-950 border border-slate-700 p-2 text-[8px] z-[60] pointer-events-none shadow-xl">
                <div className="text-yellow-400 font-bold mb-1">{item.name}</div>
                {Object.entries(item.stats).map(([k, v]) => (
                    <div key={k}>{k.toUpperCase()}: +{v}</div>
                ))}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="absolute right-8 top-24 w-[460px] bg-slate-900 border-4 border-slate-700 shadow-2xl p-6 text-white z-50 flex gap-6 animate-in fade-in slide-in-from-right-4 duration-200 rounded-lg">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
          <h3 className="text-sm font-black text-yellow-500 uppercase tracking-[0.2em]">Equipment</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3 justify-center">
            <div></div>
            {renderSlot('helmet', 'Head')}
            <div></div>

            {renderSlot('weapon', 'Main')}
            {renderSlot('armor', 'Body')}
            {renderSlot('shield', 'Off')}

            {renderSlot('ring1', 'Ring')}
            {renderSlot('pants', 'Legs')}
            {renderSlot('ring2', 'Ring')}

            {renderSlot('gloves', 'Hands')}
            {renderSlot('boots', 'Feet')}
            {renderSlot('wings', 'Back')}

            <div className="col-span-3 flex justify-center mt-2">
                {renderSlot('backpack', 'Pack')}
            </div>
        </div>
      </div>

      <div className="w-56 flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
          <h3 className="text-sm font-black text-yellow-500 uppercase tracking-[0.2em]">Bag</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="grid grid-cols-4 gap-2 h-[280px] overflow-y-auto pr-1 bg-black/30 p-2 border border-slate-800 rounded-md">
            {slots.map((_, i) => {
                const item = inventory[i];
                return (
                    <div 
                      key={i}
                      onClick={() => item && onEquip(item)}
                      className="group relative w-10 h-10 bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:border-green-500 transition-all active:scale-95"
                    >
                        {item && <ItemIcon name={item.name} type={item.type} />}
                        {item && item.stats && (
                            <div className="absolute hidden group-hover:block bottom-full right-0 mb-2 w-32 bg-slate-950 border border-slate-700 p-2 text-[8px] z-[60] pointer-events-none shadow-xl">
                                <div className="text-green-400 font-bold mb-1">{item.name}</div>
                                {Object.entries(item.stats).map(([k, v]) => (
                                    <div key={k}>{k.toUpperCase()}: +{v}</div>
                                ))}
                                <div className="mt-1 text-[7px] text-slate-500 uppercase">Click to Equip/Use</div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 uppercase font-black">Gold Coins</span>
                <span className="text-lg font-black text-yellow-500 drop-shadow-sm">{stats.gold} <span className="text-[10px]">GP</span></span>
            </div>
            <div className="text-[9px] text-slate-700 text-center uppercase font-bold">
                Capacity: {inventory.length} / {maxInventorySlots}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryMenu;
