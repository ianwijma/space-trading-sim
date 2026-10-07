# Delivery and validation

Status: proposed implementation sequence and acceptance criteria.

## Milestone 0: networking and recovery feasibility

Create a minimal stateful browser prototype before building the full game. Exercise
discovery, connection, identity, persistence, a small ordered command stream, and
owner handover. Settle D-01, D-02, and the all-peers-offline resume policy in D-03.

Exit evidence should include:

- Phones and desktops connected across different networks, including mobile data.
- Direct and relay-assisted connections where the approved infrastructure permits.
- Reload of an ordinary peer and of the owner while commands are pending.
- Clean departure, abrupt process loss, hidden tabs, and suspended mobile pages.
- A three-peer majority/minority split and a two-peer ambiguous disconnect.
- Simultaneous reloads and reopening after every browser closes.
- A stale former owner returning without overwriting the accepted game.

Two tabs on one computer are a useful development case, not sufficient evidence
of internet connectivity or mobile recovery.

## Milestone 1: deterministic economy and settlements

Implement the world, inventories, slots, production, housing, uniform workforce
coverage, household support, gradual population growth, and local saves. Use the
intended command and journal boundaries from the start.

Exit evidence: a colony can mine, house and supply residents, produce food and
water, recover from a shortage, and reproduce the same state after save/replay.
The economic and population ledgers reconcile exactly.
Adding housing changes capacity without instantly creating workers. Growth slows
toward the cap, respects support limits, and preserves fractional progress on reload.

## Milestone 2: shipping and insights

Add civilian vessels, route policies, passenger transfers, markets, contracts,
throughput constraints, and interval reports.

Exit evidence: an operating multi-asteroid supply chain exposes its bottlenecks,
protects household reserves, and accounts for every good and resident while in
transit, rerouting, arriving, or being cancelled.

## Milestone 3: complete solo matches

Add ship construction and crew commissioning, fleet roles, combat, piracy, several
AI personalities, default titles,
achievements, victory, and post-match reports.

Exit evidence: several strategies can complete a match; military destruction and
trade capture produce correctly attributed statistics; household and population
play can contribute to victory; reloading does not award points again.
A shipbuilding colony can launch warships, lose local productivity as crews embark,
and recover through growth or transfers. Waiting hulls, crew casualties, and
demobilization conserve people under the defined lifecycle rules.

## Milestone 4: full multiplayer integration

Integrate the actual simulation with configurable lobbies, invitations, human/AI
slots, reconnect identity, replicated saves, and owner transfer.

Exit evidence: scenario traces preserve inventories, people, AI plans, scoring
histories, and victory countdowns through the supported fault cases. Unsupported
network conditions produce the defined pause/recovery behaviour.

## Milestone 5: mobile and balance

Refine touch controls, accessible reports, visual presentation, and performance.
Run headless AI matches across seeds and settings, then observe human playtests.

Measure match duration, scoring-path distribution, first-player/start-position
advantage, starvation time, downtime from labour shortages, fleet losses, and
title concentration. Measure time to replace crew, time waiting to commission a
hull, and the output of specialized shipbuilding colonies. Change growth constants,
crew complements, point thresholds, or target duration from evidence.

## Important domain checks

| Scenario | Expected result |
| --- | --- |
| Three rigs exceed available freighter capacity | Delivered throughput reflects the transport bottleneck |
| Several routes share one harbour | Combined handling stays within the shared budget |
| Food stock is low while a sale route is active | Default reserves protect household supply |
| New habitat completes | Housing increases; existing displaced people can rehouse, but no new residents appear instantly |
| A supported settlement has free housing | Fractional progress gradually completes whole residents under the growth curve |
| A settlement reaches or exceeds its housing cap | Growth stops and cannot bank population for later housing or launches |
| Population is zero but usable housing, power, and reserves remain | The proposed base growth term permits gradual recovery without building workers |
| Growth support is missing | Show a slowdown or pause; no minimum workforce/service floor creates residents |
| 5 housed workers face total demand of 10 | All eligible staffed buildings operate at 50% of staffing capacity |
| A one-worker building receives a 0.5 effective share | It performs half its normal work; rounding cannot starve or fully staff it |
| A rig, harbour, and warehouse require 5, 4, and 1 workers | With 5 workers their shares are 2.5, 2, and 0.5; coverage is 50% for all |
| An enabled factory lacks inputs | It still contributes worker demand; other buildings get no preferential allocation |
| Another staffed building completes | Recalculate total demand and update every building's common multiplier |
| Housing falls below the local population | Excess people become displaced and contribute no labour |
| Usable housing falls to zero | All staffed work stops; automated structures follow their own limits |
| Workers exceed total required labour | Staffing is capped at 100%; extra housed workers remain spare |
| No building requires workers | Avoid division by zero and let automated structures operate normally |
| A harbour operates at 50% staffing | Handling rate halves; berth count and warehouse storage do not shrink |
| Workers depart for another asteroid | Source coverage updates; people exist in one passenger manifest |
| A colony mission is manufactured and deployed | Settlers come from a source population; the kit never generates people |
| Destination housing is disabled during travel | Reroute or retain displaced non-working people without duplication or deletion |
| An interceptor commissions from 20 residents with 20 building demand | Its 5 crew move aboard once; all staffed buildings use 75% coverage |
| A hull completes without enough crew | It waits in the bay; no partial crew, ghost workers, or fleet-strength points |
| Two completed hulls compete for the last local crew | Stable commissioning order and atomic deductions prevent double boarding |
| A warship docks or receives repairs | Its people stay aboard and cannot work at the asteroid |
| A warship demobilizes with sufficient destination housing | Remove the ship and return its crew once; no kill credit or material refund |
| Destination beds disappear before demobilization | People remain aboard and the order waits or is cancelled |
| A warship is destroyed | Record crew casualties once; do not also subtract people from its source asteroid |
| A crew-bearing ship contributes to the fleet title | Its people are excluded from supported civilian population |
| Household support fails | Defined productivity penalty and scoring effects apply |
| A military hull is destroyed with several attackers | One killer receives credit; assists remain separate |
| The same trade hull is captured repeatedly | Only its first qualifying secured capture affects the competitive count |
| Captured ship is recovered before reaching a pirate port | No secured-capture reward was prematurely granted |
| Cargo is split, merged, and circulated | Provenance and scoring eligibility cannot reset |
| A player loses a title during the victory countdown | Recompute score and reset countdown if no longer eligible |
| An update is replayed after owner migration | Resources, growth, commissioning, crew losses, statistics, and points apply once |
| A browser reloads during growth or while a hull waits for crew | Preserve fractional progress, local people, crew manifests, and project state |
| Every browser closes and later reconnects | No offline wall-clock population growth is invented |

## Verification approach

Use focused simulation checks for rules and property-based operation sequences
for conservation, bounds, idempotency, and replay. Use multi-browser scenarios for
protocol and UI behaviour. Fault injection should cover reordered/duplicated
application messages, delayed acknowledgements, missing snapshots, and storage failure.

Headless AI matches measure balance; they cannot establish whether controls feel
good or whether human diplomacy creates an exploit. Test real touch devices and
real networks for those concerns.

These are planned acceptance criteria. No application implementation or runtime
verification results are asserted by this specification draft.

## Later expansions

After the complete loop is understood, prioritize convoy scheduling, treaties,
research specializations, salvage, contested discoveries, cooperative scenarios,
announced hazards, optional asteroid conquest, and optional manual workforce
allocation. Add supporting metrics and
failure cases before enabling their scoring titles.
