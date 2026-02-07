
import { MapId, TileType } from '../types';

export interface MapDefinition {
  id: MapId;
  name: string;
  baseTile: TileType;
  secondaryTile: TileType;
  obstacleTile: TileType;
  liquidTile: TileType;
  monsterTable: string[];
  difficulty: number;
}

export const MAPS: Record<MapId, MapDefinition> = {
  [MapId.LORENS]: {
    id: MapId.LORENS,
    name: "Lorens Kingdom",
    baseTile: TileType.GRASS,
    secondaryTile: TileType.STONE,
    obstacleTile: TileType.FOREST,
    liquidTile: TileType.WATER,
    monsterTable: ['Rat', 'Goblin', 'Wolf'],
    difficulty: 1
  },
  [MapId.CAVERNS]: {
    id: MapId.CAVERNS,
    name: "Obsidian Caverns",
    baseTile: TileType.FLOOR_DARK,
    secondaryTile: TileType.STONE,
    obstacleTile: TileType.WALL,
    liquidTile: TileType.LAVA,
    monsterTable: ['Skeleton', 'Orc', 'Demon', 'Bat'],
    difficulty: 2.5
  }
};
