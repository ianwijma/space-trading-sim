# Decisions and research

Status: open questions and source notes for the initial specification, 2026-10-07.

## Decision register

These questions do not block drafting the game rules. Decisions that change
networking guarantees must be settled before claiming the first milestone complete.

| ID | Decision | Direction or rule | Status / impact |
| --- | --- | --- | --- |
| D-01 | What connection infrastructure is allowed under "no backend"? | Browser-only game state; shared signaling/STUN and optional managed TURN | Open; affects network reachability, credentials, and operational dependency |
| D-02 | What happens after an ambiguous two-peer disconnect? | Evaluate casual continuation for friend lobbies and a strict pause option | Open; automatic availability and strict single-history guarantees conflict |
| D-03 | When may a shared save resume after everybody leaves? | Resume under the agreed membership policy; provide explicit recovery states | Open; a lone returning peer must not silently fork a strict match |
| D-04 | Match length, target, title roster, and title cap | 30–45 minutes, 15 points, 9 foundation minimum, 6 title-point cap | Proposed; expanded scoring requires measured balance |
| D-05 | Art direction | Deep Space Operations | Proposed; Industrial Frontier and Orbital Atlas remain alternatives |
| D-06 | Exact prices, starter stocks, ship profiles, crew sizes, growth rates, and timing | Use versioned balance data; preserve a valid starting/recovery economy | Open tuning work; current production/population figures are illustrative |
| D-07 | Caretaker and pause rules | Limited caretaker after a short grace; solo pause and agreed multiplayer pauses | Proposed; spending scope and timeout need playtesting |
| D-08 | Enemy asteroid capture and elimination | Introduce after piracy and blockade play are balanced | Deferred expansion |
| D-09 | Population services and transport abstraction | Proposed food/water support and reserves, physical passenger transfers, service modifier, civilian rescue, no automatic starvation deaths | Proposed; preserve the confirmed workforce/growth/crew requirements in D-12 through D-14 |
| D-10 | Optional competitive-title roster | Six defaults, alternative themed presets, 6-point title cap | Proposed; inactive titles remain statistics until their mechanics exist |
| D-11 | Live-version retention and save migrations | Pin match rules and retain compatible application assets | Open release policy; essential to reliable reloads after a deployment |
| D-12 | Housing and worker distribution | Housed workers divided by total building demand gives one proportional productivity multiplier for every staffed building, including one-worker machines | Confirmed by user; manual allocation is a future feature, exact worker requirements are tuning values |
| D-13 | Gradual population growth | Housing raises capacity without spawning workers; automatic local growth replenishes residents over simulated time, inspired by OpenFront | Confirmed by user; the rational growth curve and support gate are proposals, replacing the earlier paid recruitment model |
| D-14 | Warship crew population | People board from the producing asteroid and leave its workforce; shipyard builders and embarked crew are separate | Confirmed by user; complements of 5/10/20, full-crew commissioning, casualties on destruction, and demobilization are proposals |

## Why the P2P distinctions matter

WebRTC peer discovery and network traversal are separate from simulation ownership.
Using a public signaling service avoids operating that service yourself but still
depends on external infrastructure. TURN may be needed for network pairs that
cannot connect directly. Trystero does not supply saved game state or consensus.

Majority-based ownership can preserve one agreed history while enough members
remain available. In a two-browser match, a timeout alone cannot distinguish a
crash from a partition. Giving both isolated browsers permission to continue can
produce incompatible purchases, captures, and victories; those branches cannot
be safely merged as if they were independent document edits.

When every browser is closed or suspended, no simulation remains running. Browser
storage can support reopening, but persistent-storage permission is not guaranteed
and cleared data needs another saved copy. These are architectural limits to
design around, not capabilities already solved by selecting a package.

## Research sources

| Subject | Primary documentation or identified reference |
| --- | --- |
| Reference game's structure | [OpenFront repository](https://github.com/openfrontio/OpenFrontIO) |
| Reference population capacity and growth | [OpenFront Config at the inspected commit](https://github.com/openfrontio/OpenFrontIO/blob/9453de8567c8465eed4969f316ddcd131d392d6f/packages/engine-lib/src/configuration/Config.ts#L326) and [per-tick update](https://github.com/openfrontio/OpenFrontIO/blob/9453de8567c8465eed4969f316ddcd131d392d6f/packages/engine/src/execution/PlayerExecution.ts#L95) |
| Reference piracy behaviour | [OpenFront community warship guide](https://openfront.wiki/Warship/) and [trade-ship guide](https://openfront.wiki/Trade_Ship/) |
| Transferable victory awards | [CATAN official base-game FAQ](https://www.catan.com/faq/basegame) |
| Static frontend deployment | [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports) |
| Peer discovery and transport | [Trystero strategies](https://trystero.dev/docs/signaling-strategies/) and [connection constraints](https://trystero.dev/docs/connections/) |
| Network traversal | [MDN WebRTC connectivity](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity) |
| TURN credential handling | [Cloudflare credential generation](https://developers.cloudflare.com/realtime/turn/generate-credentials/) |
| Majority and replicated history | [Raft explanation and paper](https://raft.github.io/) |
| Background suspension | [Chrome page lifecycle guidance](https://developer.chrome.com/docs/web-platform/page-lifecycle-api) |
| Local persistence | [Dexie React guide](https://dexie.org/docs/Tutorial/React) and [StorageManager guidance](https://dexie.org/docs/StorageManager) |
| Renderer and touch camera | [Pixi renderer documentation](https://pixijs.com/8.x/guides/components/renderers) and [pixi-viewport](https://github.com/pixijs-userland/pixi-viewport) |
| Deterministic randomness | [pure-rand](https://github.com/dubzzz/pure-rand) |
| Worker integration | [Comlink](https://github.com/GoogleChromeLabs/comlink) |
| Graph routing | [ngraph.path](https://github.com/anvaka/ngraph.path) |
| Economic charts | [ECharts modular imports](https://echarts.apache.org/handbook/en/basics/import/) |
| Stateful invariant checks | [fast-check model-based testing](https://fast-check.dev/docs/advanced/model-based-testing/) |

The external sources support technical feasibility and reference mechanics.
Asteroid rules, population rates, scoring thresholds, and title names in these
specifications are original design proposals, not claims about those reference games.

## Population research and design consequence

The official OpenFront source inspected on 2026-10-07 uses a population-dependent
increase multiplied by remaining capacity, applies it on simulation ticks, and
clamps at the cap. Territory and completed cities contribute to its cap.
[Population growth](population-growth.md) records the inspected formula and our
proposed local adaptation, with no bot growth bonuses in the standard preset.

Housing now enables gradual automatic growth. The previous draft's paid local
recruitment queues are superseded. [Shipbuilding and crews](shipbuilding-and-crews.md)
records local people boarding warships, replacement through growth or passengers,
and the proposed crew lifecycle. The warship crew mechanic is a user requirement;
it is not presented as a researched OpenFront warship rule.

## Skills and implementation guidance

PixiJS publishes relevant skills for [rendering concepts](https://github.com/pixijs/pixijs/blob/dev/skills/pixijs-core-concepts/SKILL.md)
and [performance](https://github.com/pixijs/pixijs/blob/dev/skills/pixijs-performance/SKILL.md).
They are useful implementation references for the map, lifecycle, and mobile
profiling. Recheck guidance against the installed release; the linked branch can change.

The available React best-practices skill is relevant when UI components are built.
Game AI is ordinary local decision logic and does not require an LLM agent framework.

When implementation establishes concrete patterns, add concise project guidance
for deterministic simulation, cargo/population accounting, protocol recovery,
and mobile interaction. This is a future documentation task; no new skill or plugin
installation is implied by this research list.
