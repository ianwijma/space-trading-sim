# Specification index

Status: initial design draft. Updated: 2026-10-07.

Each document owns one subject. Read the relevant document directly; the complete
set is not a prerequisite for understanding one feature.

## Find a subject

| Question | Document |
| --- | --- |
| What game are we building, and what is required? | [Vision and scope](vision-and-scope.md) |
| How does live play, map selection, targeting, and direct control work? | [Map interaction and gameplay](map-interaction-and-gameplay.md) |
| How are asteroids, resources, and starting positions generated? | [World and resources](world-and-resources.md) |
| What can players build, and what limits output? | [Buildings and production](buildings-and-production.md) |
| How do housing, workers, food, and water work? | [Housing and workers](housing-and-workers.md) |
| How does population build up over time after adding housing? | [Population growth](population-growth.md) |
| How do warships take workers aboard, and how do shipbuilding colonies work? | [Shipbuilding and crews](shipbuilding-and-crews.md) |
| How do cargo, trade routes, and markets work? | [Logistics and trade](logistics-and-trade.md) |
| How do battles, blockades, and captures work? | [Combat and piracy](combat-and-piracy.md) |
| What earns points, and how does a match end? | [Scoring and victory](scoring-and-victory.md) |
| What can players learn from the economic reports? | [Economy insights](economy-insights.md) |
| How do AI opponents behave? | [AI players](ai-players.md) |
| How do lobbies, networking, and authority work? | [Multiplayer and lobbies](multiplayer-and-lobbies.md) |
| What happens after reloads, disconnects, or closing every browser? | [Persistence and recovery](persistence-and-recovery.md) |
| How should the code be organized, and which packages should we use? | [Architecture and packages](architecture-and-packages.md) |
| What does the game look like on mobile and desktop? | [Interface and art direction](interface-and-art-direction.md) |
| Where can I compare the current visual mockups? | [Visual design studies](../design/README.md) |
| What gets built first, and how do we establish correctness? | [Delivery and validation](delivery-and-validation.md) |
| Which decisions remain open, and what research supports the design? | [Decisions and research](decisions-and-research.md) |

## Status vocabulary

- **Requirement:** requested by the user; implementation must satisfy it or surface
  a concrete conflict.
- **Proposal:** a recommended rule or implementation choice, open to revision.
- **Open decision:** a meaningful unresolved choice, tracked with a `D-xx` identifier.
- **Expansion:** outside the proposed first complete release.

Within a proposed system, words such as "must" describe its internal invariants;
they do not imply the user has approved every proposed mechanic.

## Reading conventions

All rates use simulated match time. Pauses do not advance production, support
windows, victory countdowns, or AI plans. Per-minute values describe rates, not
one-minute batches. Numerical values are balancing hypotheses.

The domain document owns each rule. Other documents link to it rather than
defining a different version. Shared code and data tables should eventually be
the source for exact costs and tuning values; documentation explains behaviour.

## Small glossary

| Term | Meaning |
| --- | --- |
| Commander | A human-controlled or AI-controlled faction |
| Peer | One connected human browser; AI commanders are not independent peers |
| Owner | The peer currently responsible for authoritative simulation |
| Resident | One tracked person at an asteroid; each provides one potential worker |
| Available worker | A housed local resident who contributes to the asteroid's workforce |
| Embarked crew | People living aboard a commissioned warship, excluded from asteroid workers and housing |
| Commissioning | Moving a full local crew aboard a completed hull to activate the warship |
| Growth progress | Saved fractional progress toward the next new resident, advanced by simulated time |
| Workforce coverage | Housed workers divided by total eligible building demand, capped at 100% |
| Effective worker share | A building's full worker requirement multiplied by the common coverage ratio |
| Cargo lot | Identified goods whose ownership, location, and provenance can be tracked |
| Committed update | An authoritative update that meets the selected persistence and replication policy |
| Foundation points | Development, achievement, and objective points excluding title bonuses |
| Title | A transferable scoring award based on a comparative statistic |

The use of external connection services and the consistency policy for small
lobbies remain open. See [D-01 through D-03](decisions-and-research.md).
