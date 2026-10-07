# Scoring and victory

Status: points, military destruction, and trade capture paths are requirements;
the catalogue, thresholds, caps, and victory procedure below are proposals.

## Score structure

Use three kinds of progress:

1. **Development points:** conditional points for operational colonies.
2. **Achievements and objectives:** permanent points for completed milestones,
   research, projects, and contracts.
3. **Titles:** transferable bonuses for leading an enabled comparative statistic.

Development plus achievements form a player's **foundation points**. Titles add
at most 6 points, even if the player holds more titles. Show owned but non-scoring
titles explicitly; title ownership still follows the metric.

```text
score = foundation points + min(6, sum of held title bonuses)
victory eligibility = score >= 15 AND foundation points >= 9
```

The foundation minimum prevents victory through title collection alone. Additional
scoring paths give players alternatives; they do not require raising the target
before measuring actual match lengths. D-04 tracks that balance decision.

## Foundation-point catalogue

| Path | Points | Initial cap | Qualification |
| --- | ---: | ---: | --- |
| Operational colonies | 1 each | 5 | Own a developed, supported, useful colony |
| Public delivery contracts | 1–2 each | 5 | Complete an identified contract at its destination |
| Research milestones | 1 each | 3 | Complete 3, then 6, then 9 distinct technologies |
| Settlement milestones | 1 each | 2 | Reach 60, then 120 supported residents |
| Combat career | 1 each | 2 | Destroy 6, then 16 eligible enemy fleet-strength units |
| Privateer career | 1 each | 2 | Secure 3, then 8 qualifying enemy trade vessels |
| Infrastructure project | 2 | 2 | Finish one scoring project with delivered materials |
| Exploration discoveries | 1 each | 2 | Secure distinct contested discoveries; expansion |

An operational colony has housing, healthy household support, at least two
operating non-habitat buildings, and a useful inbound or outbound delivery within
the last 120 seconds. Local household use of imported food or water qualifies.
Starting colonies must meet the same criteria; they do not get a special free point.
An interruption shorter than 60 seconds does not revoke an established colony point.
Loss of ownership revokes it immediately.

Healthy support means housing for everyone present locally, a support factor of
at least 0.9, and food, water, and habitat-power coverage each at least 90%. A new colony earns its
point only after meeting all conditions; the interruption grace does not award
points to a colony that has never qualified. If more than five qualify, any five
contribute, so losing one of six qualifying colonies leaves the capped score at five.

Research, career, settlement, contract, and project achievements remain earned
after later losses. Each milestone has a stable ID and can be awarded once per
commander. A completed scoring project is a delivery objective, allowing standard
buildings to remain repeatable without farming project points through rebuilding.

Supported population is defined only in [Housing and workers](housing-and-workers.md).
Its useful-employment check uses derived worker-time shares from the uniform
staffing ratio. Do not substitute total headcount, habitat capacity, displaced
people, passengers, or embarked military crew, or introduce individual worker
assignments for scoring. Boarding can reduce supported civilian population;
demobilized crew qualifies again only through the ordinary support window.

## Default transferable titles

The standard preset enables these six. Every title is worth 2 points.

| Title | Leading statistic | Minimum to claim |
| --- | --- | --- |
| Grand Admiral | Current operational military fleet strength | 6 strength |
| Fleetbreaker | Cumulative eligible enemy warships destroyed | 3 hulls |
| Privateer | Cumulative qualifying trade ships captured and secured | 3 hulls |
| Trade League | Distinct colonies in the largest useful trade network | 4 colonies |
| Prosperity | Supported population sustained over the support window | 60 residents |
| Science Council | Distinct completed research technologies | 3 technologies |

Operational fleet strength includes commissioned, fully crewed, enabled military
ships with at least 50% health and enough propellant for 60 seconds of their normal
operation. A hull waiting for crew supplies no strength; demobilization removes
the ship from this metric.
Use the class weights in [Combat and piracy](combat-and-piracy.md).

Fleetbreaker is intentionally based on number of warships destroyed; strength
destroyed is shown beside it and earns separate career milestones. Privateer is
based on qualifying secured captures, with raw capture events shown separately.

Trade League uses the connected-colony metric and meaningful-delivery rules from
[Logistics and trade](logistics-and-trade.md). No longest-path search is required.

## More title options

These are candidates for alternate lobby presets. Their exact thresholds should
be tuned before enabling them. Prerequisite mechanics must exist first.

| Title | Candidate metric | Important qualification |
| --- | --- | --- |
| Merchant Prince | Realized net market profit | Deduct acquisition costs and fees; no self-trading |
| Cargo Baron | Standard value of stolen cargo secured | Count recovered quantity and prevent lot recapture loops |
| Guardian | Valuable escorted deliveries surviving hostile contact | One award contribution per mission; not empty escort laps |
| Industrial Magnate | Useful manufactured goods delivered to final consumption | Exclude stock cycling and repeatedly counted batches |
| Salvage Master | Enemy wreck value recovered | One source reward per wreck; requires salvage expansion |
| Pathfinder | Distinct contested discoveries secured | Finite map objectives; requires exploration expansion |
| Relief Coordinator | Emergency support contracts completed | Seeded public objectives; no shortages created by self-transfer |
| Conqueror | Contested outposts successfully occupied | Requires the later conquest rules |

Avoid enabling every title by default. Lobby presets should state the active titles
and their categories before ready-up; the roster is locked once the match starts.

## Contract variety

Delivery contracts can request construction materials, food for a neutral station,
replacement electronics, or a large shipment within a time window. Later defence,
escort, and relief objectives can share the same bounded contract-point budget.

Generated contracts must be achievable with the map's resources and current tech
stage. Publish their reward, deadline, recipient, remaining quantity, and whether
multiple commanders can contribute. A contract is either per-player or competitive;
that choice cannot change after accepting deliveries.

## Leadership and ties

Evaluate titles once per economic interval from authoritative state. A challenger
must strictly exceed the incumbent's eligible statistic to take its title. An
incumbent tied for the lead keeps it. If an incumbent becomes ineligible, clear
the title and apply the claim rules again.

An unclaimed title with multiple equally leading eligible players remains unclaimed
until there is one leader. Reaching a minimum is not enough to steal a tied title.
Every transfer produces one event with the old holder, new holder, and reason.

Titles based on current conditions can be lost after shortages or fleet losses.
Cumulative destruction and capture statistics do not decrease when that player's
own ships are lost. Other players must catch up to take those titles.

## Victory procedure

When a player becomes eligible, start a visible 60-second simulated-time countdown.
Reset it if either eligibility condition stops being true. Pauses and host recovery
pause the countdown; reloads cannot restart or accelerate it.

If multiple countdowns finish in the same authoritative interval, compare total
score, then foundation points. If still tied, record a shared victory. Persist the
match-ended event before presenting the result as confirmed.

The lobby can eventually offer other targets, a score-at-time-limit mode, or team
victory. These are presets with explicit rules, not mid-match owner overrides.

## Avoiding point farming

- One destruction credit per hull, using the combat attribution rule.
- Uncommissioned hull projects and demobilized ships award no destruction credit;
  crew casualties do not multiply a warship's kill count or strength value.
- One qualifying secured trade capture per hull across the entire match.
- Empty, self-owned, friendly-transferred, passenger, and neutral NPC hulls do not
  qualify for the competitive capture metric.
- Use fixed reference values where cargo value affects scoring.
- Circular shipping does not create useful-delivery progress.
- Split and merged lots retain quantity provenance and cannot reset eligibility.
- Duplicate or replayed events cannot re-award points, contracts, or titles.
- Disabling and rebuilding a project cannot award its completion again.

One real action may intentionally contribute to a career milestone and a title.
That is different from processing the same action twice. The title cap and
foundation requirement limit the resulting acceleration.

## Player-facing scorecard

Always show the score breakdown, held titles, unclaimed titles, current leaders,
minimums, personal progress, and what would cause a conditional point to disappear.
Show the leading opponent's victory countdown and relevant counterplay.

Balance evaluation should compare peaceful development, population, mixed play,
fleet warfare, and piracy paths rather than only the overall average match length.
