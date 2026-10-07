# Map interaction and gameplay

Status: continuous, interactive strategy play in the style of OpenFront is a
confirmed requirement. The control bindings, layouts, and timing targets below
are proposals. This document owns the moment-to-moment play experience.

## The core experience

Players command a living asteroid map. Freighters travel, ships patrol and fight,
construction progresses, and populations grow while players inspect the world
and give new orders. The next useful action should usually be available from the
object or location it concerns.

A typical sequence is: spot a threatened shipment, select an escort, order it to
the freighter, check the supplying colony, queue a harbour, and return to watching
the engagement. Construction and trade continue throughout the sequence.

Strategic accessibility comes from readable ownership, clear targets, quick
contextual orders, automatic execution, and frequent feedback on the map. The
player does not need to repeatedly authorize ordinary production or every cargo
trip. Detailed economic reports remain available when a decision needs them.

## One continuous world

- Asteroids, individual vessels, cargo routes, and orders have map positions.
- Vessels travel through space; routes are visible logistics paths, not the only
  permitted corridors for a military ship.
- Ownership is attached to asteroids and vessels. A coloured background region
  does not implicitly claim every asteroid or create a land border in space.
- Selected fleets show destinations or tracked targets. Combat shows health,
  firing, boarding progress, retreat, and losses as applicable.
- Asteroid construction shows progress and completed buildings. A ready hull has
  a visible state while it waits for crew or a held launch.
- A player can change orders while ships are already moving. Cargo, crew, and hulls
  continue from their actual state and position.

## Direct control vocabulary

| Intent | Proposed flow | Immediate feedback |
| --- | --- | --- |
| Inspect a colony | Tap/click asteroid | Selection outline, compact status, contextual actions |
| Build infrastructure | Owned asteroid → Build → building | Local cost, slots, staffing impact, then construction progress |
| Launch a warship | Owned asteroid → Shipyard → ready hull | Crew boarding cost and staffing preview, then a vessel leaving the dock |
| Move ships | Select warship(s) → Move → map location | Destination marker and order line |
| Patrol | Select warship(s) → Patrol → other endpoint | Patrol endpoints and continuing movement |
| Escort | Select warship(s) → Escort → friendly shipment | Visible association with that moving vessel |
| Intercept | Select warship(s) → Intercept → hostile vessel | Tracked target, pursuit, then combat or boarding under the combat rules |
| Retreat | Selected fleet → Retreat/Return | Order toward a chosen or nearest usable friendly harbour |
| Establish or edit shipping | Owned source → Route → destination | Highlighted endpoints, cargo/reserve policy, route confirmation |
| Settle a neutral asteroid | Inspect target → Colonize → eligible source | Settlement-kit, passenger and housing requirements, then a physical colony mission |
| Inspect flows | Colony or global flow control | Timestamped rates, stocks, and limiting factors |

Touching a hostile object ordinarily inspects it. An offensive order requires an
owned fleet and explicit targeting intent. Opening a menu, panning, or dismissing
a panel cannot issue an attack or purchase.

The neutral-colonization rule already belongs to the economy. Promoting **enemy
asteroid conquest** into the core game remains the separate D-08 decision; the
OpenFront play-style requirement does not itself settle siege or elimination rules.

## Mobile controls

- Tap an asteroid or ship to select it. Use a compact action bar near the thumb.
- Drag to pan; pinch to zoom around the gesture centre. A gesture that becomes
  a pan or pinch must never also count as an order tap on release.
- Target mode states what to select, highlights compatible targets, and provides
  a persistent Cancel control. Ordinary camera movement remains available.
- Aim for 44–48 CSS px effective hit areas and primary controls. At distant zoom,
  cluster or disambiguate crowded ships and provide a fleet list as another way
  to select the desired hull.
- Select multiple ships using fleet/group controls and an accessible list. Drag
  selection is optional on touch and must not replace ordinary map panning.
- Keep the selected object's summary compact. Open larger building lists,
  shipyard previews, and reports only when requested.
- Scroll panel contents independently; keep close and primary actions reachable.
  Respect safe areas, portrait/landscape changes, and short browser viewports.

The initial concept's proposed tap-versus-drag threshold is approximately 8 CSS px.
Tune it on actual devices alongside zoom sensitivity and target disambiguation.
Long-press or radial menus may be optional accelerators after the explicit controls
work well. Essential actions cannot depend on hover or a gesture users must guess.

## Desktop controls

Use the same selection and target model with mouse and keyboard. Drag empty space
to pan, scroll to zoom, and click to select. Escape cancels targeting or closes
the open panel. Visible controls provide the same operations as shortcuts.

With an owned fleet selected, a right-click shortcut can map empty space to Move,
a friendly freighter to Escort, and a hostile vessel to Intercept. Display the
predicted action under the cursor before committing. Right-click without an
eligible selection must not silently choose or dispatch a different fleet.

Desktop may add modifier-based multi-selection, box selection under an explicit
binding, and fleet groups. Do not make an unmodified drag both a camera gesture
and a box-selection gesture. A non-modal inspector can remain beside the map
while an object is selected; the default unselected view leaves that space free.

## UI state and authoritative commands

```text
Observe → select object(s) → choose intent → preview target/cost
        → submit identified command → accepted or rejected → visible execution
```

Selection, hover, camera movement, and target previews are local UI state. Provide
immediate visual response, with a proposed target of under 100 ms on target devices.
That response is distinct from the authoritative acceptance of a game command.

Commands carry IDs, issuer, action, selected entity IDs, and explicit target or
parameters. The owner validates current ownership, eligibility, resources, crew,
and destination state. A disappearing target, lost source, stale state, or lack of
resources produces a concrete rejection or defined cancellation. Never charge a
cost twice because a player tapped again or a command was retried after reconnect.

Accepted commands show an order marker or queue state promptly. A local preview
must not manufacture ships, deduct people, award cargo, or confirm a kill before
the authoritative update. Command replacement uses the vessel's real position;
visual interpolation cannot teleport it or independently finish a delivery.

Cancel before submission clears only UI intent. Cancelling an accepted order uses
the domain rules for reservations, construction work, manifests, and in-flight
goods. Crew remains aboard a commissioned ship until its defined lifecycle event.

## Time and panels

The proposed clocks remain 100 ms movement/combat ticks, one-second economic
processing, and 10-second report buckets. Rendering interpolates motion at the
available frame rate. Work and growth progress remain visible between completions.

Opening Build, Fleet, or Reports does not pause the match. Keep simulation time
and actionable threat indicators visible, and let an alert focus the relevant
location. Solo pause is an explicit control; multiplayer pause follows the lobby
policy. Host recovery exposes its actual frozen/reconnecting state.

Economic intervals determine accounting and report freshness. They do not make
the game turn-based or require the player to wait for a report refresh to issue
a ship order.

## Information hierarchy and art

Aim for roughly 80% or more visible map area in the unselected play state. This
is a design target, not a fixed constraint for every panel, accessibility setting,
or small viewport. Use a narrow HUD, compact context controls, and restrained alerts.

Start from a tactical top-down map with many asteroids visible at once. At wide
zoom prioritize silhouettes, faction marks, resource symbols, ship groups, and
direction. At close zoom reveal settlement details and individual hulls. Large
colony portraits belong in optional inspectors, not the normal play surface.

Fantasy-space atmosphere can come from ship silhouettes, faction emblems, subtle
celestial marks, a warm brass/mint palette, engine trails, and a quiet star field.
Map labels, route lines, hit targets, and selected orders must remain readable
through that treatment. Health and supply changes need text or symbols as well
as colour. Reduced-motion preferences keep gameplay positions understandable.

## Iteration evidence

The [round 02 interaction study](../design/round-02/README.md) explores this model
with a local browser prototype. Its simplified supply, construction timings,
combat attribution, and missing networking are documented there. It does not
replace the complete game rules or establish performance and recovery guarantees.

Before treating the interaction design as settled, demonstrate camera control,
selection, move/escort/intercept/return, colony construction, crew boarding,
route editing, and reports during live play on phone and desktop. Acceptance
criteria belong to [Delivery and validation](delivery-and-validation.md).

Reference research: OpenFront's [official overview](https://github.com/openfrontio/OpenFrontIO)
describes its real-time strategy focus. Its inspected
[input handler](https://github.com/openfrontio/OpenFrontIO/blob/9453de8567c8465eed4969f316ddcd131d392d6f/src/client/InputHandler.ts)
and [context menu controller](https://github.com/openfrontio/OpenFrontIO/blob/9453de8567c8465eed4969f316ddcd131d392d6f/src/client/hud/layers/MainRadialMenu.ts)
provide concrete references for pointer/zoom handling, fleet selection, and map
context actions. Our bindings and asteroid mechanics are design proposals.
