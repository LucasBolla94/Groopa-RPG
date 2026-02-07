
import { TileType, MapId } from '../types';
import { MAP_SIZE } from '../constants';
import { MAPS } from './maps';

export function generateMap(mapId: MapId = MapId.LORENS): number[][] {
  const map: number[][] = [];
  const config = MAPS[mapId];

  for (let y = 0; y < MAP_SIZE; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      // Borders
      if (x === 0 || y === 0 || x === MAP_SIZE - 1 || y === MAP_SIZE - 1) {
        map[y][x] = config.liquidTile;
        continue;
      }
      
      const dist = Math.sqrt(Math.pow(x - MAP_SIZE / 2, 2) + Math.pow(y - MAP_SIZE / 2, 2));

      if (mapId === MapId.LORENS) {
          generateLorensTile(map, x, y, dist);
      } else {
          // Caverns procedural
          const noise = Math.sin(x / 6) * Math.cos(y / 6) + (Math.random() * 0.3);
          if (noise > 0.7) map[y][x] = config.obstacleTile;
          else if (noise < -0.7) map[y][x] = config.liquidTile;
          else map[y][x] = config.baseTile;
      }
    }
  }

  return map;
}

function generateLorensTile(map: number[][], x: number, y: number, dist: number) {
    const cx = MAP_SIZE / 2;
    const cy = MAP_SIZE / 2;

    // 1. Lorens City Square (Center) - Larger plaza
    if (dist < 10) {
        map[y][x] = TileType.STONE;
        // Small decorative fountain at very center
        if (Math.abs(x - cx) < 1.2 && Math.abs(y - cy) < 1.2) {
            map[y][x] = TileType.WATER;
        }
        return;
    }

    // 2. Main Roads - Thicker roads for easier movement
    const isMainRoad = Math.abs(x - cx) < 4 || Math.abs(y - cy) < 4;
    if (dist < 34 && isMainRoad) {
        map[y][x] = TileType.STONE;
        return;
    }

    // 3. City Walls
    const wallDist = 36;
    if (Math.abs(dist - wallDist) < 1.2) {
        const isGate = (Math.abs(x - cx) < 5) || (Math.abs(y - cy) < 5);
        if (!isGate) {
            map[y][x] = TileType.WALL;
            return;
        } else {
            map[y][x] = TileType.STONE; // Gates are stone-paved
            return;
        }
    }

    // 4. Buildings (Shops/Houses) - Controlled placement
    if (dist < 34) {
        // Only place buildings in quadrants away from the cross-roads
        const inQuadrant = Math.abs(x - cx) > 6 && Math.abs(y - cy) > 6;
        if (inQuadrant) {
            const bx = Math.floor(x / 8);
            const by = Math.floor(y / 8);
            const lx = x % 8;
            const ly = y % 8;

            // Simple house pattern
            if (lx > 0 && lx < 6 && ly > 0 && ly < 6) {
                if (lx === 1 || lx === 5 || ly === 1 || ly === 5) {
                    // Wall
                    const isDoor = (lx === 3 && ly === 5) || (lx === 3 && ly === 1);
                    if (!isDoor) {
                        map[y][x] = TileType.WALL;
                    } else {
                        map[y][x] = TileType.FLOOR_WOOD;
                    }
                } else {
                    map[y][x] = TileType.FLOOR_WOOD;
                }
                return;
            }
        }
    }

    // 5. Wilderness - Improved procedural feel
    if (dist > 39) {
        const noise = Math.sin(x / 4) * Math.cos(y / 4) + (Math.random() * 0.4);
        if (noise > 0.8) map[y][x] = TileType.FOREST;
        else if (noise < -0.8) map[y][x] = TileType.WATER;
        else map[y][x] = TileType.GRASS;
    } else {
        map[y][x] = TileType.GRASS;
    }
}
