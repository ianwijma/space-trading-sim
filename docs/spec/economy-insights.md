# Economy insights

Status: resource-flow insight is a requirement; the reporting layout and intervals are proposals.

## Questions every report should answer

- Where did a resource come from, where did it go, and where is it now?
- What is limiting a building or route?
- Which settlement will run short of food, water, workers, power, or space?
- Which trade and military decisions produced an economic gain or loss?
- What capacity increase would address the current bottleneck?

## Reporting intervals

Propose economic processing every second and report buckets every 10 seconds.
Show current stock with its committed-tick timestamp, and label rate windows such
as "last 60 seconds" or "last 5 minutes." A report update is not a simulation tick.

Keep recent detailed events plus compact history for the whole match. A proposed
retention policy keeps 10-second buckets for 10 minutes and minute buckets for the
rest of the match. Checkpoints preserve bucket accumulators and their boundaries.

## Resource accounting

For each owner, location, resource, and interval:

```text
closing = opening
        + extracted + manufactured + received + acquired
        - process inputs - household use - construction use
        - shipped - sold - destroyed - ownership lost
```

`Acquired` includes recovered loot, neutral-market imports, and explicit grants,
each with a separate reason code. Do not also record the same captured goods as
new production. Refined resources have recipes and input lineage.

At empire level, include goods at asteroids, on vessels, and in owned recoverable
containers. Internal transfers cancel; loading does not reduce total ownership.
Sales, consumption, destruction, and ownership transfers do. Show in-transit goods
as a distinct subtotal, not an unexplained loss.

Maintain equivalent ledgers for credits and population. Passenger transfers,
rescue, boarding, and demobilization move existing people; growth creates new
residents and recorded casualties reduce the living total. Credits distinguish
realized sales, purchases, construction spending, fees, and contract rewards.

```text
closing local residents = opening local residents + completed growth
                        + passenger arrivals + demobilized crew
                        - passenger departures - crew embarked
closing faction living population = opening living population
                                 + completed growth - recorded deaths
```

Faction totals include passengers, people in rescue, and embarked crew. Rehousing
changes labour eligibility without changing the local resident total. Present
crew transfers separately from deaths, material costs, and ordinary worker demand.

## Reporting surfaces

| Surface | Main information |
| --- | --- |
| Empire summary | Stock by location, production, consumption, net change, current limiting needs |
| Asteroid balance sheet | Inputs, outputs, available/required workers, shared coverage, power, storage |
| Building details | Rated capacity, required workers, shared staffing ceiling, actual work, limiting reasons |
| Route details | Requested vs delivered rate, trip time, queues, losses, useful-delivery contribution |
| Settlement details | Current/capacity population, growth rate, housed/displaced people, coverage, support, crew departures |
| Fleet economics | Construction, people embarked, casualties, fuel, repairs, destroyed value, loot secured |
| Scorecard | Point sources, progress, eligible vs raw combat statistics, title comparisons |

Distinguish demand from actual consumption. A factory consuming no inputs because
its workers are missing must not make its supply chain look fully healthy.

## Population and life support

Display total living people, local residents, embarked crew, and supported civilian
population separately. A settlement report
shows food and water consumed by residents, water consumed by hydroponics, other
industrial consumption, reserves, inbound cargo, and projected growth demand.

Show current population/capacity, the current growth rate, progress toward the next
resident, and a concrete reason whenever growth pauses. A new habitat's preview
shows additional beds and estimated growth, without implying immediate workers.
Growth charts distinguish gradual arrivals from passenger transfers and returning
crew. Use simulated time for all forecasts.

Forecasts are conditional: "Water lasts about 3 minutes at current consumption;
next shipment expected in 2 minutes." If a route is contested, show the dependency
instead of treating every scheduled delivery as guaranteed.

Worker reporting shows local people, usable housing, available housed workers,
total eligible building requirements, and one shared staffing percentage. A
building's effective share is derived from that percentage and its requirement;
it is not an editable assignment. Show spare workers and displaced people separately.

Distinguish the shared staffing ceiling from later service, power, and input
limits. An input-starved building still contributes to workforce demand while
enabled. Building, removing, or disabling capacity and moving people should preview
the percentage change for all staffed buildings on each affected asteroid.

A shipyard report separates hull-work progress from waiting-for-crew time. Show
the crew complement, residents remaining after launch, projected shared coverage,
and a conditional estimate for recovery through growth or passenger arrivals.
Fleet reports retain the source asteroid of each crew manifest so players can
see which settlements sustain fleet production.

## Bottleneck explanations

Examples of useful explanations:

- "90 ore/min can be mined; ships currently deliver 30/min on this route."
- "5 housed workers / 10 required: all staffed buildings have 50% work rate."
- "This one-worker machine has a 0.5 worker-time share and operates at 50%."
- "This harbour loads 30/min instead of 60/min because workforce coverage is 50%."
- "With the current workers, the new factory would reduce shared coverage to 40%."
- "Household water demand is 12/min; hydroponics needs another 12/min."
- "24 / 60 residents; growth is about 3.67/min while current support holds."
- "Growth paused: water reserves cannot support the next resident for 2 minutes."
- "Launching this interceptor takes 5 of 20 workers; shared coverage falls to 75%."
- "Hull complete: waiting for 3 more crew; shipyard labour is a separate requirement."
- "This captured ship has not reached a harbour, so it has not qualified for Privateer."

Recommendations use existing accounting and capacity rules. They should state
their assumptions and avoid predicting an exact profit or arrival time during combat.

## Visualizations and mobile behaviour

Provide a map overlay for routes, supply shortages, population, and throughput.
Use tables and small charts for precise comparison. Offer resource flow diagrams
on demand, with sources, transit, processing, and sinks as separate stages so
circular shipping does not produce an invalid Sankey diagram.

On phones, show summaries first, then filterable detail. Keep data understandable
without colour, hover, or following animated lines. Provide text explanations
and accessible tabular equivalents for important chart values.

## Integrity requirements

- Opening plus signed changes reconciles to closing stock exactly.
- Cargo location and ownership totals agree with the simulation.
- Replayed updates do not duplicate reporting entries.
- Host migration does not reset windows, counters, or partial buckets.
- Reports indicate when they are stale or the match is recovering.
- Workforce coverage agrees across every staffed building; fractional worker
  shares and structural storage limits are displayed without misleading rounding.
- Boarding and demobilization cancel within the faction population ledger;
  recorded crew losses reduce it once. Growth and crew histories survive recovery.

Related: [production](buildings-and-production.md), [population](housing-and-workers.md),
[growth](population-growth.md), [crew lifecycle](shipbuilding-and-crews.md),
[persistence](persistence-and-recovery.md).
