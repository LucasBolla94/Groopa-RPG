# Groopa-RPG — resumo do projeto

## Visao geral
Projeto de jogo 2D em pixel-art renderizado via `canvas` dentro de um app Next.js. A tela principal e UI sao React, enquanto o mundo do jogo eh desenhado manualmente com sprites gerados em `game/sprites.ts`. O fluxo principal eh: `app/page.tsx` -> `App.tsx` (orquestra estado, loop de jogo e render) e varios componentes de interface (menus, HUD, chat).

## Stack e execucao
- Framework: Next.js (App Router) em `app/`.
- UI: React + TailwindCSS v4.
- Render do jogo: `canvas` 2D com sprites gerados em tempo real.
- Scripts: `npm run dev | build | start | lint`.

## Estrutura de pastas
- `app/`
  - `page.tsx`: entry point do app, renderiza `<App />`.
  - `layout.tsx`: metadata e viewport.
  - `globals.css`: estilos globais e config do canvas.
- `components/`
  - `TitleScreen.tsx`: tela inicial com login/cadastro (UI).
  - `CreationScreen.tsx`: criacao de personagem + preview animado.
  - `HUD.tsx`: barras de HP/Mana/Exp.
  - `CharMenu.tsx`: atributos, pontos e stats.
  - `InventoryMenu.tsx`: equipamentos e inventario.
  - `ShopMenu.tsx`: compra de itens com NPC.
  - `Chat.tsx`: chat com timestamps e input.
  - `EscMenu.tsx`: menu de pausa e audio.
- `game/`
  - `engine.ts`: core do jogo (estado, update loop, combate, interacoes, spawn, loot/exp).
  - `sprites.ts`: geracao de sprites (tiles, entidades, itens, cursor).
  - `mapGenerator.ts`: gerador procedural generico (Caverns) e logica de Lorens.
  - `maps.ts`: definicoes de mapas e tabelas de monstros.
  - `maps/lorens.ts`: layout de Lorens (praça, muralhas, casas, objetos interativos).
- `types.ts`: tipos base (stats, itens, entidades, mapas, mensagens).
- `constants.ts`: parametros de gameplay (tile size, stats, spawn, cooldowns etc).
- `public/`: assets estaticos do Next (icones).

## Fluxo do jogo
- `App.tsx` controla o estado de tela (`title`, `creation`, `game`), cria o estado inicial com `createInitialState` e roda o loop principal (`update` + `render`) via `requestAnimationFrame`.
- Inputs: teclado (WASD/Arrows), mouse e atalhos.
- A cada frame, o estado eh atualizado e o canvas eh redesenhado.

## Mecanicas principais
- Movimento com colisao por tiles e objetos interativos.
- Combate: melee (Warrior) ou projeteis (Mage/Elf) com cooldown.
- Spawn de monstros em volta da cidade e chase radius.
- Interacoes: portas, camas (cura), fonte, NPCs vendedores.
- Economia e equipamento: compra, equipar/desequipar, stats afetados.
- Evolucao: exp, level up, pontos de atributo.
- Chat local do jogador com sistema de mensagens.

## Mapas e mundo
- Lorens: cidade central com praça, muralha, mercado e casas compraveis.
- `mapGenerator.ts` define uma base para mapas procedurais (ex.: caverns).

## Controles
- `WASD` / setas: movimentar.
- `SPACE` ou clique: atacar.
- `E`: interagir.
- `C`: abrir ficha do personagem.
- `V`: inventario.
- `ENTER`: abrir/fechar chat.
- `ESC`: menu de pausa.

## Observacoes
- Sprites sao desenhados via canvas offscreen e cacheados.
- O audio usa WebAudio (osciladores simples) e pode ser habilitado/desabilitado.
- UI eh estilizada com Tailwind e possui foco em tema dark/fantasy.

## Arquivos-chave para leitura rapida
- `App.tsx`: loop principal, input, render e wiring da UI.
- `game/engine.ts`: gameplay e estado.
- `game/sprites.ts`: visuais do mundo/entidades.
- `game/maps/lorens.ts`: construcao do mapa principal.
- `components/*`: UI do jogo.
