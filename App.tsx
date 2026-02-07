
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ClassType, GameState, Stats, Item, Equipment, MapId, ChatMessage } from './types';
import { createInitialState, update, allocateAttribute, equipItem, unequipItem, switchMap, buyItem, addChatMessage } from './game/engine';
import { getTileSprite, getEntitySprite, getCursorDataUrl } from './game/sprites';
import { TILE_SIZE } from './constants';
import { MAPS } from './game/maps';
import TitleScreen from './components/TitleScreen';
import CreationScreen from './components/CreationScreen';
import HUD from './components/HUD';
import CharMenu from './components/CharMenu';
import InventoryMenu from './components/InventoryMenu';
import Chat from './components/Chat';
import ShopMenu from './components/ShopMenu';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'title' | 'creation' | 'game'>('title');
  const [characterName, setCharacterName] = useState('');
  const [classType, setClassType] = useState<ClassType>(ClassType.WARRIOR);
  const [showCharMenu, setShowCharMenu] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [currentMapName, setCurrentMapName] = useState('');
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef({ x: 0, y: 0, clicked: false });
  
  const [hudStats, setHudStats] = useState<GameState['player']['stats'] | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeShopNPCId, setActiveShopNPCId] = useState<string | null>(null);
  const [isChatting, setIsChatting] = useState(false);

  const cursorUrl = useMemo(() => getCursorDataUrl(), []);

  const startGame = (name: string, type: ClassType) => {
    setCharacterName(name);
    setClassType(type);
    const state = createInitialState(name, type);
    gameStateRef.current = state;
    setCurrentMapName(MAPS[state.currentMapId].name);
    setScreen('game');
  };

  const handleSendMessage = useCallback((text: string) => {
    if (gameStateRef.current) {
        addChatMessage(gameStateRef.current, `${characterName}: ${text}`, 'system');
    }
  }, [characterName]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    
    if (key === 'enter' && screen === 'game') {
        setIsChatting(prev => !prev);
        return;
    }

    if (isChatting) return;

    keysRef.current.add(key);
    
    if (screen === 'game') {
        if (key === 'c') setShowCharMenu(prev => !prev);
        if (key === 'v') setShowInventory(prev => !prev);
        if (key === 'escape') {
            setShowCharMenu(false);
            setShowInventory(false);
            if (gameStateRef.current) gameStateRef.current.activeShopNPCId = null;
        }
    }
  }, [screen, isChatting]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key.toLowerCase());
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => { 
      if (e.button === 0) {
          if (e.target === canvasRef.current) {
              mouseRef.current.clicked = true; 
          }
      }
  }, []);
  
  const handleMouseUp = useCallback((e: MouseEvent) => { 
      if (e.button === 0) mouseRef.current.clicked = false; 
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  const handleContextMenu = useCallback((e: MouseEvent) => { e.preventDefault(); }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp, handleMouseMove, handleContextMenu]);

  useEffect(() => {
    if (screen !== 'game') return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      if (gameStateRef.current && canvasRef.current) {
        const activeKeys = isChatting ? new Set<string>() : keysRef.current;
        gameStateRef.current = update(gameStateRef.current, deltaTime, activeKeys, mouseRef.current, timestamp);
        render(gameStateRef.current, canvasRef.current, timestamp);
        
        if (timestamp % 100 < 20) {
            setHudStats({ ...gameStateRef.current.player.stats });
            setInventory([...gameStateRef.current.player.inventory]);
            setEquipment({ ...gameStateRef.current.player.equipment });
            setMessages([...gameStateRef.current.messages]);
            setActiveShopNPCId(gameStateRef.current.activeShopNPCId);
            setCoords({
              x: Math.floor(gameStateRef.current.player.x / TILE_SIZE),
              y: Math.floor(gameStateRef.current.player.y / TILE_SIZE)
            });
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [screen, isChatting]);

  const render = (state: GameState, canvas: HTMLCanvasElement, timestamp: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = false;

    ctx.save();
    ctx.translate(-state.cameraX, -state.cameraY);

    const startX = Math.max(0, Math.floor(state.cameraX / TILE_SIZE));
    const startY = Math.max(0, Math.floor(state.cameraY / TILE_SIZE));
    const endX = Math.min(state.map[0].length, startX + Math.ceil(w / TILE_SIZE) + 1);
    const endY = Math.min(state.map.length, startY + Math.ceil(h / TILE_SIZE) + 1);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
          const tile = state.map[y][x];
          ctx.drawImage(getTileSprite(tile), x * TILE_SIZE, y * TILE_SIZE);
      }
    }

    state.npcs.forEach(n => {
        const frame = Math.floor(timestamp / 400) % 2;
        ctx.drawImage(getEntitySprite(n.type, 'down', frame), n.x, n.y);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(n.name, n.x + 16, n.y - 14);
        ctx.fillStyle = '#fca311';
        ctx.font = 'bold 10px Courier New';
        ctx.fillText('[E] Talk', n.x + 16, n.y - 4);
    });

    state.monsters.forEach(m => {
        const isHit = m.isHit && (timestamp - m.isHit < 200);
        const frame = Math.floor(timestamp / 200) % 2;
        ctx.drawImage(getEntitySprite(m.type, m.direction, frame, !!isHit), m.x, m.y);
        ctx.fillStyle = 'black';
        ctx.fillRect(m.x + 4, m.y - 8, 24, 4);
        ctx.fillStyle = 'red';
        ctx.fillRect(m.x + 4, m.y - 8, 24 * (m.stats.hp / m.stats.maxHp), 4);
    });

    const p = state.player;
    const isPHit = p.isHit && (timestamp - p.isHit < 200);
    const pFrame = Math.floor(timestamp / 200) % 2;
    ctx.drawImage(getEntitySprite(p.classType, p.direction, pFrame, !!isPHit), p.x, p.y);

    state.projectiles.forEach(proj => {
        ctx.fillStyle = proj.color;
        if (proj.type === 'arrow') ctx.fillRect(proj.x - 4, proj.y - 1, 8, 2);
        else {
            ctx.beginPath(); ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 8; ctx.shadowColor = proj.color; ctx.fill(); ctx.shadowBlur = 0;
        }
    });

    state.floatingTexts.forEach(ft => {
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
    });

    ctx.restore();
  };

  const currentShopNPC = useMemo(() => {
    if (!activeShopNPCId || !gameStateRef.current) return null;
    return gameStateRef.current.npcs.find(n => n.id === activeShopNPCId);
  }, [activeShopNPCId]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none" style={{ cursor: screen === 'game' ? `url(${cursorUrl}), auto` : 'default' }}>
      {screen === 'title' && <TitleScreen onStart={() => setScreen('creation')} />}
      {screen === 'creation' && <CreationScreen onCreate={startGame} />}
      {screen === 'game' && (
        <>
          <canvas ref={canvasRef} className="absolute inset-0" />
          
          <div className="absolute top-8 right-8 flex items-center gap-4 pointer-events-none">
            <div className="text-slate-400 text-[11px] bg-black/80 px-4 py-2 rounded-lg border border-slate-700 backdrop-blur-md shadow-xl flex gap-3 font-bold tabular-nums">
              <span className="text-slate-500">POS:</span>
              <span className="text-yellow-500">X: {coords.x}</span>
              <span className="text-yellow-500">Y: {coords.y}</span>
            </div>
            <div className="text-slate-500 text-[10px] bg-black/60 px-5 py-2 rounded-full border border-slate-700 backdrop-blur-sm shadow-xl">
               REGION: <span className="text-yellow-500 font-black uppercase tracking-widest">{currentMapName}</span>
            </div>
          </div>
          
          {hudStats && <HUD stats={hudStats} />}
          <Chat 
            messages={messages} 
            isChatting={isChatting} 
            onSendMessage={handleSendMessage}
            onToggleChat={(val) => setIsChatting(val ?? !isChatting)}
          />

          {showCharMenu && hudStats && (
            <CharMenu stats={hudStats} name={characterName} onClose={() => setShowCharMenu(false)} onAllocate={(a) => {
                if(gameStateRef.current) gameStateRef.current = allocateAttribute(gameStateRef.current, a);
            }} />
          )}

          {showInventory && hudStats && equipment && (
            <InventoryMenu 
                inventory={inventory} 
                equipment={equipment} 
                stats={hudStats}
                onClose={() => setShowInventory(false)} 
                onEquip={(item) => { if(gameStateRef.current) gameStateRef.current = equipItem(gameStateRef.current, item); }} 
                onUnequip={(slot) => { if(gameStateRef.current) gameStateRef.current = unequipItem(gameStateRef.current, slot); }} 
            />
          )}

          {activeShopNPCId && currentShopNPC && hudStats && (
            <ShopMenu 
              npc={currentShopNPC} 
              playerStats={hudStats}
              onClose={() => { if(gameStateRef.current) gameStateRef.current.activeShopNPCId = null; }}
              onBuy={(item) => { if(gameStateRef.current) gameStateRef.current = buyItem(gameStateRef.current, item); }}
            />
          )}

          {gameStateRef.current?.levelUpMsg && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400 text-8xl font-black animate-bounce pointer-events-none drop-shadow-[0_0_40px_rgba(202,138,4,0.7)]">
                  LEVEL UP!
              </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
