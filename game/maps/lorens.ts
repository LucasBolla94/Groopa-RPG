
import { TileType, InteractiveObject, House } from '../../types';
import { MAP_SIZE } from '../../constants';

export function generateLorensMap() {
    const map: number[][] = [];
    const interactiveObjects: InteractiveObject[] = [];
    const houses: House[] = [];
    
    const cx = MAP_SIZE / 2;
    const cy = MAP_SIZE / 2;

    // Inicializa com Grama (Selva)
    for (let y = 0; y < MAP_SIZE; y++) {
        map[y] = [];
        for (let x = 0; x < MAP_SIZE; x++) {
            map[y][x] = TileType.GRASS;
        }
    }

    // 1. PRAÇA CENTRAL E ESTRADAS
    // Pedra ao redor da praça
    for (let y = cy - 45; y < cy + 45; y++) {
        for (let x = cx - 45; x < cx + 45; x++) {
            const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
            if (dist < 40) map[y][x] = TileType.STONE;
            if (dist < 15) map[y][x] = TileType.STONE; // Plaza central core
        }
    }
    
    // Fonte no Centro
    interactiveObjects.push({ id: 'fountain_center', type: 'fountain' as any, x: cx, y: cy });

    // 2. MURALHAS DA CIDADE (Círculo defensivo)
    const wallRadius = 42;
    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
            if (Math.abs(dist - wallRadius) < 1.5) {
                // Deixa portões nas 4 direções cardeais
                const isGate = (Math.abs(x - cx) < 4 && Math.abs(y - cy) > 35) || 
                               (Math.abs(y - cy) < 4 && Math.abs(x - cx) > 35);
                if (!isGate) map[y][x] = TileType.WALL;
            }
        }
    }

    // 3. MERCADO (Market stalls ao norte da fonte)
    const marketStalls = [
        { x: cx - 6, y: cy - 10 }, { x: cx, y: cy - 10 }, { x: cx + 6, y: cy - 10 },
        { x: cx - 6, y: cy - 14 }, { x: cx, y: cy - 14 }, { x: cx + 6, y: cy - 14 },
    ];
    marketStalls.forEach((s, i) => {
        interactiveObjects.push({ id: `stall_${i}`, type: 'stall' as any, x: s.x, y: s.y });
    });

    // 4. AS 12 CASAS (Zonas: Leste, Oeste, Sul)
    const houseConfigs = [
        // Zona Oeste (4 casas)
        { x: cx - 35, y: cy - 15, id: 'h_w1' }, { x: cx - 35, y: cy - 5, id: 'h_w2' },
        { x: cx - 35, y: cy + 5, id: 'h_w3' }, { x: cx - 35, y: cy + 15, id: 'h_w4' },
        // Zona Leste (4 casas)
        { x: cx + 25, y: cy - 15, id: 'h_e1' }, { x: cx + 25, y: cy - 5, id: 'h_e2' },
        { x: cx + 25, y: cy + 5, id: 'h_e3' }, { x: cx + 25, y: cy + 15, id: 'h_e4' },
        // Zona Sul (4 casas)
        { x: cx - 15, y: cy + 25, id: 'h_s1' }, { x: cx - 5, y: cy + 25, id: 'h_s2' },
        { x: cx + 5, y: cy + 25, id: 'h_s3' }, { x: cx + 15, y: cy + 25, id: 'h_s4' },
    ];

    houseConfigs.forEach(cfg => {
        const w = 8, h = 6;
        const { x, y, id } = cfg;
        houses.push({ id, ownerId: null, price: 15000, doorPos: { x: x + 4, y: y + h - 1 } });

        for (let iy = y; iy < y + h; iy++) {
            for (let ix = x; ix < x + w; ix++) {
                if (iy === y || iy === y + h - 1 || ix === x || ix === x + w - 1) {
                    if (ix === x + 4 && iy === y + h - 1) {
                        map[iy][ix] = TileType.FLOOR_WOOD;
                        interactiveObjects.push({ id: `door_${id}`, type: 'door', x: ix, y: iy, isOpen: false, houseId: id });
                    } else {
                        map[iy][ix] = TileType.WALL;
                    }
                } else {
                    map[iy][ix] = TileType.FLOOR_WOOD;
                }
            }
        }
        // Decoração interna padrão
        interactiveObjects.push({ id: `bed_${id}`, type: 'bed', x: x + 1, y: y + 1 });
        interactiveObjects.push({ id: `chest_${id}`, type: 'chest', x: x + w - 2, y: y + 1 });
    });

    // 5. WILDERNESS (Lagos e Arvores externas)
    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
            if (dist > wallRadius + 5) {
                // Ruído procedural para lagos e florestas
                const lakeNoise = Math.sin(x/6) * Math.cos(y/6);
                const forestNoise = Math.sin(x/4) * Math.cos(y/4);
                if (lakeNoise > 0.75) map[y][x] = TileType.WATER;
                else if (forestNoise > 0.6) map[y][x] = TileType.FOREST;
            }
        }
    }

    return { map, interactiveObjects, houses };
}
