# Buildings and production

Status: shared workforce coverage is confirmed; building values and other
production limits are proposals.

## Common rules

Every building has a footprint, construction cost and time, condition, enabled
state, rated capacity, and any power, staffing, input, or output requirements.
Players can build multiple copies of every standard building. Capacity adds across
copies; each copy still consumes space and must receive its own operating inputs.

Use a slot budget rather than spatial packing in the first release. A proposed
three-level upgrade limit improves efficiency without removing the incentive to
build another copy. Exact upgrade multipliers and costs remain tuning work.

Construction materials must be on the destination asteroid. A local assembly
queue builds prefabricated structures without requiring an existing staffed
factory. This provides a bootstrap path for new or damaged settlements.

## Initial building catalogue

Values are illustrative level-one baselines. Worker requirements describe full
staffing; available labour is shared proportionally across the asteroid. Residents
are whole people, but effective worker-time shares may be fractional. Power is
local capacity while operating; rates are per simulated minute at full supply.

| Building | Slots | Workers | Power | Rated capacity |
| --- | ---: | ---: | ---: | --- |
| Habitat | 2 | 0 | 2 | House 30 residents; empty places fill through gradual growth |
| Power array | 1 | 0 | Produces 20 | Supply 20 local power |
| Mining rig | 1 | 5 | 2 | Extract 30 natural units/min at standard quality |
| Water plant | 1 | 2 | 3 | 12 purification batches/min: 48 water/min |
| Hydroponics farm | 2 | 4 | 4 | 12 growing batches/min: 24 food/min |
| Refinery | 2 | 4 | 3 | 30 batches/min of one selected recipe |
| Electronics factory | 2 | 6 | 4 | 15 electronics/min |
| Freight harbour | 2 | 4 | 2 | Handle 60 cargo units/min across 2 berths |
| Trade hub | 2 | 3 | 2 | Authorize 60 cargo units/min for market orders |
| Construction harbour | 3 | 6 | 5 | Apply 60 ship-construction work/min; 1 active bay |
| Warehouse | 1 | 1 | 1 | Store 300 units; handle 120 units/min to/from vessels |
| Repair dock | 2 | 4 | 3 | Apply 120 repair work/min; 1 active repair berth |
| Defence battery | 1 | 2 | 3 | Engage 1 target; firing budget defined by weapon profile |
| Research array | 2 | 6 | 5 | 6 research batches/min: 30 research progress/min |

Ship work requirements, crew complements, repair conversion, weapon profiles,
construction costs, and growth constants belong to versioned balance data in D-06.
Recipe ratios are owned by [World and resources](world-and-resources.md).

The construction harbour's six workers are its full-staff building requirement.
They are separate from the people who board a finished warship. Building a hull
does not reserve crew; commissioning transfers housed residents out of the local
workforce. See [Shipbuilding and crews](shipbuilding-and-crews.md).

Each asteroid has a small landing cache with a proposed 100-unit capacity and
30-unit/min automated vessel handling. Warehouses add storage and handling to it.
The cache is settlement infrastructure, not an extra buildable structure.

Storage capacity is structural; staffing and power limit handling rather than
making stored goods vanish. Disabling a warehouse blocks its active handling
service while preserving its existing inventory. Housing loss removes worker
availability for displaced people, following [Housing and workers](housing-and-workers.md).

## Production calculation

Calculate production once per simulated second with carried fractional progress.
Every eligible staffed building uses the same asteroid workforce coverage C from
[Housing and workers](housing-and-workers.md). Its individual worker requirement
contributes to the asteroid's total demand. Apply any additional proposed support,
power, input, and output-space limits after deriving that shared staffing ceiling:

```text
labour factor = C * settlement support factor       # for every staffed building
potential work = rated work * interval * min(labour factor, power fraction)
actual work = min(potential work, input-supported work, output-space-supported work)
```

Clamp factors to [0, 1]. Automated structures have a labour factor of 1. At C = 0.5
and full other support, every staffed building performs half its normal work. A
one-worker building follows the same rule using a half-time share. At C = 0,
staffed buildings perform no work. Disability or destruction overrides production.

The multiplier slows mining and manufacturing output, cargo handling, market-order
processing, construction and repair progress, research, and staffed weapon firing
cadence. It does not shrink structural storage, beds, berth count, hull health,
or damage per hit. For example, a half-staffed shipyard needs twice the time for
the same ship when other conditions remain constant; its active bay count stays fixed.

Use integer subunits or rational remainders, not frame-dependent floating-point
accumulation. Multiple copies do not multiply a shared harbour, labour, or power
budget beyond what has actually been allocated.

## Interval ordering and contention

1. Apply arrived deliveries and accepted commands, including passenger transfers,
   demobilization, and building-state changes. Completions from the previous
   interval are now available.
2. Commission previously completed hulls in the order defined by the crew rules.
   Move crew atomically, rehouse displaced residents, and update local population.
3. Reserve resident food and water, allocate power under its own policy, and
   record household support coverages and population-growth eligibility.
4. Calculate W, R, and C once for the asteroid.
5. Reserve process inputs from the remaining opening inventory in stable order.
6. Perform processing and consume reserved inputs; append outputs and record
   construction completions at interval end.
7. Apply growth progress using the interval's population, housing, and support;
   recheck admissions against closing stock and housing. Newly completed residents
   become available for work and crew boarding at the next economic boundary.

Newly manufactured outputs become process inputs in the next interval. This avoids
recursive processing through an entire supply chain within one second.
Growth completions do not cause a second production pass. A hull finished during
this interval can commission at the next boundary, when all buildings will use
the resulting lower or unchanged workforce coverage.

When equivalent buildings compete for materials or power, use a deterministic
rotating cursor after that resource's priority selection. Persist the cursor to
prevent permanent starvation. This policy does not assign workers: all eligible
staffed buildings retain the same workforce coverage, including those waiting
for materials, power, or storage.

## Housing as a construction choice

An extra habitat uses space and power and increases the maximum workforce. It can
immediately rehouse displaced people at the next economic interval; filling new
empty places takes [population growth](population-growth.md) or passenger transfers.
Additional people increase life-support demand. Capacity itself creates no workers.

A colony may specialize in population-intensive research, low-labour extraction,
shipbuilding, or food production. Industrial capacity, residents, and supply
routes should grow together.

## Interface requirements

Show rated output, actual output, the shared workforce percentage, each building's
worker requirement, assigned power, storage, and the limiting factor. A build
preview includes total labour demand before and after construction and the resulting
coverage of all staffed buildings with the current housed workforce.
Ship queues additionally show crew needed at launch, projected workforce coverage
after boarding, and whether a completed hull is waiting for population to grow.

Resource and power policies are separate from staffing. Per-building worker
priorities, locks, and allocation controls are future features; the current
staffing rule is automatic and uniform across the asteroid.

## Invariants

- Occupied plus reserved construction slots never exceed asteroid capacity.
- Inventory, currency, and process remainders cannot become negative.
- Available workers cannot exceed usable housing or people present locally.
- Every eligible staffed building has the same staffing productivity multiplier.
- Total effective worker shares cannot exceed the available housed workforce.
- Fractional shares remain usable, including for buildings requiring one worker.
- Starting and recovering settlements can construct housing and power without
  first operating the buildings they are trying to construct.
- Replaying a completed construction or processing event cannot charge or output twice.
- Building housing cannot directly add residents; growth uses saved interval progress.
- Shipyard staffing and embarked crew are separate; commissioning moves people once.

Related: [resource reporting](economy-insights.md),
[population](housing-and-workers.md), [ship crews](shipbuilding-and-crews.md),
[shipping](logistics-and-trade.md).
