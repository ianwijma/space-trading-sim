# Combat and piracy

Status: proposed combat rules. Military destruction and trade capture scoring,
and warships drawing their crew from local workers, are requirements.

## Fleet roles

| Role | Purpose | Proposed fleet-strength weight |
| --- | --- | ---: |
| Interceptor | Catch freighters and raid exposed routes | 1 |
| Frigate | Escort convoys and fight interceptors | 3 |
| Cruiser | Control contested areas and sustain fleet battles | 6 |

Civilian roles include freight, market trading, colonization, and passenger
transport. These do not contribute military fleet strength. Ship health, weapon
damage, construction work, propellant consumption, and speeds remain balance data.

Warships commission only after their full crew boards from the producing asteroid.
Crew then lives aboard and supplies no local building labour. Ordinary damage does
not reduce crew in the initial proposal; destruction records the crew as casualties.
Crew sizes, waiting hulls, and demobilization are owned by
[Shipbuilding and crews](shipbuilding-and-crews.md).

## Orders and fighting

Support move, patrol, escort, intercept, blockade, and retreat. Ships choose targets
automatically within their order and engagement rules. Players can select retreat
health and acceptable pursuit distance; escorts should not abandon a convoy to
chase an irrelevant target across the map.

Players give these orders by selecting warships and locations or moving targets
on the map. Group commands use explicit selected hull IDs. Show accepted orders,
pursuit, escort association, health, and boarding progress in the world; a
combat report is a secondary view. Replacing an order keeps each vessel at its
current position. Input and feedback rules belong to
[Map interaction and gameplay](map-interaction-and-gameplay.md).

Movement and combat run on fixed simulation ticks. Weapon effects communicate
the underlying state and never independently apply damage. Damage and target
selection use deterministic ordering and seeded randomness if a weapon needs it.

Military operation consumes propellant. A vessel without sufficient fuel cannot
keep attacking indefinitely; it can drift or request a slow recovery tow. Exact
recovery behaviour must preserve the ability to service a stranded fleet.

## Capturing civilian cargo

An interceptor must reach and maintain boarding range of an eligible hostile
civilian ship for a finite capture duration. Damage, escape, and an escort can
interrupt boarding. The successful capture is one authoritative event.

After capture, the ship and its goods change ownership and receive a return order
to an owned harbour. Goods become usable after unloading. The victim can intercept
the returning vessel. If the captor has no reachable harbour, it may hold or
reroute the vessel; scoring does not complete without securing it.

Maintain two separate statistics:

- **Capture events:** every successful seizure, for the battle history.
- **Qualifying secured captures:** captures meeting the anti-farming conditions
  and arriving at the captor's harbour, for scoring.

Internal transports may be captured for their goods. The default Privateer title
specifically counts market trade ships. Passenger and colony missions do not count
as trade ships even when their hull type is normally a freighter.

## Destruction credit

Assign each destroyed military hull one destruction event and at most one credited
commander. Use the commander with the largest eligible hostile damage contribution
in the previous 60 seconds. Break equal contributions by the final damaging hit,
then a stable commander ID. Damage by a player's defence batteries counts for
that player. Assist statistics may credit others without extra kill points.
Only commissioned warships qualify; an uncommissioned construction project cannot
award a military kill. Crew casualties do not award additional destruction counts.

For an environmental finishing blow, credit a commander only if its eligible
recent damage reached at least 25% of the hull's maximum health. Otherwise record
an environmental loss. Friendly fire is disabled in the standard preset.

Record both eligible hull count and destroyed fleet-strength value. The
Fleetbreaker title uses hull count, matching "most warships destroyed"; career
milestones use strength so fighting larger ships is also rewarded.

## Qualifying capture rules

- The ship was an opponent-owned market vessel before the hostile capture.
- It carried goods worth at least a proposed 30 credits at fixed reference values.
- The captured vessel reaches an owned harbour and unloads at least 30 credits
  of qualifying cargo at the same fixed reference values.
- Only the first qualifying secured capture of a hull in a match contributes to
  competitive capture counts. Repeated recaptures still move real assets.
- Self-transfers, friendly transfers, neutral NPC hulls, passenger missions, and
  empty ships do not qualify.

Qualification must remain attached to the hull/event through reroutes and reloads.
Secured cargo value uses the quantity actually recovered, not its original loaded
amount. Price changes cannot inflate it. Captures by AI follow the same rules.

These rules constrain normal exploits; trusted-browser P2P cannot prevent all
deliberate collusion or a modified client. See [multiplayer trust](multiplayer-and-lobbies.md).

## Blockades and settlement damage

Blockades deny routes and operating inputs. Proposed first-release strikes can
disable exposed service buildings, interrupting throughput until repaired.
Disabled buildings stop providing their active services; their footprint remains.
Disabling housing displaces people beyond the remaining capacity. They provide
no labour, so the shared staffing ratio falls across the asteroid. Population
remains accounted for under the housing and evacuation rules.

Neutral-colony claiming is part of the economy. Capturing enemy asteroids, siege
ships, and full faction elimination are later decisions. Start with a short,
visible protection period around home settlements; its exact duration is in D-06.

## Salvage and passengers

Destroyed vessels can create bounded salvage lots with one identified wreck source.
A wreck cannot create rewards repeatedly after recovery. A dedicated salvage yard
and related scoring title are expansion features.

People on disabled passenger vessels enter the rescue process in
[Housing and workers](housing-and-workers.md). They remain in their faction and
cannot be converted into loot or trade-capture points.
The separate proposed military loss rule removes a destroyed warship's crew once;
salvaging its wreck cannot recreate them. Military escape pods remain an expansion.

Related: [ship crews](shipbuilding-and-crews.md), [scoring](scoring-and-victory.md),
[shipping](logistics-and-trade.md).
