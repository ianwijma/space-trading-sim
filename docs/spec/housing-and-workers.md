# Housing and workers

Status: housing limits available workers, an asteroid-wide staffing ratio applies
equally to all staffed buildings, population grows gradually, and warships take
local workers aboard as crew. These are confirmed requirements. Life support and
the detailed population and crew rules remain proposals.

## Purpose

Housing provides places for workers to live. Housed workers operate the asteroid's
factories, rigs, harbours, and other staffed buildings. Insufficient housing limits
the available workforce and slows every staffed building by the same proportion.

Track all residents as working-age people in the initial short-match model.
One housed resident provides one available worker. Skills, children, aging, and
household types are expansion concepts.

## Shared workforce coverage

Calculate one staffing ratio for the entire asteroid each economic interval:

```text
H = usable housing capacity
P = local civilian residents, including any temporarily displaced people
W = min(P, H)                         # available housed workers
R = sum of full-staff worker requirements of eligible buildings
C = min(1, W / R) if R > 0 else 1    # shared workforce coverage
```

Eligible buildings are completed, enabled, and not disabled by damage. Each
staffed building contributes its full worker requirement to R. Automated buildings
require zero workers. A building waiting for inputs, power, or output space still
contributes its requirement; another building does not get a larger share because
of that bottleneck. Explicitly disabling a building removes its demand.

Every eligible staffed building uses C as its staffing productivity multiplier.
With 50% of the total required workers, all such buildings have 50% of their normal
work rate before other constraints. The building's worker requirement determines
its share of labour, not a different coverage percentage.

```text
building's effective worker share = its worker requirement * C
sum of effective shares = min(W, R)
spare workers = max(0, W - R)
```

These shares are worker-time equivalents, not separately assigned individuals.
A building requiring one worker can run at 50% with a half-time share. Never round
that share down to zero, round it up to one, or fully staff one building first.
Use fixed-point/rational arithmetic and retain partial work between intervals.

### Example: five workers for ten workers' worth of buildings

Assume other inputs, power, and storage are sufficient:

| Building | Required workers | Effective share | Work rate at 50% coverage |
| --- | ---: | ---: | --- |
| Mining rig | 5 | 2.5 | 15 ore/min instead of 30 |
| Freight harbour | 4 | 2 | 30 cargo units/min instead of 60 |
| Warehouse handling | 1 | 0.5 | 60 units/min instead of 120 |
| Total | 10 | 5 | Every staffed building has the same 50% coverage |

At full coverage every building reaches its staffing limit. Additional workers
do not raise productivity above 100%. With no housed workers and positive demand,
staffed buildings perform no work. If there are no staffed buildings, define C as
1 to avoid division by zero; automated infrastructure operates under its own limits.

The first release has no worker-priority presets, assignment sliders, or
per-building worker locks. Manual staffing and preferential allocation are future
features. Existing building enable/disable controls affect demand; they do not
let the player assign individual workers.

## Population states

Population is always in exactly one state:

- Housed resident at an asteroid, contributing to its shared workforce pool.
- Temporarily displaced person at an asteroid, contributing no labour.
- In an identified passenger transfer.
- Awaiting rescue or travelling in an evacuation transfer.
- Aboard an identified warship as crew, contributing no asteroid labour.

Gradual growth introduces new residents through explicit events. Passenger
movement, crew boarding, and demobilization transfer existing people between
states. Shipyard workers remain residents; the crew leaving aboard a warship is
a separate population commitment. Each person belongs to exactly one state.

```text
Living population = housed residents + displaced people + passengers
                  + people in rescue + embarked military crew
New living total = old total + completed population growth - recorded deaths
```

There are no automatic starvation deaths in the proposed standard short-match
mode. Military crew losses are recorded separately under the proposed
[ship-crew lifecycle](shipbuilding-and-crews.md); launching a ship is a transfer,
not a death. No other population departure or loss is implicit.

## Housing and population capacity

Each habitat supplies a proposed 30 housing places. Multiple habitats add capacity.
Completing housing changes H without creating people. Existing displaced residents
can be rehoused at the next boundary; genuinely empty places fill through
[gradual population growth](population-growth.md) or physical passenger arrivals.

Growth is automatic over simulated time. Its proposed curve and support conditions
are defined in that document. There is no paid recruitment queue or immediate
population purchase in the first release.

Housing is a hard cap on available workers. If housing is lost, people above the
remaining capacity become temporarily displaced and supply no labour. Recompute
W and C for every staffed building at the next economic interval, without a grace
period or minimum-productivity exception for missing housing.

Displaced people remain in the population ledger and can be rehoused or evacuated.
They cannot contribute to workforce-based scoring or keep a factory operating
while unhoused. Restored housing rehouses existing displaced people before any
new growth. People living aboard warships use their ship's berths and are excluded
from local P, W, and household demand.

## Food, water, and power

Proposed full-support household consumption:

| Need | Per resident per simulated minute |
| --- | ---: |
| Water | 0.5 units |
| Food | 0.25 units |

Twenty-four starting residents therefore consume 12 water/min and 6 food/min.
Hydroponics and industry consume additional water separately. Habitats also need
their own power allocation.

Temporarily displaced people still create household demand until they leave, but
do not supply workers. Housing damage changes H. Temporary food, water, or habitat
power shortages use the separate proposed service modifier below; housing loss
must not also be counted a second time in that modifier.
Measure habitat power coverage only across the remaining usable housing; disabled
housing has already been removed from H.

Provide consumption forecasts that include expected population growth and
transfers. Household reserves are protected from automatic selling and ordinary
exports unless the player explicitly changes that reserve policy. Proposed growth
conditions protect the support reserve needed by the projected population.

## Shortages and recovery

The following service mechanic is a proposal in addition to the confirmed staffing
rule. Calculate food coverage, water coverage, and habitat service power each
interval. At full coverage the settlement support factor is 1.
After a proposed 60-second shortage grace period, move the support factor toward
the lowest coverage, with a floor of 0.25, over 60 seconds. Recover toward healthy
coverage over 30 seconds after supplies return.

This service factor can further reduce the productivity of housed workers. It
cannot create labour, replace C, or allow unhoused people to work. Its proposed
0.25 floor is a service modifier only; C itself can reach zero. Report actual
consumption and unmet demand separately without creating missing goods.

The remaining housed workforce can keep working at its reduced shared rate.
Automated power and prefab construction provide recovery options when C is zero.
Validate recovery from housing loss, empty reserves, and an interrupted route.

## Local workforce and building changes

Workers are local. People at one asteroid cannot operate another asteroid's
buildings without first moving there and obtaining housing.

Adding an enabled building increases R and may slow all staffed buildings.
Removing or disabling one reduces R and may speed the others up. Growth,
passenger transfers, crew boarding, demobilization, and housing changes update W.
Apply all accepted boundary changes, calculate the ratio once, then use that same
value throughout the interval. End-of-interval growth becomes available next interval.

Show local population, housing, housed workers, displaced people, total required
workers, shared coverage, spare workers, and each building's derived labour share.
Power, resources, and service penalties may reduce actual output further and must
be shown separately from workforce coverage.

## Moving workers

Assign an available civilian vessel to a passenger mission. Before departure,
validate receiving housing, remove departing people from the source local count,
and create one passenger manifest atomically. Recompute the source's shared
workforce ratio; no individual building has workers manually detached from it.

On arrival, remove the manifest and add people once. Only those with housing enter
the workforce. If destination beds fill through growth or other arrivals, or
housing is disabled during the journey, offer rerouting; an emergency arrival
creates displaced people until they can be housed. A departure-time housing check
does not guarantee beds will still be available on arrival.
The original destination is never allowed to duplicate a manifest already delivered
or redirected elsewhere.

Passenger ships can be disabled in combat. Their people remain in their original
faction and enter a rescue transfer toward an owned settlement. Rescue travel
takes simulated time and people cannot work during it. A lost passenger vessel
earns no trade-capture title progress. Passenger capacity and rescue timing are
included in D-06 rather than assumed to be balanced already.

## Population that qualifies for scoring

For each asteroid, residents qualify when:

- There is housing for everyone present locally, with no displaced people.
- Food, water, habitat power, and the support factor are each at least 90%.
- Useful effective worker shares total at least 75% of the housed workforce.

A building supplies useful jobs when it has performed useful work in the last
minute or operates a ready defence or repair service. Sum its derived worker share
with the shares of other useful buildings; do not create individual assignments
for scoring. An input-starved idle factory's share does not qualify as useful.
Automated buildings have no worker shares. A zero-worker settlement qualifies zero
population. This reporting rule never reallocates the labour of idle buildings.

Sum qualifying residents across the faction. **Supported population** is the
minimum of that sum over the preceding 180 seconds; it is zero until that history
exists. Displaced people, passengers, people in rescue, and embarked military crew
do not qualify. Crew returning to civilian life must qualify through the same
support window as other residents. Persist this history.

This statistic powers the prosperity title and settlement milestones in
[Scoring and victory](scoring-and-victory.md). Population movement or an increase
in housing capacity cannot instantly inflate it.

## Useful player decisions

- Import food and use the space for industry, or grow food locally.
- Keep workers in local industry, or embark them to expand the fleet.
- Build housing, or use those slots for mining and defence.
- Move spare workers, or build capacity that uses the existing workforce.
- Sustain a shipbuilding colony's growth, or accept slower construction after launches.

Related: [building staffing](buildings-and-production.md),
[population growth](population-growth.md), [ship crews](shipbuilding-and-crews.md),
[supply policies](logistics-and-trade.md), [population reports](economy-insights.md).
