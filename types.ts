
export enum ClassType {
  WARRIOR = 'Warrior',
  MAGE = 'Mage',
  ELF = 'Elf'
}

export enum TileType {
  GRASS = 0,
  DIRT = 1,
  STONE = 2,
  WATER = 3,
  SAND = 4,
  FOREST = 5,
  WALL = 6,
  LAVA = 7,
  FLOOR_DARK = 8,
  FLOOR_WOOD = 9,
  ROOF = 10,
  FLOOR_BRICK = 11,
  DOOR_CLOSED = 12,
  DOOR_OPEN = 13,
  BED = 14,
  CHEST = 15
}

export enum MapId {
  LORENS = 'Lorens',
  CAVERNS = 'Caverns'
}

export type ItemType = 'helmet' | 'armor' | 'gloves' | 'pants' | 'boots' | 'weapon' | 'shield' | 'ring' | 'wings' | 'backpack' | 'potion' | 'misc';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  price?: number;
  description?: string;
  stats?: {
    atk?: number;
    def?: number;
    hp?: number;
    mana?: number;
    speed?: number;
  };
}

export interface InteractiveObject {
  id: string;
  x: number;
  y: number;
  type: 'door' | 'chest' | 'bed' | 'fountain' | 'stall';
  isOpen?: boolean;
  houseId?: string;
}

export interface House {
  id: string;
  ownerId: string | null;
  price: number;
  doorPos: { x: number, y: number };
}

export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'merchant_weapon' | 'merchant_armor' | 'merchant_potions' | 'guide';
  shopItems?: Item[];
}

export interface Equipment {
  helmet: Item | null;
  armor: Item | null;
  gloves: Item | null;
  pants: Item | null;
  boots: Item | null;
  weapon: Item | null;
  shield: Item | null;
  ring1: Item | null;
  ring2: Item | null;
  wings: Item | null;
  backpack: Item | null;
}

export interface Stats {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  atk: number;
  def: number;
  speed: number;
  exp: number;
  level: number;
  gold: number;
  attributePoints: number;
  strength: number;
  agility: number;
  magic: number;
  stamina: number;
  health: number;
}

export interface Entity {
  id: string;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  width: number;
  height: number;
  stats: Stats;
  inventory: Item[];
  equipment: Equipment;
  direction: 'up' | 'down' | 'left' | 'right';
  lastAttack: number;
  attackAnimTimer?: number;
  isHit?: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  ownerId: string;
  color: string;
  life: number;
  type?: 'magic' | 'arrow';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  life: number;
}

export interface Monster extends Entity {
  type: 'Rat' | 'Goblin' | 'Skeleton' | 'Wolf' | 'Orc' | 'Demon' | 'Bat';
  state: 'WANDER' | 'CHASE' | 'ATTACK';
  spawnPoint: { x: number, y: number };
}

export interface ChatMessage {
  id: string;
  text: string;
  type: 'system' | 'combat' | 'loot' | 'level';
  timestamp: number;
}

export interface GameState {
  player: Entity & { classType: ClassType };
  monsters: Monster[];
  npcs: NPC[];
  interactiveObjects: InteractiveObject[];
  houses: House[];
  projectiles: Projectile[];
  floatingTexts: FloatingText[];
  messages: ChatMessage[];
  cameraX: number;
  cameraY: number;
  map: number[][];
  currentMapId: MapId;
  levelUpMsg: boolean;
  activeShopNPCId: string | null;
}
