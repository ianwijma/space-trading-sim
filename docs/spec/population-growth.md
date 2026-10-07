# Population growth

Status: gradual population buildup and housing that adds capacity without instantly
adding workers are confirmed requirements. The curve, rates, and support conditions
below are proposals for balancing.

## Player-facing rule

An established asteroid gains residents automatically over simulated time while
it has available housing and adequate support. Constructing a habitat raises its
population capacity immediately when usable; filling those places takes time.
Growth produces housed residents who join the shared local workforce. It requires
no manual worker assignment, recruitment purchase, or repeated player command.

Treat this as an abstract settlement-growth process in a short match. There are
no children, aging, or individual immigration vessels in the first release.
Transfers between existing colonies are physical and use the passenger rules.

Launching a warship moves its crew out of the local population, leaving room for
future growth. The asteroid does not immediately refill those places. Workers
already there continue operating buildings under the shared staffing ratio.

## What OpenFront does

The official source checked on 2026-10-07 at commit
`9453de8567c8465eed4969f316ddcd131d392d6f` separates current troops from maximum
troops. Its ordinary base increase, before bot/difficulty adjustments, is:

```text
increase per player update = (10 + currentTroops^0.73 / 4)
                          * (1 - currentTroops / maximumTroops)
```

The implementation clamps the result to maximum capacity. Territory and completed
city levels contribute to that capacity; `PlayerExecution` applies the increase
on simulation ticks. Growth slows near the cap and reaches zero at the cap.

Sources: [capacity and growth calculation](https://github.com/openfrontio/OpenFrontIO/blob/9453de8567c8465eed4969f316ddcd131d392d6f/packages/engine-lib/src/configuration/Config.ts#L326)
and [per-tick population update](https://github.com/openfrontio/OpenFrontIO/blob/9453de8567c8465eed4969f316ddcd131d392d6f/packages/engine/src/execution/PlayerExecution.ts#L95).

Use the same capacity-versus-current-population relationship locally on each
asteroid. The formula below uses smaller populations, rational arithmetic, and
our own support rules. OpenFront's numbers and AI bonuses are not balance values
for this game.

## Proposed local growth curve

For a claimed, deployed settlement with usable housing:

```text
H = usable housing capacity
P = local civilian residents, including displaced residents

If H = 0 or P >= H: growth rate = 0
Otherwise:
  x = P / H
  S = min(food coverage, water coverage, habitat power coverage), clamped to [0, 1]
  growth per minute = H * (0.03 + 0.18 * x) * (1 - x) * S
```

Use the actual support coverages from the current economic interval. Growth does
not use the workforce ratio C or the delayed service modifier's 0.25 floor.
Automatic habitats therefore support recovery even when no residents remain,
provided power and the food/water reserve are available. At zero residents, food
and water coverage for current consumption are 1; the reserve check below still
requires supplies for the next person.

The base term allows recovery from low population. Growth is fastest at about
42% occupancy under full support and slows toward full housing. More habitats
can support a larger long-term population and a higher absolute replenishment
rate, while consuming slots, power, and household supplies.

Illustrative instantaneous rates at full support:

| Residents | Housing capacity | Residents gained per minute |
| ---: | ---: | ---: |
| 0 | 30 | 0.90 |
| 6 | 30 | 1.58 |
| 15 | 30 | 1.80 |
| 24 | 30 | 1.04 |
| 29 | 30 | 0.20 |
| 30 | 30 | 0 |
| 24 | 60 | 3.67 |

These are current rates, not fixed completion times. Recalculate as population,
housing, or support changes. The final few places fill slowly. D-13 tracks tuning
against the desired match length and replacement time after launching ships.

## Support and admission

As a proposed safeguard, growth only accrues while the available food and water
stock covers at least two minutes of household needs for P + 1 residents. Use
on-site stock after household reservations; expected deliveries are forecasts.
Missing power or supplies can slow growth or pause it entirely. Show the cause.

Recheck housing and that reserve against the projected population at completion.
If several residents could complete, admit only the number still supported. Growth
does not charge credits or immediately consume a separate food recipe; new
residents begin normal household consumption in the following economic interval.

Displaced residents use new beds first. Growth is zero whenever local population
already meets or exceeds the housing cap. Passenger arrivals may exceed that cap
under the existing emergency-arrival rule; passive growth never does.

## Interval progress and recovery

- Accumulate the rate over each one-second economic interval in fixed-point or
  rational subunits. Whole-person completions occur at the interval end.
- Keep the fractional remainder so slow growth eventually produces a resident.
  New residents become available to buildings at the next interval boundary.
- If support blocks growth, freeze the fractional remainder below one person;
  do not bank whole people. If a completion recheck rejects whole arrivals,
  discard that rejected whole progress and retain only the fractional remainder.
- At or above housing capacity, clear the remainder and accrue no progress.
  Building another habitat or launching a ship cannot release a hidden backlog.
- Save the remainder, last processed economic interval, completion-event IDs,
  housing state, and support state. Reload and host migration neither reset
  progress nor repeat a completed arrival.
- Advance only authoritative simulated time. A paused or fully offline match
  produces no population. A reconnecting peer receives growth already simulated
  by the active owner without independently adding it again.

The starting population is an explicit match-creation grant. A colony mission
takes its settlers from a source asteroid; manufacturing a colony kit creates
no people. An empty deployed colony can recover using the base growth term if
its automated housing, power, and reserves remain functional.

## Example: building housing and then launching a ship

A colony with 24 residents and 30 beds completes a second habitat. It still has
24 residents, now with capacity for 60. At full support its proposed growth rate
is about 3.67 residents/min; fractional progress adds residents over time.

Later, at 20 housed residents and 20 required building workers, an interceptor
embarks 5 people. The colony has 15 workers and 75% coverage across every staffed
building. With support maintained, population growth gradually restores coverage.
The 5 people aboard remain in the faction's population ledger as crew.

Related: [housing and shared staffing](housing-and-workers.md),
[crew boarding](shipbuilding-and-crews.md), [interval order](buildings-and-production.md),
[reporting](economy-insights.md).
