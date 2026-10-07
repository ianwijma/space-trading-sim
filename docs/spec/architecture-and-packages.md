# Architecture and packages

Status: Next.js, Tailwind CSS, and TypeScript are requirements. Module boundaries
and package selections are researched candidates, not installed dependencies.

## Application shape

Build a static Next.js application with a client-side game runtime. Use a static
lobby/match entry page with a client-read identifier. Avoid depending on runtime
server actions, request-bound route handlers, or a central match database.

The browser main thread owns input, networking integration, DOM interfaces, and
rendering. A worker owns simulation and AI work. Keep the simulation callable
without a browser so the same rules support replay and automated AI matches.

## Proposed code boundaries

| Area | Owns |
| --- | --- |
| `src/game/model` | Entity types, IDs, state schema, reference balance data |
| `src/game/simulation` | Deterministic steps, production, population growth, crew transfers, support, combat, scoring |
| `src/game/world` | Seeded generation and starting-position validation |
| `src/game/ai` | Utility policies, goals, planner persistence |
| `src/game/protocol` | Commands, schemas, ordered updates, authority metadata |
| `src/game/network` | Transport adapter, lobby discovery, peer connections |
| `src/game/persistence` | IndexedDB, journal, checkpoints, migrations, replay |
| `src/game/analytics` | Economic ledgers, aggregate windows, report selectors |
| `src/game/rendering` | Map, ships, effects, camera, local interpolation |
| `src/features` | Lobby, settlement inspector, route editor, reports, scorecard |

These are proposed directories for implementation; the repository currently contains
specifications. One repository is sufficient initially.

## Clock and determinism

Propose a 100 ms simulation tick, one-second economic intervals, and 10-second
report aggregation. Combat and arrivals precede the economic step on a boundary;
scoring observes the completed economic state. Rendering follows its own clock.

Use integer/fixed-point state, stable iteration, explicit tie-breaking, and a
versioned seeded random generator. Simulation rules never depend on frame rate,
local wall-clock time, ambient randomness, or unordered asynchronous completion.

Persist random state and allocation cursors. Log accepted AI decisions and planner
changes; replicas do not independently invent additional AI orders. Make the
command/event boundary explicit enough that snapshot plus journal fully reconstructs
economy, combat attribution, population, scoring, and support history.

Compute the asteroid-wide staffing ratio once per economic interval, after
population and building-state changes. All eligible staffed buildings read that
same value. Labour has no per-building priority or allocation cursor; any cursors
above allocate materials or power. Preserve rational/fixed-point worker shares
and production remainders instead of rounding partial staffing into whole people.

Population growth uses simulated economic intervals and a saved fractional
accumulator. A capacity change cannot itself produce people. Hull work completes
at interval end; commissioning can move local residents into an identified crew
manifest at the following boundary, before the shared staffing calculation.
See the authoritative [economic ordering](buildings-and-production.md).

Model residents, passenger/rescue manifests, and embarked crew as mutually
exclusive population locations. Atomic events cover growth completion, boarding,
casualties, and demobilization. Validate housing and available people against the
current ordered state; retrying a command must not deduct or add them again.
The growth curve and crew complements belong to the pinned match rules version.

Generate authoritative paths and map data consistently; rendering may draw smooth
curves without changing physical travel time. Verify pathfinder tie behaviour before
assuming a library's output is deterministic across identical inputs.

## Package shortlist

| Package | Purpose | Adoption note |
| --- | --- | --- |
| `pixi.js` | 2D map and fleet rendering | Profile actual devices and recover GPU context loss |
| `pixi-viewport` | Camera, panning, pinch zoom | Align its major version with Pixi |
| `@pixi/react` | Optional React scene integration | Keep high-frequency motion outside React state updates |
| `trystero` | WebRTC rooms and transport | Does not supply durable storage or host consensus |
| `dexie` | IndexedDB transactions and schema management | No cloud product is needed for local storage |
| `pure-rand` | Seeded random generation | Pin algorithm/version and serialize generator state |
| `comlink` | Worker communication | Batch useful state projections; avoid per-entity calls |
| `zod` | Validate messages, commands, saves, and imports | Enforce sizes as well as shapes |
| `zustand` | UI preferences and selected-state projections | Authoritative simulation remains in the game layer |
| `echarts` | Economic charts and optional flow diagrams | Lazy-load reporting views and selected chart modules |
| `ngraph.path` | Route finding over navigation graphs | Verify stable ordering and deterministic cost inputs |
| `vitest` | Simulation and protocol checks | Exercise domain invariants |
| `fast-check` | Generated operation sequences | Target conservation, replay, and duplication failures |
| `@playwright/test` | Multi-browser UI and recovery scenarios | Supplement with real mobile/network trials |

Registry metadata checked on 2026-10-07 showed Pixi 8, pixi-viewport 6, and
@pixi/react 8 as compatible candidate majors; @pixi/react requires React 19 or
newer. Trystero's current candidate was 0.26.0. Pin exact versions and verify the
combined application during the feasibility phase rather than treating discovery
as proof of integration.

## Custom implementation boundaries

Use packages for rendering, storage, validation, transport, charts, randomness,
and route search. Implement the game's rules, AI priorities, resource accounting,
scoring qualification, and authority protocol explicitly. Select a consensus
implementation only after verifying browser suitability and the chosen D-02 policy.

No package choice removes the need to define committed updates, membership changes,
player identity, or old-owner rejection. Transport reconnection alone is not match recovery.

## Performance and data size

Use state projections for visible panels, bounded history, batched worker messages,
bounded network queues, and chunked checkpoints. Profile before adopting an entity
framework or a custom binary format. A small initial JSON protocol is acceptable
if measured throughput fits the target devices.

An installable offline shell can follow using a service-worker package selected
for the actual Next.js build setup. Offline solo play and cached assets do not imply
background execution or peer discovery while disconnected.

References: [Next static exports](https://nextjs.org/docs/app/guides/static-exports),
[Pixi React integration](https://github.com/pixijs/pixi-react),
[viewport](https://github.com/pixijs-userland/pixi-viewport),
[pure-rand](https://github.com/dubzzz/pure-rand),
[Comlink](https://github.com/GoogleChromeLabs/comlink).
