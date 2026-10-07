# AI players

Status: solo play, mixed lobbies, and distinct personalities are requirements;
the decision model below is a proposal.

## Shared competence

Every AI must maintain a viable economy, support its residents, respect staffing
and slot limits, move physical cargo, and use the same legal commands as a human.
Personality changes priorities rather than bypassing the rules.

AI uses the same housing-limited pool and shared staffing ratio. It expands
housing and population alongside total worker demand, and evaluates how adding a
factory would slow all staffed buildings. It has no per-building worker allocation
or staffing-priority ability in the first release.

Housing takes time to fill. AI forecasts growth and support needs before committing
to new industry or a fleet. Each warship launch subtracts crew from the producing
asteroid's residents; AI evaluates the resulting coverage, next-hull construction
time, and population replenishment. It can develop housing-rich shipbuilding
colonies, bring passengers, or hold a launch when losing workers would break supply.
AI uses the same growth curve and crew costs as humans, including casualty losses.

Implement local utility-based decision making. Candidate actions are scored by
economic need, safety, opportunity, personality, and victory progress. No remote
language-model service is required for gameplay.

## Personality catalogue

| Personality | Preferred behaviour | Main weakness to exploit |
| --- | --- | --- |
| Pirate | Hunt valuable trade, secure loot, pursue Privateer and Cargo Baron when enabled | Fragile production and stretched recovery routes |
| Competitor | Optimize points, contest titles, react to victory countdowns | Less commitment to a predictable specialization |
| Warlord | Develop shipbuilding colonies, replenish crews, destroy hostile warships, blockade supplies | Heavy workforce, fuel, and repair dependency |
| Merchant | Build profitable networks, fulfill contracts, protect valuable shipments | Exposed logistics |
| Industrialist | Improve bottlenecks and manufacture at scale | Dependence on several input streams |
| Researcher | Secure research inputs and milestones | Slower early military expansion |
| Fortress builder | Maintain compact, well-supported, defended settlements | Limited reach and slower expansion |
| Opportunist | Exploit weak escorts, cheap inputs, and temporarily unclaimed titles | Changes direction and may leave plans incomplete |

All styles may earn population and economic points. An aggressive personality
still needs to recognize when hunger, missing workers, or no loading capacity
makes another warship a poor purchase.

## Difficulty

Separate personality from difficulty. Difficulty can alter planning depth,
decision interval, forecasting horizon, risk estimation, and consistency of
execution. Proposed intervals range from roughly one to four seconds per planner.
Basic survival responses can run at the economic interval.

The standard difficulty model gives no hidden resource, visibility, or scoring
bonuses. An explicit handicap mode can be considered later if needed.

## Planning cadence

Use a high-priority survival layer for food, water, housing and workforce coverage,
and fleet fuel, a strategic layer for expansion and points, and tactical fleet orders for
engagements. Retain plans long enough to avoid constantly cancelling construction
or changing routes when utility scores fluctuate slightly.

Planning is staggered across AI commanders and runs within a measured computation
budget. Avoid evaluating every vessel against every possible target every frame.

## Multiplayer execution and recovery

The current owner generates AI commands. Peers receive their accepted outcomes
through the same ordered simulation stream as human commands. Checkpoints and
ordered updates include planner state, goals, decision timers, random-generator
state, and reservations needed to continue after handover.

Do not rerun already accepted AI decisions after replay. An AI commander is not
an independently connected browser and cannot become the network owner or voter.

## Disconnected-player caretaker

The lobby can enable a limited caretaker for disconnected humans. Existing routes,
production, and defensive orders continue immediately. After a proposed 30-second
grace, the caretaker may repair, supply households, and defend under a visible
budget. It does not spend all reserves on a new war or change treaties.

The returning player takes control at an authoritative interval boundary. The
caretaker's outstanding commands remain identified and cannot execute again
because a client reloaded. Its permitted actions and grace period are D-07.

## Evaluation

Measure completion rate, match length, starvation time, spare-worker time, time
below full workforce coverage, economic losses, scoring paths, and personality-specific
behaviour. Track crew-wait time, population recovery after launches, and ships
produced per shipbuilding colony. Compare win rates across
seeds and starting positions. Verify that Pirates actually raid, Warlords engage,
and Competitors react when another player approaches victory.

Related: [lobbies](multiplayer-and-lobbies.md), [scoring](scoring-and-victory.md),
[validation](delivery-and-validation.md).
