
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ClassType, GameState, Stats, Item, Equipment, MapId, ChatMessage } from './types';
import { createInitialState, update, allocateAttribute, equipItem, unequipItem, buyItem, addChatMessage } from './game/engine';
import { getTileSprite, getEntitySprite, getInteractiveSprite, getCursorDataUrl } from './game/sprites';
import { TILE_SIZE } from './constants';
import TitleScreen from './components/TitleScreen';
import CreationScreen from './components/CreationScreen';
import HUD from './components/HUD';
import CharMenu from './components/CharMenu';
import InventoryMenu from './components/InventoryMenu';
import Chat from './components/Chat';
import ShopMenu from './components/ShopMenu';
import EscMenu from './components/EscMenu';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'title' | 'creation' | 'game'>('title');
  const [characterName, setCharacterName] = useState('');
  const [classType, setClassType] = useState<ClassType>(ClassType.WARRIOR);
  const [showCharMenu, setShowCharMenu] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showEscMenu, setShowEscMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef({ x: 0, y: 0, clicked: false });
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const [hudStats, setHudStats] = useState<GameState['player']['stats'] | null>(null);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeShopNPCId, setActiveShopNPCId] = useState<string | null>(null);
  const [isChatting, setIsChatting] = useState(false);

  const cursorUrl = useMemo(() => getCursorDataUrl(), []);

  const playSound = (type: 'click' | 'hit' | 'level') => {
    if (!soundEnabled) return;
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (type === 'click') { osc.type = 'square'; osc.frequency.setValueAtTime(440, ctx.currentTime); gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); osc.start(); osc.stop(ctx.currentTime + 0.1); }
    else if (type === 'hit') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, ctx.currentTime); gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); osc.start(); osc.stop(ctx.currentTime + 0.2); }
    else if (type === 'level') { osc.type = 'square'; osc.frequency.setValueAtTime(440, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5); gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); osc.start(); osc.stop(ctx.currentTime + 0.5); }
  };

  const startGame = (name: string, type: ClassType) => {
    setCharacterName(name); setClassType(type);
    const state = createInitialState(name, type);
    gameStateRef.current = state; setScreen('game');
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (key === 'escape' && screen === 'game') { setShowEscMenu(prev => !prev); playSound('click'); keysRef.current.clear(); return; }
    if (showEscMenu) return;
    if (key === 'enter' && screen === 'game') { setIsChatting(prev => !prev); playSound('click'); return; }
    if (isChatting) return;
    keysRef.current.add(key);
    if (screen === 'game') {
        if (key === 'c') { setShowCharMenu(prev => !prev); playSound('click'); }
        if (key === 'v') { setShowInventory(prev => !prev); playSound('click'); }
    }
  }, [screen, isChatting, showEscMenu, soundEnabled]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase()), []);
  const handleMouseDown = useCallback((e: MouseEvent) => { if (e.button === 0 && screen === 'game' && !showEscMenu && e.target === canvasRef.current) mouseRef.current.clicked = true; }, [screen, showEscMenu]);
  const handleMouseUp = useCallback((e: MouseEvent) => { if (e.button === 0) mouseRef.current.clicked = false; }, []);
  const handleMouseMove = useCallback((e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown); window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown); window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp, handleMouseMove]);

  useEffect(() => {
    if (screen !== 'game') return;
    let animationFrameId: number;
    let lastTime = performance.now();
    const loop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      if (gameStateRef.current && canvasRef.current) {
        const activeKeys = (isChatting || showEscMenu) ? new Set<string>() : keysRef.current;
        const activeMouse = showEscMenu ? { ...mouseRef.current, clicked: false } : mouseRef.current;
        const oldHp = gameStateRef.current.player.stats.hp;
        const oldLevel = gameStateRef.current.player.stats.level;
        gameStateRef.current = update(gameStateRef.current, deltaTime, activeKeys, activeMouse, timestamp);
        render(gameStateRef.current, canvasRef.current, timestamp);
        if (gameStateRef.current.player.stats.hp < oldHp) playSound('hit');
        if (gameStateRef.current.player.stats.level > oldLevel) playSound('level');
        if (timestamp % 100 < 20) {
            setHudStats({ ...gameStateRef.current.player.stats });
            setInventory([...gameStateRef.current.player.inventory]);
            setEquipment({ ...gameStateRef.current.player.equipment });
            setMessages([...gameStateRef.current.messages]);
            setActiveShopNPCId(gameStateRef.current.activeShopNPCId);
            setCoords({ x: Math.floor(gameStateRef.current.player.x / TILE_SIZE), y: Math.floor(gameStateRef.current.player.y / TILE_SIZE) });
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [screen, isChatting, showEscMenu, soundEnabled]);

  const render = (state: GameState, canvas: HTMLCanvasElement, timestamp: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width = window.innerWidth; const h = canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, w, h); ctx.imageSmoothingEnabled = false;
    ctx.save(); ctx.translate(-state.cameraX, -state.cameraY);

    const startX = Math.max(0, Math.floor(state.cameraX / TILE_SIZE));
    const startY = Math.max(0, Math.floor(state.cameraY / TILE_SIZE));
    const endX = Math.min(state.map[0].length, startX + Math.ceil(w / TILE_SIZE) + 1);
    const endY = Math.min(state.map.length, startY + Math.ceil(h / TILE_SIZE) + 1);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
          ctx.drawImage(getTileSprite(state.map[y][x]), x * TILE_SIZE, y * TILE_SIZE);
      }
    }

    state.interactiveObjects.forEach(obj => {
        ctx.drawImage(getInteractiveSprite(obj.type, obj.isOpen), obj.x * TILE_SIZE, obj.y * TILE_SIZE);
        if (obj.type === 'door') {
            const house = state.houses.find(h => h.id === obj.houseId);
            if (house && house.ownerId === null) {
                ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center';
                ctx.fillText('HOUSE $15k', obj.x * TILE_SIZE + 16, obj.y * TILE_SIZE - 4);
            }
        }
    });

    state.npcs.forEach(n => {
        const frame = Math.floor(timestamp / 400) % 2;
        ctx.drawImage(getEntitySprite(n.type, 'down', frame), n.x, n.y);
        ctx.fillStyle = 'white'; ctx.font = 'bold 12px Courier New'; ctx.textAlign = 'center'; ctx.fillText(n.name, n.x + 16, n.y - 14);
        ctx.fillStyle = '#fca311'; ctx.font = 'bold 10px Courier New'; ctx.fillText('[E] Trade', n.x + 16, n.y - 4);
    });

    state.monsters.forEach(m => {
        const isHit = m.isHit && (timestamp - m.isHit < 200);
        const frame = Math.floor(timestamp / 200) % 2;
        ctx.drawImage(getEntitySprite(m.type, m.direction, frame, !!isHit), m.x, m.y);
        ctx.fillStyle = 'black'; ctx.fillRect(m.x + 4, m.y - 8, 24, 4);
        ctx.fillStyle = 'red'; ctx.fillRect(m.x + 4, m.y - 8, 24 * (m.stats.hp / m.stats.maxHp), 4);
    });

    const p = state.player;
    const isPHit = p.isHit && (timestamp - p.isHit < 200);
    const pFrame = Math.floor(timestamp / 200) % 2;
    ctx.drawImage(getEntitySprite(p.classType, p.direction, pFrame, !!isPHit), p.x, p.y);

    state.projectiles.forEach(proj => { ctx.fillStyle = proj.color; ctx.beginPath(); ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2); ctx.fill(); });
    state.floatingTexts.forEach(ft => { ctx.fillStyle = ft.color; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center'; ctx.fillText(ft.text, ft.x, ft.y); });
    ctx.restore();
  };

  const handleLogout = () => { playSound('click'); setScreen('title'); setShowEscMenu(false); gameStateRef.current = null; };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none" style={{ cursor: screen === 'game' ? `url(${cursorUrl}), auto` : 'default' }}>
      {screen === 'title' && <TitleScreen onStart={() => setScreen('creation')} />}
      {screen === 'creation' && <CreationScreen onCreate={startGame} />}
      {screen === 'game' && (
        <>
          <canvas ref={canvasRef} className="absolute inset-0" />
          <div className="absolute top-8 right-8 flex items-center gap-4 pointer-events-none">
            <div className="text-slate-400 text-[11px] bg-black/80 px-4 py-2 rounded-lg border border-slate-700 backdrop-blur-md shadow-xl flex gap-3 font-bold tabular-nums">
              <span className="text-slate-500">POS:</span> <span className="text-yellow-500">X: {coords.x} Y: {coords.y}</span>
            </div>
          </div>
          {hudStats && <HUD stats={hudStats} />}
          <Chat messages={messages} isChatting={isChatting} onSendMessage={(txt) => { if (gameStateRef.current) addChatMessage(gameStateRef.current, `${characterName}: ${txt}`, 'system'); }} onToggleChat={(val) => setIsChatting(val ?? !isChatting)} />
          {showCharMenu && hudStats && <CharMenu stats={hudStats} name={characterName} onClose={() => setShowCharMenu(false)} onAllocate={(a) => { playSound('click'); if(gameStateRef.current) gameStateRef.current = allocateAttribute(gameStateRef.current, a); }} />}
          {showInventory && hudStats && equipment && <InventoryMenu inventory={inventory} equipment={equipment} stats={hudStats} onClose={() => setShowInventory(false)} onEquip={(item) => { playSound('click'); if(gameStateRef.current) gameStateRef.current = equipItem(gameStateRef.current, item); }} onUnequip={(slot) => { playSound('click'); if(gameStateRef.current) gameStateRef.current = unequipItem(gameStateRef.current, slot); }} />}
          {activeShopNPCId && hudStats && gameStateRef.current && <ShopMenu npc={gameStateRef.current.npcs.find(n => n.id === activeShopNPCId)!} playerStats={hudStats} onClose={() => { playSound('click'); if(gameStateRef.current) gameStateRef.current.activeShopNPCId = null; }} onBuy={(item) => { playSound('click'); if(gameStateRef.current) gameStateRef.current = buyItem(gameStateRef.current, item); }} />}
          {showEscMenu && <EscMenu soundEnabled={soundEnabled} onToggleSound={() => { playSound('click'); setSoundEnabled(!soundEnabled); }} onLogout={handleLogout} onResume={() => { playSound('click'); setShowEscMenu(false); }} />}
        </>
      )}
    </div>
  );
};

export default App;
