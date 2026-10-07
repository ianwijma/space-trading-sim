# Logistics and trade

Status: proposed transport and market rules.

## Physical shipping

Goods must travel in vessels between asteroids. Each mission identifies source,
destination, owner, cargo, priority, route, vessel, and loading/delivery state.
Basic freighters operate without propellant; military vessels and fast civilian
engines consume it. This keeps an interrupted fuel supply from stopping all recovery.

Initially each resource unit occupies one cargo/storage unit. Passenger capacity
is a separate vessel attribute. Different mass or volume multipliers can be added
later through balance data if they create useful decisions.

Shipments remain visible and selectable while other orders or panels are open.
Creating a route starts with a source and destination on the map; its inspector
then exposes cargo, reserves, throughput, and danger. The map can display existing
lanes and highlight the selected shipment's current journey. A route edit changes
future movement under the command rules without teleporting a vessel or its cargo.

Freight harbours share their handling rate between loading and unloading. Berths
limit simultaneous service. Storage handling, free capacity, available vessels,
and round-trip time also constrain delivered throughput.

```text
route capacity <= min(source handling,
                      vessel capacity / round-trip duration,
                      destination handling,
                      cargo available to send,
                      cargo the destination can accept)
```

Shared budgets are allocated once across all routes using that harbour. Each
route cannot claim the harbour's full capacity independently.

## Route policies

Support fixed-quantity deliveries, surplus exports above a reserve, maintaining a
destination stock target, and supplying a specific production chain. Routes can
include waypoints and escorts; display expected duration and known danger.

Household food and water reserves come first under the default policy. Reserve
projections include population growth, passenger arrivals, and industrial
consumption. Alert before a manual
export would break protected reserves; the player may deliberately override them.

Offer cargo priorities and convoy departures without requiring players to order
each shipment. Pool vessel assignments where possible. Automatic rerouting must
respect a player's danger tolerance and keep them informed of a substantial detour.

## Cargo identity and ownership

Cargo lots have stable IDs and identified owners and locations. Splitting a lot
records lineage and splits its quantity; merging storage must retain enough
provenance to account for deliveries and scoring. Capturing a vessel changes
ownership of its goods atomically. Loading or unloading changes location only.

Construction, processing, household use, sales, destruction, and salvage are
explicit ledger events. Never turn the animation of a ship arriving into an
independent source of inventory changes.

Cancelling before departure releases reservations. Cancelling in transit changes
the mission or destination; it does not teleport cargo back into source inventory.
Unavailable destinations trigger holding or a fallback harbour, not silent deletion.

## Market trading

A trade hub authorizes market orders, while freight infrastructure physically
loads and unloads the associated vessels. It adds processing capacity rather than
an independent unlimited shipping channel.

Neutral exchanges buy and consume delivered goods. A completed sale removes the
goods and grants credits in one idempotent transaction. A trade vessel is a
civilian hull performing a market mission; an internal transport carries goods
between owned asteroids. Both are physical piracy targets.

Ordinary sale prices are calculated at delivery. Contracts can promise a fixed
reward before a deadline. The interface distinguishes estimated proceeds from
guaranteed contract terms. Market demand updates on a proposed 10-second interval
with price bounds and a buy/sell spread.

Imports debit or reserve credits when the order is accepted and generate an
inbound shipment. Define reservation cancellation and failed-delivery behaviour
explicitly in balance data. The first release proposes payment at dispatch and
loss borne by the buyer if the shipment is stolen or destroyed; insurance is an
expansion.

Market capacity and demand remain finite even though the external economy can
introduce goods and credits. Those introductions have explicit ledger sources.
Public markets provide an expensive recovery option, not unrestricted instant supply.

## Useful deliveries and scoring

A useful delivery is cargo subsequently consumed for production, construction,
household support, a completed contract, or a neutral-market sale. Merely moving
stock between storage containers does not earn delivery achievement progress.

Associate consumed quantities with their delivered cargo provenance. The same
quantity cannot count repeatedly as the same delivery contribution after a loop,
split, merge, cancellation, or recapture. Manufactured output starts a new product
lot with its input lineage recorded.

For the trade-network title, eligible links are owned-asteroid routes whose goods
have contributed at least 10 standard-value credits of useful deliveries during
the last 120 seconds. Count the number of distinct colonies in the largest
connected component, not distance travelled or repeated laps. Use fixed reference
values from balance data, not prices players can inflate.

## Operational reporting

Each route reports requested and delivered units/min, loading and unloading
queues, average trip duration, cargo in transit, loss rate, support priority, and
realized revenue where applicable. Distinguish market revenue, stolen cargo
recovery, and internal transfers.

Related: [combat](combat-and-piracy.md), [household reserves](housing-and-workers.md),
[economic reporting](economy-insights.md), [scoring](scoring-and-victory.md).
