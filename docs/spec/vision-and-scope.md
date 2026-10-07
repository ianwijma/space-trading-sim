# Vision and scope

Status: confirmed requirements with a proposed first-release scope.

## Player experience

Build an asteroid economy, settle workers, move physical goods, protect trade,
and choose a route to victory. The map should be readable at a glance, with the
strategic accessibility of OpenFront and several scoring paths inspired by Catan.

Play unfolds continuously on the map. Players select colonies and fleets, give
contextual orders, and react to visible shipping and combat while the economy
continues. [Map interaction and gameplay](map-interaction-and-gameplay.md) defines
this moment-to-moment experience.

Infinite deposits make extraction rate, construction space, labour, local
services, transport, and security the scarce assets. A useful decision should
usually improve one of these at the expense of another.

## Confirmed requirements

- A browser game usable on mobile, built with Next.js, Tailwind CSS, and TypeScript.
- OpenFront-like real-time play: an interactive map, direct object selection and
  orders, continuously moving vessels, and visible economic and combat activity.
- A randomly generated asteroid world; each asteroid has exactly one natural
  resource, and deposits never deplete.
- Repeatable buildings with finite throughput and construction constrained by
  asteroid size, including mining rigs, harbours, trade hubs, and shipyards.
- Combat and piracy involving transport and trading ships.
- A points-based victory system, including additional military and piracy paths
  such as most warships destroyed and most trade ships captured.
- Housing limits the number of workers available on each asteroid.
- Every staffed building contributes its worker requirement to a shared demand.
  All such buildings use the same available/required worker ratio: 50% workforce
  coverage means 50% of normal work rate before other constraints.
- Worker allocation is automatic and proportional in the first release; manual
  per-building staffing is a possible future feature.
- Population builds gradually; housing adds capacity without instantly adding workers.
- Warships consume local workers by taking them aboard as crew. Launches can
  reduce local productivity, and asteroids can specialize in producing ships.
- Solo play against AI and multiplayer with a configurable mix of humans and AI.
- AI personalities including pirates, competitive players, and warlords.
- Understandable resource-flow reporting, which may be calculated at intervals.
- P2P multiplayer without an application game backend; the lobby owner initially
  owns state, another player takes over after owner disconnection.
- Reload recovery and automatic reconnection.
- Multiple proposed space-themed visual directions and sensible use of npm packages.
- Focused specification documents organized by subject.

## Proposed match baseline

| Setting | Initial proposal |
| --- | --- |
| Match duration target | 30–45 minutes |
| Commanders | 1–6 total; standard solo includes AI opponents |
| Map size | Approximately 80–120 asteroids, scaled to commander count |
| Victory | 15 points held for 60 seconds, with the foundation-point condition |
| Information | Open board in the first release |
| Interaction | Continuous map play; contextual commands; optional detail panels |
| Deposits | Four natural resource types |
| Population | Gradual local growth within housing capacity; shared workforce coverage; warships take workers aboard; proposed food and water support |
| Transport | Automated physical shipments and optional manual route settings |

Exact victory rules belong to [Scoring and victory](scoring-and-victory.md).

## First complete release

Include the economic loop, settlement support, civilian shipping, three military
roles, piracy, six default titles, bounded achievements, multiple AI personalities,
economic reporting, mobile controls, lobbies, persistence, and host recovery.

The prototype should introduce these in stages. A playable slice can have fewer
resources or bots while the first complete release still targets the requirements.
An early interaction study must establish the camera, selection, orders, and
continuous feedback before the art direction is treated as settled.

## Expansion candidates

Asteroid conquest and siege ships; formal treaties; salvage yards; advanced sensors;
cooperative scenarios; announced environmental events; research branches; and
additional scoring-title presets; and optional manual workforce management.
Conquest and full elimination need a separate
balance decision because early removal makes short social games less enjoyable.

## Design principles

- Automation handles routine movement; players choose priorities and destinations.
- The main play surface supports direct action. Inspecting a report or construction
  queue leaves the world running under the match's explicit pause policy.
- A shortage or stalled building should have an understandable explanation.
- Scoring paths should create interaction without forcing every faction into war.
- Housing determines the workforce an asteroid can support. Shared staffing keeps
  the resulting productivity change understandable across all its buildings.
- Fleet production competes with local industry for people. Growth takes time,
  giving prepared shipbuilding colonies a reason to exist.
- Recoverable setbacks should be common; irreversible early defeat should be rare.
- Mobile information hierarchy and input are first-class design constraints.

## Architectural boundaries

No authoritative game server or central game database is planned. The permitted
use of signaling, STUN, TURN, and credential services is unresolved in
[D-01](decisions-and-research.md). Host migration and reload recovery are required
experiences; their exact failure guarantees require the networking prototype.
