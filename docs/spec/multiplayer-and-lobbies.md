# Multiplayer and lobbies

Status: browser-owned P2P matches, invitations, configurable AI, and owner transfer
are requirements. Infrastructure and failure-consistency choices remain open.

## Lobby experience

Create a lobby, choose a name and colour, configure the map and scoring preset,
add or remove AI slots, choose AI personalities and difficulty, copy an invitation
link, and ready up. The initial proposal supports six commanders in any human/AI mix.

The invitation contains a random room identifier and shared admission secret,
preferably in a URL fragment. Joining the room does not grant another participant's
identity or personal reconnect credentials. A static lobby page reads the identifier
in the browser; no dynamic server route is required.

Replicate lobby configuration and ready state. Starting a match commits its seed,
rules version, scoring roster, commander slots, initial owner, and membership.
Rules cannot be silently changed by the owner during the match.

AI enable/disable settings apply in the lobby. During a match, a disconnected human
can receive an optional caretaker according to the locked lobby policy. Do not
remove an AI faction mid-match and erase its ships or economy.

## State ownership

The lobby creator is the initial authoritative owner. Commands contain a player
identity, command ID, sequence, and validated payload. The owner checks permissions,
resources, and legal targets, then assigns authoritative order.

Every connected peer maintains a recoverable replica and local persistence. Only
the owner generates new AI decisions. Accepted AI commands and planner-state changes
are replicated so another owner can continue without a new personality or plan.

## Transport proposal

Use WebRTC data channels through Trystero for a small peer mesh. A full mesh keeps
survivors connected after the owner leaves; it increases connections as lobby size
grows, so six peers is a profiling target rather than a universal browser limit.

Signaling discovers peers, STUN helps establish direct paths, and TURN relays
encrypted traffic when direct paths fail. These are connection infrastructure;
none is assigned authoritative simulation or match storage.

Public signaling services can support an initial prototype without a project-owned
backend. Their reliability and usage policies are external dependencies. Managed
TURN commonly needs a trusted credential issuer; long-lived issuer secrets cannot
be shipped in browser code. D-01 must settle which services are acceptable.

## Replication protocol

Proposed envelopes contain match ID, rules/protocol version, leadership term,
update index, parent hash, command IDs, payload, and resulting state hash.

The owner orders inputs and emits transition batches. Peers apply the same
deterministic simulation and retain checkpoints plus the ordered command/event
journal. Periodic state hashes detect divergence; a validated snapshot repairs it.
Render interpolation is local and never changes the authoritative state.

Persist accepted records before sending the durability acknowledgement required
by the selected policy. Batch and pipeline writes within a bounded pending window.
The interface distinguishes a pending input from a confirmed committed command.

Ordered game traffic is reliable. Presence and pointer effects may be best effort.
Use bounded queues, chunked snapshots, payload limits, validation, and command-rate
limits so a reconnect or malformed peer cannot exhaust a phone's memory.

## Host transfer

For a clean departure, catch up a successor, commit the authority change, and
transfer before closing the old owner. Prefer a healthy foreground browser.

For unexpected loss, stop confirming new outcomes, retain pending commands, and
show a short recovery state. A successor must have an eligible journal and
establish a new leadership term before resuming. A returning former owner rejoins
as a replica and does not overwrite a later committed game with its local save.

Detect loss through transport state plus application heartbeats. Exact timeouts
are measured during the prototype; a heartbeat timeout alone does not establish
that every other browser agrees about who owns the game.

## Consistency choice: D-02

For three or more peers, a strict policy uses a majority of the last committed
membership, persisted votes/terms, and log-freshness rules. Membership changes
must themselves be agreed; a partition cannot redefine the quorum as whichever
peers it can currently see. Without a majority, progress pauses.

With two peers, automatic promotion after an ambiguous connection loss and strict
single-history availability cannot both be guaranteed. The proposed friend-lobby
alternative is casual continuation: elect a survivor automatically and disclose
that a later network reunion may discard one speculative branch. Never merge two
independently spent inventories or sum their scores.

The exact two-peer recovery policy is intentionally unresolved. The prototype
must demonstrate the tradeoff and settle a deterministic branch-selection rule
before this becomes a completed production specification. Owner failover must not
be described as universally seamless while D-02 is open.

A solo human with AI has one peer and no replacement browser. Closing it pauses
the match for local restoration. AI commanders do not add replication or votes.

## Identity, trust, and versions

Use a persistent local identity, with a proposed Web Crypto signing key and a
public key in the replicated player roster. Reconnection proves control of that
identity rather than trusting a nickname or a transient transport peer ID.

Handle duplicate tabs with a local lock and connection-generation policy. One
identity must not act twice because the old tab is still connected. The exact
handoff mechanism needs browser verification.

The first release is for private, mutually trusted lobbies with an open board.
Participants possess game state, and browser-owned authority cannot provide strong
anti-cheat guarantees against a modified owner or coordinated peers.

Verify application, protocol, and rules compatibility before joining a live match.
Incompatible clients receive a useful version message instead of partially applying
unknown messages. See [Persistence and recovery](persistence-and-recovery.md).

References: [Trystero connections](https://trystero.dev/docs/connections/),
[signaling strategies](https://trystero.dev/docs/signaling-strategies/),
[WebRTC connectivity](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Connectivity).
