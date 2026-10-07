# World and resources

Status: proposed world-generation and resource rules.

## Asteroids

Each asteroid has an ID, position, visual shape, one natural resource, extraction
quality, construction-slot capacity, and current ownership. Deposits never deplete.
Manufacturing and imported goods do not change its natural resource type.

Ordinary asteroids have a proposed 6–20 slots. Starter asteroids use a 14-slot
baseline. Quality modifies extraction rate within a bounded range; exact bounds
are a tuning decision. Shape communicates size but does not require precision
placement of buildings on a phone.

Claim neutral asteroids using a colony vessel with a standard settlement kit.
Ownership is established on arrival and successful deployment, not at order time.
Competing claims are resolved by the authoritative event order.

## Resource catalogue

| Resource | Kind | Role |
| --- | --- | --- |
| Metal ore | Natural | Basic construction and alloys |
| Ice | Natural | Water and propellant |
| Silicon | Natural | Electronics |
| Crystals | Natural | Research and advanced equipment |
| Alloys | Manufactured | Ships and advanced structures |
| Propellant | Manufactured | Military operation and fast civilian engines |
| Electronics | Manufactured | Advanced construction and research |
| Water | Manufactured | Residents and hydroponics |
| Food | Manufactured | Resident support and the reserve required for population growth |

Credits are a faction-wide currency. Power is local instantaneous capacity.
Residents and embarked crew are people in a separate population ledger. Crew
boarding moves existing people; only explicit growth creates new residents after
initial setup. Research progress is a faction statistic, not freight cargo.

Food comes from hydroponics and water comes from ice processing, preserving the
one-natural-resource-per-asteroid rule. Dedicated agricultural asteroids emerge
through construction choices.

## Baseline recipes

These ratios are proposals, not final balance values. Rates and staffing belong
to [Buildings and production](buildings-and-production.md).

| Recipe | Inputs | Outputs |
| --- | --- | --- |
| Smelt alloys | 2 metal ore | 1 alloy |
| Refine propellant | 1 ice | 2 propellant |
| Purify water | 1 ice | 4 water |
| Grow food | 1 water | 2 food |
| Manufacture electronics | 2 silicon + 1 alloy | 1 electronics |
| Research batch | 2 electronics + 1 crystal | 5 research progress |

Power and labour also constrain each process. Recipe execution consumes its
inputs and creates its outputs in one authoritative transaction.

Research progress is spent on identified technology completions. Propose a small
initial catalogue covering extraction efficiency, docking, cargo capacity,
habitat services, hulls, and repair. Scoring milestones are awarded at 3, 6, and 9
distinct completed technologies; the catalogue must contain at least nine.
Technology costs, prerequisites, and bonuses remain D-06 balance data. Title
comparison uses all completed technologies, even after the milestone-point cap.

## Starting conditions

Propose metal home asteroids for the initial balanced preset. Other starting
resource types can follow after validating their recovery paths.

The home kit includes one habitat, power array, mining rig, freight harbour,
warehouse, two basic freighters, 24 residents, construction supplies, and a funded
expansion opportunity. Its household buffer covers five minutes of full support:
60 water and 30 food at the initial population. Gradual growth increases consumption,
so that buffer lasts less time if no new supply arrives. The 24 starting residents
are an explicit setup grant; later habitats never grant a starting population.
Additional industrial inputs are budgeted separately.

The home buildings occupy seven slots using the baseline footprints. Remaining
space supports early choices between life support, manufacturing, trade, and ships.
The exact initial credit and construction-stock quantities remain in D-06.

A colony kit deploys a habitat and an operational unloading facility with a small
resident group and support supplies. Its exact cost and contents must be validated
against the home kit; colonization cannot require a factory on the destination
before it can unload that factory's construction materials.
Its resident group must board from an owned source asteroid and remain in one
passenger manifest until deployment. Building a colony kit or cancelling a mission
does not create settlers. Subsequent local growth follows
[Population growth](population-growth.md).

## Generation constraints

- Seeded and reproducible for a given rules version.
- Guarantee reachable ice and silicon near every start and access to crystals.
- Provide access to neutral trade and at least two viable outward routes.
- Avoid overlapping starts and extreme differences in essential-resource distance.
- Create valuable central positions, alternate routes, and navigational hazards.
- Reject unreachable or economically blocked starts using deterministic checks.
- Generate the map once at match creation and replicate the resulting world data.

Use static geography initially. Drifting asteroids and changing hazards are
expansions because they complicate buildings, routes, and saved positions.

## Economic identity

Goods have one owner and one authoritative location: an asteroid, vessel, wreck,
or other explicit container. Loading changes location; capture changes ownership;
consumption removes goods. A sale removes delivered goods and credits currency
exactly once. See [Logistics and trade](logistics-and-trade.md).
