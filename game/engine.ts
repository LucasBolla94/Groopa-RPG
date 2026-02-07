
import { GameState, ClassType, TileType, Entity, Monster, Projectile, FloatingText, Stats, Item, Equipment, MapId, NPC, ChatMessage, InteractiveObject } from '../types';
import { generateLorensMap } from './maps/lorens';
import { 
    MAP_SIZE, TILE_SIZE, CLASS_STATS, MONSTER_DATA, 
    MAX_MONSTERS, CHASE_RADIUS, SPAWN_RADIUS_MIN, SPAWN_RADIUS_MAX,
    ATTACK_COOLDOWN_PLAYER, ATTACK_COOLDOWN_MONSTER,
    MANA_REGEN_INTERVAL, HP_REGEN_INTERVAL, CITY_SAFE_RADIUS
} from '../constants';

let lastId = 0;
const generateId = () => (++lastId).toString();

export function addChatMessage(state: GameState, text: string, type: ChatMessage['type'] = 'system') {
    state.messages.push({ id: generateId(), text, type, timestamp: Date.now() });
    if (state.messages.length > 50) state.messages.shift();
}

export function createInitialState(name: string, classType: ClassType): GameState {
  const baseStats = CLASS_STATS[classType];
  const stats: Stats = {
    ...baseStats, maxHp: baseStats.hp, maxMana: baseStats.mana, level: 1, exp: 0, gold: 20000, 
    attributePoints: 0, strength: baseStats.strength, agility: baseStats.agility, magic: baseStats.magic, stamina: baseStats.stamina, health: baseStats.health,
  };

  const startX = (MAP_SIZE / 2) * TILE_SIZE;
  const startY = (MAP_SIZE / 2 + 5) * TILE_SIZE;

  const lorens = generateLorensMap();

  const npcs: NPC[] = [
      { id: 'n1', name: 'Merchant Hans', type: 'merchant_weapon', x: (MAP_SIZE/2 - 6) * TILE_SIZE, y: (MAP_SIZE/2 - 12) * TILE_SIZE, shopItems: [{ id: 'sw1', name: 'Steel Sword', type: 'weapon', price: 100, stats: { atk: 15 } }] },
      { id: 'n2', name: 'Alchemist Elena', type: 'merchant_potions' as any, x: (MAP_SIZE/2) * TILE_SIZE, y: (MAP_SIZE/2 - 12) * TILE_SIZE, shopItems: [{ id: 'p1', name: 'Health Potion', type: 'potion', price: 50 }] },
      { id: 'n3', name: 'Tailor Jinn', type: 'merchant_armor', x: (MAP_SIZE/2 + 6) * TILE_SIZE, y: (MAP_SIZE/2 - 12) * TILE_SIZE, shopItems: [{ id: 'a1', name: 'Leather Armor', type: 'armor', price: 200, stats: { def: 10 } }] },
  ];

  const state: GameState = {
    player: { id: 'player', name, classType, x: startX, y: startY, targetX: startX, targetY: startY, width: TILE_SIZE, height: TILE_SIZE, stats, inventory: [], equipment: { helmet: null, armor: null, gloves: null, pants: null, boots: null, weapon: null, shield: null, ring1: null, ring2: null, wings: null, backpack: null }, direction: 'down', lastAttack: 0, attackAnimTimer: 0 },
    monsters: [], npcs, interactiveObjects: lorens.interactiveObjects, houses: lorens.houses, projectiles: [], floatingTexts: [], messages: [], cameraX: 0, cameraY: 0, currentMapId: MapId.LORENS, map: lorens.map, levelUpMsg: false, activeShopNPCId: null,
  };

  addChatMessage(state, `Welcome to the Kingdom of Lorens, ${name}! Explore the square.`);
  return state;
}

export function update(state: GameState, deltaTime: number, keys: Set<string>, mouse: { x: number, y: number, clicked: boolean }, timestamp: number): GameState {
  const newState = { ...state };
  if (newState.activeShopNPCId) return newState;

  const player = newState.player;
  if (player.isDead) return newState;
  const baseSpeed = player.stats.speed * (deltaTime / 16);
  
  let inputX = 0; let inputY = 0;
  if (keys.has('arrowup') || keys.has('w')) inputY -= 1;
  if (keys.has('arrowdown') || keys.has('s')) inputY += 1;
  if (keys.has('arrowleft') || keys.has('a')) inputX -= 1;
  if (keys.has('arrowright') || keys.has('d')) inputX += 1;

  if (inputX !== 0 || inputY !== 0) {
      const length = Math.sqrt(inputX * inputX + inputY * inputY);
      const dx = (inputX / length) * baseSpeed;
      const dy = (inputY / length) * baseSpeed;
      const tryX = player.x + dx; const tryY = player.y + dy;
      if (!checkCollision(tryX, player.y, newState)) player.x = tryX;
      if (!checkCollision(player.x, tryY, newState)) player.y = tryY;
      if (Math.abs(inputX) > Math.abs(inputY)) player.direction = inputX > 0 ? 'right' : 'left';
      else player.direction = inputY > 0 ? 'down' : 'up';
  }

  newState.cameraX = player.x - window.innerWidth / 2;
  newState.cameraY = player.y - window.innerHeight / 2;

  if (keys.has('e')) {
      handleInteraction(newState);
      keys.delete('e');
  }

  if ((keys.has(' ') || mouse.clicked) && timestamp - player.lastAttack > ATTACK_COOLDOWN_PLAYER) {
      player.lastAttack = timestamp;
      const worldMouseX = mouse.x + newState.cameraX; const worldMouseY = mouse.y + newState.cameraY;
      const combatAngle = Math.atan2(worldMouseY - (player.y + 16), worldMouseX - (player.x + 16));
      if (player.classType === ClassType.WARRIOR) {
          newState.monsters.forEach(m => { if (Math.sqrt(Math.pow(m.x - player.x, 2) + Math.pow(m.y - player.y, 2)) < 64) applyDamage(newState, m, player.stats.atk); });
      } else {
          const pSpeed = 10;
          const color = player.classType === ClassType.MAGE ? '#4cc9f0' : '#fb8500';
          newState.projectiles.push({ id: generateId(), x: player.x+16, y: player.y+16, vx: Math.cos(combatAngle)*pSpeed, vy: Math.sin(combatAngle)*pSpeed, damage: player.stats.atk, ownerId: 'player', color, life: 1200 });
      }
  }

  updateProjectiles(newState, deltaTime);
  updateMonsters(newState, deltaTime, timestamp);
  updateFloatingTexts(newState, deltaTime);
  if (newState.monsters.length < MAX_MONSTERS && timestamp % 1000 < 50) spawnMonster(newState);
  return newState;
}

function handleInteraction(state: GameState) {
    const range = 48;
    const px = state.player.x + 16;
    const py = state.player.y + 16;

    for (let obj of state.interactiveObjects) {
        const ox = obj.x * TILE_SIZE + 16;
        const oy = obj.y * TILE_SIZE + 16;
        const d = Math.sqrt(Math.pow(px - ox, 2) + Math.pow(py - oy, 2));
        if (d < range) {
            if (obj.type === 'door') {
                const house = state.houses.find(h => h.id === obj.houseId);
                if (house && house.ownerId === null) {
                    if (state.player.stats.gold >= house.price) {
                        state.player.stats.gold -= house.price;
                        house.ownerId = 'player';
                        addChatMessage(state, `CONGRATULATIONS! You bought this house for $${house.price}!`, 'loot');
                        obj.isOpen = !obj.isOpen;
                    } else {
                        addChatMessage(state, `This house costs $${house.price}.`, 'system');
                    }
                } else if (house && house.ownerId === 'player') {
                    obj.isOpen = !obj.isOpen;
                }
    } else if (obj.type === 'bed') {
                state.player.stats.hp = state.player.stats.maxHp;
                state.player.isSleeping = true;
                setTimeout(() => { state.player.isSleeping = false; }, 1200);
                addChatMessage(state, "You rested and recovered your Health!", 'level');
            } else if (obj.type === 'fountain') {
                addChatMessage(state, "The water is fresh and cool.", 'system');
            }
            return;
        }
    }

    for (let npc of state.npcs) {
        const nx = npc.x + 16; const ny = npc.y + 16;
        const d = Math.sqrt(Math.pow(px - nx, 2) + Math.pow(py - ny, 2));
        if (d < range) {
            if (npc.shopItems) state.activeShopNPCId = npc.id;
            return;
        }
    }
}

function checkCollision(x: number, y: number, state: GameState): boolean {
  const buffer = 10;
  const points = [{ x: x + buffer, y: y + buffer }, { x: x + TILE_SIZE - buffer, y: y + buffer }, { x: x + buffer, y: y + TILE_SIZE - buffer }, { x: x + TILE_SIZE - buffer, y: y + TILE_SIZE - buffer }];
  for (const p of points) {
      const tx = Math.floor(p.x / TILE_SIZE), ty = Math.floor(p.y / TILE_SIZE);
      if (tx < 0 || tx >= MAP_SIZE || ty < 0 || ty >= MAP_SIZE) return true;
      const t = state.map[ty][tx];
      if (t === TileType.WATER || t === TileType.WALL || t === TileType.FOREST) return true;
      
      const obj = state.interactiveObjects.find(o => o.x === tx && o.y === ty);
      if (obj && obj.type === 'door' && !obj.isOpen) return true;
      if (obj && (obj.type === 'bed' || obj.type === 'chest' || obj.type === 'stall')) return true;
  }
  return false;
}

function updateProjectiles(state: GameState, deltaTime: number) {
    state.projectiles = state.projectiles.filter(p => {
        p.x += p.vx * (deltaTime / 16); p.y += p.vy * (deltaTime / 16); p.life -= deltaTime;
        if (p.ownerId === 'player') {
            for (let m of state.monsters) {
                if (Math.abs(m.x + 16 - p.x) < 24 && Math.abs(m.y + 16 - p.y) < 24) { applyDamage(state, m, p.damage); return false; }
            }
        }
        return p.life > 0;
    });
}

function updateMonsters(state: GameState, deltaTime: number, timestamp: number) {
    state.monsters = state.monsters.filter(m => {
        if (m.stats.hp > 0) return true;
        if (!m.deathTime) m.deathTime = timestamp;
        return timestamp - m.deathTime < 700;
    });
    state.monsters.forEach(m => {
        if (m.stats.hp <= 0) {
            m.isDead = true;
            return;
        }
        const d = Math.sqrt(Math.pow(m.x - state.player.x, 2) + Math.pow(m.y - state.player.y, 2)) / TILE_SIZE;
        if (d < CHASE_RADIUS) {
            const angle = Math.atan2(state.player.y - m.y, state.player.x - m.x);
            const vx = Math.cos(angle); const vy = Math.sin(angle);
            const nx = m.x + vx * 1.5, ny = m.y + vy * 1.5;
            if (!checkCollision(nx, ny, state)) { m.x = nx; m.y = ny; }
            if (d < 1.3 && timestamp - m.lastAttack > ATTACK_COOLDOWN_MONSTER) {
                m.lastAttack = timestamp; applyDamage(state, state.player, m.stats.atk, true);
            }
        }
    });
}

function spawnMonster(state: GameState) {
    const cx = MAP_SIZE / 2;
    const cy = MAP_SIZE / 2;
    const angle = Math.random() * Math.PI * 2;
    const r = 50 + Math.random() * 40; 
    const sx = Math.floor(cx + Math.cos(angle) * r), sy = Math.floor(cy + Math.sin(angle) * r);
    if (sx < 0 || sx >= MAP_SIZE || sy < 0 || sy >= MAP_SIZE) return;
    if (state.map[sy][sx] !== TileType.GRASS) return;
    
    const types = Object.keys(MONSTER_DATA) as (keyof typeof MONSTER_DATA)[];
    const type = types[Math.floor(Math.random() * types.length)];
    const data = MONSTER_DATA[type];
    
    state.monsters.push({
        id: generateId(), name: type, type: type as any, x: sx * TILE_SIZE, y: sy * TILE_SIZE, targetX: sx * TILE_SIZE, targetY: sy * TILE_SIZE,
        width: TILE_SIZE, height: TILE_SIZE, direction: 'down', lastAttack: 0, state: 'WANDER', spawnPoint: { x: sx * TILE_SIZE, y: sy * TILE_SIZE },
        inventory: [], equipment: { helmet: null, armor: null, gloves: null, pants: null, boots: null, weapon: null, shield: null, ring1: null, ring2: null, wings: null, backpack: null },
        stats: { hp: data.hp, maxHp: data.hp, mana: 0, maxMana: 0, atk: data.atk, def: data.def, speed: 1.5, exp: data.exp, level: 1, gold: 5, attributePoints: 0, strength: 1, agility: 1, magic: 1, stamina: 1, health: 1 }
    });
}

function applyDamage(state: GameState, target: Entity, rawAtk: number, isToPlayer: boolean = false) {
    const damage = Math.max(1, rawAtk - Math.floor(target.stats.def / 2));
    target.stats.hp -= damage; target.isHit = Date.now();
    state.floatingTexts.push({ id: generateId(), text: damage.toString(), x: target.x + 16, y: target.y, color: isToPlayer ? '#ff4d6d' : '#f8f9fa', life: 1000 });
    if (target.stats.hp <= 0 && isToPlayer) {
        state.player.isDead = true;
        state.player.deathTime = Date.now();
    }
    if (target.stats.hp <= 0 && !isToPlayer) { 
        state.player.stats.exp += target.stats.exp; 
        state.player.stats.gold += Math.floor(Math.random() * 20) + 10;
        checkLevelUp(state); 
    }
}

function checkLevelUp(state: GameState) {
    const needed = Math.floor(50 * state.player.stats.level * 1.4);
    if (state.player.stats.exp >= needed) {
        state.player.stats.level++; state.player.stats.exp -= needed; state.player.stats.attributePoints += 5; state.player.stats.maxHp += 20; state.player.stats.hp = state.player.stats.maxHp; state.levelUpMsg = true;
        setTimeout(() => { state.levelUpMsg = false; }, 2000);
    }
}

function updateFloatingTexts(state: GameState, deltaTime: number) {
    state.floatingTexts = state.floatingTexts.filter(ft => { ft.y -= 0.5 * (deltaTime / 16); ft.life -= deltaTime; return ft.life > 0; });
}

export function allocateAttribute(state: GameState, attr: keyof Stats): GameState {
    const newState = { ...state };
    if (newState.player.stats.attributePoints <= 0) return state;
    newState.player.stats.attributePoints--;
    if (attr === 'strength') newState.player.stats.strength++;
    else if (attr === 'health') { newState.player.stats.health++; newState.player.stats.maxHp += 20; newState.player.stats.hp += 20; }
    return newState;
}

export function buyItem(state: GameState, item: Item): GameState {
    const newState = { ...state };
    if (newState.player.stats.gold >= (item.price || 0)) {
        newState.player.stats.gold -= (item.price || 0);
        newState.player.inventory.push({ ...item, id: generateId() });
        addChatMessage(newState, `Bought ${item.name}!`, 'loot');
    }
    return newState;
}

export function equipItem(state: GameState, item: Item): GameState {
    const newState = { ...state };
    const player = newState.player;
    
    // Find slot by item type
    let slot: keyof Equipment | null = null;
    if (item.type === 'weapon') slot = 'weapon';
    else if (item.type === 'armor') slot = 'armor';
    else if (item.type === 'helmet') slot = 'helmet';
    else if (item.type === 'shield') slot = 'shield';
    else if (item.type === 'pants') slot = 'pants';
    else if (item.type === 'boots') slot = 'boots';
    else if (item.type === 'gloves') slot = 'gloves';
    else if (item.type === 'ring') slot = player.equipment.ring1 ? 'ring2' : 'ring1';
    else if (item.type === 'wings') slot = 'wings';
    else if (item.type === 'backpack') slot = 'backpack';

    if (slot) {
        const current = player.equipment[slot];
        if (current) {
            player.inventory.push(current);
            if (current.stats) {
                if (current.stats.atk) player.stats.atk -= current.stats.atk;
                if (current.stats.def) player.stats.def -= current.stats.def;
            }
        }
        player.equipment[slot] = item;
        player.inventory = player.inventory.filter(i => i.id !== item.id);
        if (item.stats) {
            if (item.stats.atk) player.stats.atk += item.stats.atk;
            if (item.stats.def) player.stats.def += item.stats.def;
        }
        addChatMessage(newState, `Equipped ${item.name}.`, 'system');
    }
    
    return newState;
}

export function unequipItem(state: GameState, slot: keyof Equipment): GameState {
    const newState = { ...state };
    const player = newState.player;
    const item = player.equipment[slot];
    if (item) {
        player.inventory.push(item);
        player.equipment[slot] = null;
        if (item.stats) {
            if (item.stats.atk) player.stats.atk -= item.stats.atk;
            if (item.stats.def) player.stats.def -= item.stats.def;
        }
        addChatMessage(newState, `Unequipped ${item.name}.`, 'system');
    }
    return newState;
}
