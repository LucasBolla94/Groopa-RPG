
import { ClassType } from './types';

export const MAP_SIZE = 200;
export const TILE_SIZE = 32;
export const CITY_SAFE_RADIUS = 35; // Radius in tiles around center
export const VIEWPORT_PADDING = 5;
export const MAX_MONSTERS = 80;
export const SPAWN_RADIUS_MIN = 45; // Start spawning monsters outside the city
export const SPAWN_RADIUS_MAX = 90;
export const CHASE_RADIUS = 8;
export const ATTACK_COOLDOWN_PLAYER = 400;
export const ATTACK_COOLDOWN_MONSTER = 1200;
export const MANA_REGEN_INTERVAL = 3000;
export const HP_REGEN_INTERVAL = 5000;

export const CLASS_STATS = {
  [ClassType.WARRIOR]: { 
    hp: 160, mana: 30, atk: 22, def: 12, speed: 3.5,
    strength: 10, agility: 5, magic: 2, stamina: 8, health: 10 
  },
  [ClassType.MAGE]: { 
    hp: 100, mana: 150, atk: 18, def: 6, speed: 3.5,
    strength: 2, agility: 5, magic: 12, stamina: 4, health: 6 
  },
  [ClassType.ELF]: { 
    hp: 120, mana: 80, atk: 20, def: 8, speed: 3.8,
    strength: 6, agility: 10, magic: 6, stamina: 6, health: 8 
  },
};

export const MONSTER_DATA = {
  Rat: { hp: 20, atk: 5, def: 2, exp: 5, gold: [1, 5], range: 1 },
  Bat: { hp: 30, atk: 8, def: 1, exp: 8, gold: [2, 8], range: 1 },
  Goblin: { hp: 45, atk: 12, def: 4, exp: 12, gold: [5, 15], range: 1 },
  Wolf: { hp: 70, atk: 18, def: 6, exp: 18, gold: [0, 2], range: 1 },
  Skeleton: { hp: 110, atk: 25, def: 12, exp: 30, gold: [15, 40], range: 1 },
  Orc: { hp: 180, atk: 35, def: 20, exp: 60, gold: [30, 80], range: 1 },
  Demon: { hp: 300, atk: 50, def: 30, exp: 150, gold: [100, 250], range: 1 },
};

export const COLORS = {
  GRASS: '#38b000',
  DIRT: '#704c1c',
  STONE: '#4a4e69',
  WATER: '#0077b6',
  SAND: '#ffb703',
  FOREST: '#004b23',
};
