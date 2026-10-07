# Persistence and recovery

Status: reload restoration and automatic reconnection are requirements. The storage
model is proposed; partition behaviour depends on D-02.

## Recovery contract

- Solo reload restores the last locally committed match state and player identity.
- Multiplayer reload reconnects to the same player slot and catches up to the
  current authoritative match; it does not rewind everyone else to the old save.
- Clean owner departure transfers a caught-up game to another browser.
- Unexpected owner loss recovers the agreed history under the selected consistency policy.
- If every browser closes, simulated time stops; it resumes from saved state when
  the required participants reconnect under that policy.

The durable boundary is a committed update, not an animation frame or an input
that was still pending. Quorum requirements and casual-fork risk must match what
the lobby advertised. Never promise recovery from data that no surviving browser
successfully stored.

## Storage proposal

Use Dexie over IndexedDB. Every peer persists an ordered journal, periodic full
snapshots, current membership/leadership metadata, and identity information.
Propose snapshots every five simulated seconds with incremental durable journals
between them. Transaction boundaries, not snapshot cadence, determine what is saved.

Apply confirmation only after the required local durability and replication
acknowledgements. If storage fails or quota is exceeded, expose the failure and
stop claiming that new actions are safely saved.

## Checkpoint contents

| Group | Required contents |
| --- | --- |
| Identity | Local player credentials, match/room association; protected from ordinary invite sharing |
| Protocol | Rules and schema versions, owner term, committed membership, update index and hashes |
| World | Seed, generated world, ownership, slots, hazards, market state |
| Economy | Inventories, cargo provenance, credits, production remainders, allocation cursors |
| Settlements | Housed/displaced population, usable housing, fractional growth progress, last processed interval, support factors, reserves, shortage timers |
| Transfers | Cargo and passenger manifests, destinations, reservations, loading progress |
| Shipbuilding | Project IDs, reserved inputs, work progress, hull-ready interval, launch hold, commissioning status |
| Combat | Hull state, crew manifests and source asteroid, fuel, orders, damage attribution, hostile boarding progress, wrecks |
| AI | Goals, plans, decision timers, reservations, random-generator state |
| Scoring | Milestone IDs, eligible kills/captures, title holders, support histories, victory timers |
| Reporting | Ledger cursor, report buckets, open aggregates, retained history |
| Presentation | Camera and selected entity, when still valid; not part of authoritative simulation |

Keep local identity secrets separate from portable match snapshots. An ordinary
save export should not expose another player's reconnect authority. Cross-device
identity recovery is a separate optional export flow, not implied by copying a room link.

Recompute shared workforce coverage from saved local population, housing, and
eligible buildings. Derived worker-time shares are not independently mutable
assignments. Restore fractional production progress so one-worker buildings with
partial coverage retain the work already completed before a reload.
Restore growth progress and hulls waiting for crew as well. Housing is a capacity,
never an instruction to refill the population on load. Each crew transfer, casualty,
and demobilization retains its event ID and one durable outcome.

## Reload sequence

1. Read the local match association and saved identity.
2. Validate the snapshot and journal schema; reconstruct the last committed state.
3. Render a labelled saved/reconnecting view with destructive commands disabled.
4. Rediscover the room, prove player identity, and find the current valid owner.
5. Compare terms, committed indexes, and hashes; request missing updates or a snapshot.
6. Validate and apply the update stream; deduplicate pending command retries.
7. Resume control and ordinary reporting at a committed simulation boundary.

Use bounded retry/backoff and retry when the browser reports online status. If the
room is empty, show that the game is waiting for peers. Do not silently create a
new independent authority merely because discovery has not returned yet.

## Browser lifecycle

Persist during play. Attempt a save and clean handover when the owner becomes
hidden, but do not depend on unload callbacks. Mobile operating systems may suspend
or discard the page without a final callback. Workers and service workers do not
guarantee a continuously running simulation after the app closes.

Request persistent storage at an appropriate point and inspect the result.
Offer export/import and show whether browser persistence is available. Cleared
site data, private-session storage loss, or loss of every saved copy cannot be
recovered automatically without an external copy.

## App and save versions

Pin the live match to a rules version. Defer service-worker activation and application
updates until a match ends or can resume with a compatible bundle. Hosting must
retain the assets needed by active versions for the supported recovery window.

Support explicit save-schema migrations and validate them. Unknown or incompatible
saves remain exportable and receive an explanation; they are not overwritten with
a fresh game. Exact version-retention duration is a release-policy decision.

## Recovery invariants

- No command, delivery, growth completion, crew transfer, death, capture, or score
  event applies twice.
- Population and cargo manifests remain in exactly one location/state.
- An interrupted household-support window or victory timer resumes correctly.
- A returning old owner cannot replace newer committed state.
- Failed snapshot validation leaves the previous usable snapshot intact.
- Reports reconcile after replay and do not reset career statistics.
- Housing limits and the shared staffing ratio are identical before and after
  recovery, including displaced people and fractional work in progress.
- Embarked crew cannot simultaneously count as asteroid workers or passengers.
- Reloading never replenishes people spent on a launch, clears a crew loss, or
  restarts a growth accumulator. Offline wall-clock time adds no population.

References: [browser lifecycle](https://developer.chrome.com/docs/web-platform/page-lifecycle-api),
[Dexie persistence guidance](https://dexie.org/docs/StorageManager).
