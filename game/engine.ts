
import { GameState, ClassType, TileType, Entity, Monster, Projectile, FloatingText, Stats, Item, Equipment, MapId, NPC, ChatMessage } from '../types';
import { generateMap } from './mapGenerator';
import { MAPS } from './maps';
import { 
    MAP_SIZE, TILE_SIZE, CLASS_STATS, MONSTER_DATA, 
    MAX_MONSTERS, CHASE_RADIUS, SPAWN_RADIUS_MIN, SPAWN_RADIUS_MAX,
    ATTACK_COOLDOWN_PLAYER, ATTACK_COOLDOWN_MONSTER,
    MANA_REGEN_INTERVAL, HP_REGEN_INTERVAL, CITY_SAFE_RADIUS
} from '../constants';

let lastId = 0;
const generateId = () => (++lastId).toString();

export function addChatMessage(state: GameState, text: string, type: ChatMessage['type'] = 'system') {
    state.messages.push({
        id: generateId(),
        text,
        type,
        timestamp: Date.now()
    });
    if (state.messages.length > 50) state.messages.shift();
}

export function createInitialState(name: string, classType: ClassType): GameState {
  const baseStats = CLASS_STATS[classType];
  const stats: Stats = {
    ...baseStats,
    maxHp: baseStats.hp,
    maxMana: baseStats.mana,
    level: 1,
    exp: 0,
    gold: 50,
    attributePoints: 0,
    strength: baseStats.strength,
    agility: baseStats.agility,
    magic: baseStats.magic,
    stamina: baseStats.stamina,
    health: baseStats.health,
  };

  const startX = (MAP_SIZE / 2 + 3) * TILE_SIZE;
  const startY = (MAP_SIZE / 2 + 3) * TILE_SIZE;

  const initialInventory: Item[] = [
    { id: generateId(), name: 'Apprentice Pack', type: 'backpack' },
  ];

  const initialMapId = MapId.LORENS;
  const npcs: NPC[] = [
      { 
        id: 'n1', name: 'Blacksmith Hans', type: 'merchant_weapon', x: (MAP_SIZE/2 - 12) * TILE_SIZE, y: (MAP_SIZE/2 - 12) * TILE_SIZE,
        shopItems: [
            { id: 'sw1', name: 'Steel Sword', type: 'weapon', price: 100, stats: { atk: 15 } },
            { id: 'sw2', name: 'Golden Gladius', type: 'weapon', price: 450, stats: { atk: 35, speed: 0.2 } },
            { id: 'sw3', name: 'Rune Blade', type: 'weapon', price: 1200, stats: { atk: 65, mana: 20 } },
            { id: 'sw4', name: 'Obsidian Claymore', type: 'weapon', price: 2500, stats: { atk: 110, def: 20 } },
            { id: 'sw5', name: 'Fire Brand', type: 'weapon', price: 5000, stats: { atk: 180, hp: 50 } },
            { id: 'ax1', name: 'Battle Axe', type: 'weapon', price: 250, stats: { atk: 35 } }
        ]
      },
      { 
        id: 'n2', name: 'Armorer Elena', type: 'merchant_armor', x: (MAP_SIZE/2 + 12) * TILE_SIZE, y: (MAP_SIZE/2 - 12) * TILE_SIZE,
        shopItems: [
            { id: 'ar1', name: 'Chainmail', type: 'armor', price: 150, stats: { def: 10 } },
            { id: 'sh1', name: 'Iron Shield', type: 'shield', price: 120, stats: { def: 8 } }
        ]
      },
      { 
        id: 'n3', name: 'Alchemist Theo', type: 'merchant_potions', x: (MAP_SIZE/2 - 12) * TILE_SIZE, y: (MAP_SIZE/2 + 12) * TILE_SIZE,
        shopItems: [
            { id: 'p1', name: 'Small Health Potion', type: 'potion', price: 20, stats: { hp: 50 } },
            { id: 'p2', name: 'Small Mana Potion', type: 'potion', price: 20, stats: { mana: 30 } }
        ]
      },
      { id: 'n4', name: 'Royal Guard', type: 'guide', x: (MAP_SIZE/2) * TILE_SIZE, y: (MAP_SIZE/2 - 34) * TILE_SIZE },
  ];

  const state: GameState = {
    player: {
      id: 'player',
      name,
      classType,
      x: startX,
      y: startY,
      targetX: startX,
      targetY: startY,
      width: TILE_SIZE,
      height: TILE_SIZE,
      stats,
      inventory: initialInventory,
      equipment: {
        helmet: null, armor: null, gloves: null, pants: null, boots: null,
        weapon: null, shield: null, ring1: null, ring2: null, wings: null, backpack: null
      },
      direction: 'down',
      lastAttack: 0,
      attackAnimTimer: 0,
    },
    monsters: [],
    npcs,
    projectiles: [],
    floatingTexts: [],
    messages: [],
    cameraX: 0,
    cameraY: 0,
    currentMapId: initialMapId,
    map: generateMap(initialMapId),
    levelUpMsg: false,
    activeShopNPCId: null,
  };

  addChatMessage(state, `Welcome to Groopa, ${name}!`);
  return state;
}

export function update(state: GameState, deltaTime: number, keys: Set<string>, mouse: { x: number, y: number, clicked: boolean }, timestamp: number): GameState {
  const newState = { ...state };
  if (newState.activeShopNPCId) return newState;

  const player = newState.player;
  const speed = player.stats.speed * (deltaTime / 16);
  let dx = 0, dy = 0;

  if (keys.has('arrowup') || keys.has('w')) { dy -= speed; player.direction = 'up'; }
  if (keys.has('arrowdown') || keys.has('s')) { dy += speed; player.direction = 'down'; }
  if (keys.has('arrowleft') || keys.has('a')) { dx -= speed; player.direction = 'left'; }
  if (keys.has('arrowright') || keys.has('d')) { dx += speed; player.direction = 'right'; }

  const tryX = player.x + dx;
  const tryY = player.y + dy;
  
  if (!checkCollision(tryX, player.y, newState.map)) player.x = tryX;
  if (!checkCollision(player.x, tryY, newState.map)) player.y = tryY;

  newState.cameraX = player.x - window.innerWidth / 2;
  newState.cameraY = player.y - window.innerHeight / 2;

  if (keys.has('e')) {
      const interactRange = 64;
      newState.npcs.forEach(npc => {
          const d = Math.sqrt(Math.pow(npc.x - player.x, 2) + Math.pow(npc.y - player.y, 2));
          if (d < interactRange) {
              if (npc.shopItems) {
                  newState.activeShopNPCId = npc.id;
                  addChatMessage(newState, `Trading with ${npc.name}...`);
              } else addChatMessage(newState, `${npc.name}: "Greetings, traveler!"`);
              keys.delete('e'); 
          }
      });
  }

  if ((keys.has(' ') || mouse.clicked) && timestamp - player.lastAttack > ATTACK_COOLDOWN_PLAYER) {
      player.lastAttack = timestamp;
      const worldMouseX = mouse.x + newState.cameraX;
      const worldMouseY = mouse.y + newState.cameraY;
      const combatAngle = Math.atan2(worldMouseY - (player.y + 16), worldMouseX - (player.x + 16));

      if (player.classType === ClassType.WARRIOR) {
          newState.monsters.forEach(m => {
              if (Math.sqrt(Math.pow(m.x - player.x, 2) + Math.pow(m.y - player.y, 2)) < 64) applyDamage(newState, m, player.stats.atk);
          });
      } else {
          const pSpeed = 10;
          if (player.classType === ClassType.MAGE && player.stats.mana >= 5) {
              player.stats.mana -= 5;
              newState.projectiles.push({ id: generateId(), x: player.x+16, y: player.y+16, vx: Math.cos(combatAngle)*pSpeed, vy: Math.sin(combatAngle)*pSpeed, damage: player.stats.atk, ownerId: 'player', color: '#4cc9f0', life: 1200, type: 'magic' });
          } else if (player.classType === ClassType.ELF) {
              newState.projectiles.push({ id: generateId(), x: player.x+16, y: player.y+16, vx: Math.cos(combatAngle)*pSpeed, vy: Math.sin(combatAngle)*pSpeed, damage: player.stats.atk, ownerId: 'player', color: '#fb8500', life: 1200, type: 'arrow' });
          }
      }
  }

  updateProjectiles(newState, deltaTime);
  updateMonsters(newState, deltaTime, timestamp);
  updateFloatingTexts(newState, deltaTime);

  if (newState.monsters.length < MAX_MONSTERS && timestamp % 200 < 20) spawnMonster(newState);
  if (timestamp % MANA_REGEN_INTERVAL < 20) player.stats.mana = Math.min(player.stats.maxMana, player.stats.mana + (player.classType === ClassType.MAGE ? 5 : 2));
  if (timestamp % HP_REGEN_INTERVAL < 20) player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + 2);

  return newState;
}

function updateProjectiles(state: GameState, deltaTime: number) {
    state.projectiles = state.projectiles.filter(p => {
        p.x += p.vx * (deltaTime / 16);
        p.y += p.vy * (deltaTime / 16);
        p.life -= deltaTime;
        if (p.ownerId === 'player') {
            for (let m of state.monsters) {
                if (Math.abs(m.x + 16 - p.x) < 24 && Math.abs(m.y + 16 - p.y) < 24) {
                    applyDamage(state, m, p.damage);
                    return false;
                }
            }
        }
        return p.life > 0;
    });
}

function updateMonsters(state: GameState, deltaTime: number, timestamp: number) {
    state.monsters = state.monsters.filter(m => m.stats.hp > 0);
    state.monsters.forEach(m => {
        const distToPlayer = Math.sqrt(Math.pow(m.x - state.player.x, 2) + Math.pow(m.y - state.player.y, 2)) / TILE_SIZE;
        const distFromCenter = Math.sqrt(Math.pow(m.x - (MAP_SIZE/2)*TILE_SIZE, 2) + Math.pow(m.y - (MAP_SIZE/2)*TILE_SIZE, 2)) / TILE_SIZE;

        if (distFromCenter < CITY_SAFE_RADIUS) {
            const angleAway = Math.atan2(m.y - (MAP_SIZE/2)*TILE_SIZE, m.x - (MAP_SIZE/2)*TILE_SIZE);
            m.x += Math.cos(angleAway) * 2; m.y += Math.sin(angleAway) * 2;
            m.state = 'WANDER'; return;
        }

        if (distToPlayer < CHASE_RADIUS) m.state = 'CHASE';
        else if (distToPlayer > CHASE_RADIUS * 2) m.state = 'WANDER';

        if (m.state === 'CHASE') {
            const angle = Math.atan2(state.player.y - m.y, state.player.x - m.x);
            const mSpeed = m.stats.speed * (deltaTime / 16);
            const nx = m.x + Math.cos(angle) * mSpeed, ny = m.y + Math.sin(angle) * mSpeed;
            if (!checkCollision(nx, ny, state.map)) { m.x = nx; m.y = ny; }
            if (distToPlayer < 1.3 && timestamp - m.lastAttack > ATTACK_COOLDOWN_MONSTER) {
                m.lastAttack = timestamp; applyDamage(state, state.player, m.stats.atk, true);
            }
        } else {
            if (timestamp % 3000 < 20) {
                m.targetX = m.spawnPoint.x + (Math.random() - 0.5) * 100;
                m.targetY = m.spawnPoint.y + (Math.random() - 0.5) * 100;
            }
            const angle = Math.atan2(m.targetY - m.y, m.targetX - m.x);
            const nx = m.x + Math.cos(angle) * (m.stats.speed * 0.5), ny = m.y + Math.sin(angle) * (m.stats.speed * 0.5);
            if (!checkCollision(nx, ny, state.map)) { m.x = nx; m.y = ny; }
        }
    });
}

function spawnMonster(state: GameState) {
    const config = MAPS[state.currentMapId];
    const angle = Math.random() * Math.PI * 2;
    const r = SPAWN_RADIUS_MIN + Math.random() * (SPAWN_RADIUS_MAX - SPAWN_RADIUS_MIN);
    const sx = Math.floor(MAP_SIZE / 2 + Math.cos(angle) * r), sy = Math.floor(MAP_SIZE / 2 + Math.sin(angle) * r);

    if (sx < 0 || sx >= MAP_SIZE || sy < 0 || sy >= MAP_SIZE) return;
    const tile = state.map[sy][sx];
    if (tile === TileType.WATER || tile === TileType.WALL) return;

    const type = config.monsterTable[Math.floor(Math.random() * config.monsterTable.length)] as keyof typeof MONSTER_DATA;
    const data = MONSTER_DATA[type];
    const diff = config.difficulty;

    state.monsters.push({
        id: generateId(), name: type, type, x: sx * TILE_SIZE, y: sy * TILE_SIZE, targetX: sx * TILE_SIZE, targetY: sy * TILE_SIZE,
        width: TILE_SIZE, height: TILE_SIZE, direction: 'down', lastAttack: 0, state: 'WANDER', spawnPoint: { x: sx * TILE_SIZE, y: sy * TILE_SIZE },
        inventory: [], equipment: { helmet: null, armor: null, gloves: null, pants: null, boots: null, weapon: null, shield: null, ring1: null, ring2: null, wings: null, backpack: null },
        stats: { hp: Math.floor(data.hp*diff), maxHp: Math.floor(data.hp*diff), mana: 0, maxMana: 0, atk: Math.floor(data.atk*diff), def: Math.floor(data.def*diff), speed: 1.5, exp: Math.floor(data.exp*diff), level: 1, gold: Math.floor(Math.random()*(data.gold[1]-data.gold[0])+data.gold[0]), attributePoints: 0, strength: 1, agility: 1, magic: 1, stamina: 1, health: 1 }
    });
}

function applyDamage(state: GameState, target: Entity, rawAtk: number, isToPlayer: boolean = false) {
    const damage = Math.max(1, rawAtk - Math.floor(target.stats.def / 2));
    target.stats.hp -= damage;
    target.isHit = Date.now();
    state.floatingTexts.push({ id: generateId(), text: damage.toString(), x: target.x + 16, y: target.y, color: isToPlayer ? '#ff4d6d' : '#f8f9fa', life: 1000 });
    
    if (target.stats.hp <= 0 && !isToPlayer) {
        state.player.stats.exp += target.stats.exp;
        state.player.stats.gold += target.stats.gold;
        addChatMessage(state, `Defeated ${target.name}! +${target.stats.exp} EXP, +${target.stats.gold} Gold.`, 'loot');
        checkLevelUp(state);
    }
}

function checkLevelUp(state: GameState) {
    const expNeeded = Math.floor(50 * state.player.stats.level * 1.4);
    if (state.player.stats.exp >= expNeeded) {
        state.player.stats.level++;
        state.player.stats.exp -= expNeeded;
        state.player.stats.attributePoints += 5;
        state.player.stats.maxHp += 20;
        state.player.stats.hp = state.player.stats.maxHp;
        state.levelUpMsg = true;
        addChatMessage(state, `LEVEL UP! Level ${state.player.stats.level}!`, 'level');
        setTimeout(() => { state.levelUpMsg = false; }, 2000);
    }
}

function checkCollision(x: number, y: number, map: number[][]): boolean {
  const buffer = 10;
  const points = [{ x: x + buffer, y: y + buffer }, { x: x + TILE_SIZE - buffer, y: y + buffer }, { x: x + buffer, y: y + TILE_SIZE - buffer }, { x: x + TILE_SIZE - buffer, y: y + TILE_SIZE - buffer }];
  for (const p of points) {
      const tx = Math.floor(p.x / TILE_SIZE), ty = Math.floor(p.y / TILE_SIZE);
      if (tx < 0 || tx >= MAP_SIZE || ty < 0 || ty >= MAP_SIZE) return true;
      const t = map[ty][tx];
      if (t === TileType.WATER || t === TileType.WALL || t === TileType.FOREST) return true;
  }
  return false;
}

function updateFloatingTexts(state: GameState, deltaTime: number) {
    state.floatingTexts = state.floatingTexts.filter(ft => { ft.y -= 0.5 * (deltaTime / 16); ft.life -= deltaTime; return ft.life > 0; });
}

export function switchMap(state: GameState, mapId: MapId): GameState {
    const newState = { ...state };
    newState.currentMapId = mapId; newState.map = generateMap(mapId);
    newState.monsters = []; newState.player.x = (MAP_SIZE / 2 + 3) * TILE_SIZE; newState.player.y = (MAP_SIZE / 2 + 3) * TILE_SIZE;
    return newState;
}

export function allocateAttribute(state: GameState, attr: keyof Stats): GameState {
    const newState = { ...state };
    if (newState.player.stats.attributePoints <= 0) return state;
    newState.player.stats.attributePoints--;
    if (attr === 'strength') { newState.player.stats.strength++; newState.player.stats.atk += 2; }
    else if (attr === 'agility') { newState.player.stats.agility++; newState.player.stats.speed += 0.05; newState.player.stats.def += 1; }
    else if (attr === 'health') { newState.player.stats.health++; newState.player.stats.maxHp += 20; newState.player.stats.hp += 20; }
    return newState;
}

export function buyItem(state: GameState, item: Item): GameState {
    const newState = { ...state };
    if (newState.player.stats.gold >= (item.price || 0)) {
        newState.player.stats.gold -= (item.price || 0);
        newState.player.inventory.push({ ...item, id: generateId() });
        addChatMessage(newState, `Purchased ${item.name}!`, 'loot');
    } else addChatMessage(newState, `Not enough Gold!`, 'system');
    return newState;
}

const SLOT_MAP: Record<string, keyof Equipment> = {
    'weapon': 'weapon', 'armor': 'armor', 'helmet': 'helmet', 'shield': 'shield',
    'gloves': 'gloves', 'pants': 'pants', 'boots': 'boots', 'ring': 'ring1', 'backpack': 'backpack'
};

// Change parameter type to include classType since it's used to lookup base stats for the player
function updatePlayerStatsFromEquipment(player: Entity & { classType: ClassType }) {
    const base = CLASS_STATS[player.classType];
    const newStats = { ...player.stats };
    newStats.atk = base.atk + (base.strength * 2);
    newStats.def = base.def + (base.agility * 1);
    
    Object.values(player.equipment).forEach(item => {
        if (!item?.stats) return;
        if (item.stats.atk) newStats.atk += item.stats.atk;
        if (item.stats.def) newStats.def += item.stats.def;
        if (item.stats.speed) newStats.speed += item.stats.speed;
        if (item.stats.hp) newStats.maxHp += item.stats.hp;
        if (item.stats.mana) newStats.maxMana += item.stats.mana;
    });
    player.stats = newStats;
}

export function equipItem(state: GameState, item: Item): GameState {
    const newState = { ...state };
    const player = newState.player;
    const slot = SLOT_MAP[item.type];
    if (!slot) return state;

    // Potion usage
    if (item.type === 'potion') {
        if (item.stats?.hp) player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + item.stats.hp);
        if (item.stats?.mana) player.stats.mana = Math.min(player.stats.maxMana, player.stats.mana + item.stats.mana);
        player.inventory = player.inventory.filter(i => i.id !== item.id);
        addChatMessage(newState, `Used ${item.name}.`, 'system');
        return newState;
    }

    const currentEquipped = player.equipment[slot];
    if (currentEquipped) player.inventory.push(currentEquipped);
    
    player.equipment[slot] = item;
    player.inventory = player.inventory.filter(i => i.id !== item.id);
    updatePlayerStatsFromEquipment(player);
    addChatMessage(newState, `Equipped ${item.name}.`, 'system');
    return newState;
}

export function unequipItem(state: GameState, slot: keyof Equipment): GameState {
    const newState = { ...state };
    const player = newState.player;
    const item = player.equipment[slot];
    if (!item) return state;

    player.inventory.push(item);
    player.equipment[slot] = null;
    updatePlayerStatsFromEquipment(player);
    addChatMessage(newState, `Unequipped ${item.name}.`, 'system');
    return newState;
}
