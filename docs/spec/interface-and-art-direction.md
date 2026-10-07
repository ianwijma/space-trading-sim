# Interface and art direction

Status: a fantasy-space theme inspired by Star Trek, Star Wars, and related space
adventures, mobile-first browser support, and OpenFront-like live map play are
requirements. Visual directions and layouts below are proposals.

## Gameplay comes first

The default screen is a large, interactive tactical map with moving vessels,
visible orders, and contextual controls. The user found round 01 too static.
Round 02 therefore prioritizes camera movement, selection, targeting, fleet
activity, and responsive feedback. Detailed illustrations and large management
panels are secondary views. See [Map interaction and gameplay](map-interaction-and-gameplay.md).

## Visual directions

| Direction | Palette | Treatment |
| --- | --- | --- |
| Starlight Command | Ink #091522, teal #68D8CE, saffron #E8B65D | Clear naval controls, hopeful exploration, restrained bridge-display geometry |
| Frontier Guild | Petroleum #101C23, parchment #EFE7D3, brass #D1AA61, mint #8BDBC5 | Lived-in starports, merchant guilds, original fleets, warm tactile panels |
| Celestial Atlas | Aubergine #151327, lilac #B3A3E5, pearl #F2EDF4, gold #D6BA77 | Ancient navigation charts, crystalline architecture, restrained celestial detail |

These develop the initial palette proposals into the first actual mockups.
Frontier Guild's palette remains a candidate, pending feedback under D-05. The
working map uses simpler top-down asteroids and compact controls. The earlier
boards remain aesthetic studies; their large portraits and panels do not define
the normal gameplay layout. View the [visual design studies](../design/README.md)
for the earlier concepts and current interactive study.

## Map hierarchy

The map is the primary interaction surface. Asteroid scale communicates construction capacity;
deposit icons communicate resource; ownership uses outlines and faction emblems.
Do not use the same colour encoding for ownership and natural resources.

At wide zoom show ownership, resource icons, major routes, and fleet groups.
At closer zoom reveal buildings, cargo ships, damage, and local service states.
The asteroid silhouette and building count should remain legible on a phone.
Selected fleets show their destination or tracked target. Show real shipment
movement, construction progress, engagement effects, and boarding state. Reduce
detail at wide zoom so many asteroids and competing fleets remain readable.

Show housing and available/required workers with the shared productivity percentage,
for example "5 / 10 workers · 50% staffing." Displaced people and spare workers
have distinct indicators. Show supply routes for a selected settlement without
permanently filling the map with every route label.

Keep population capacity separate from workforce demand: "24 / 60 residents ·
+3.67/min" and "24 / 30 workers required · 80% staffing" answer different questions.
Show the current growth rate or its pause reason, and crew aboard as a separate
faction subtotal. A habitat completion updates capacity without animating a full
population refill.

## Main surfaces

- Lobby: invitation, slots, AI settings, map rules, scoring preset, ready state.
- Map: persistent live play, selection, construction, routes, fleet orders, and settlement status.
- Economy overlay: resource, labour, support, capacity, and trade reports on demand.
- Scorecard overlay: points, title competition, achievements, and victory countdowns.
- Recovery: reconnect progress, current owner, and stale-save status.
- Results: scoring timeline, economic history, and key military events.

## Desktop layout

Use a compact resource and score bar, an optional selected-object inspector, and
collapsible reports. Leave the unselected map broadly unobstructed. Give commands
through map targets and contextual controls; right-click may provide shortcuts.
Support keyboard shortcuts for common map and fleet actions. Keep critical
commands available through visible controls as well.

## Mobile layout

Support portrait and landscape. Use pinch zoom and one-finger panning on the map,
tap selection, and compact context actions. Expand a bottom sheet for detailed
construction, shipyard, or reporting tasks when requested. Global controls expose
the map, fleet selection/list, flows, and help without navigating away from the match.
Use approximately 44–48 CSS-pixel touch targets and respect device safe areas.
Drag and pinch must suppress order taps; targets need an unambiguous intent and
a visible Cancel action. Full bindings and command states are defined in the
[interaction specification](map-interaction-and-gameplay.md).

Creating a route can be: select source, choose cargo and policy, tap destination,
review capacity and household reserves, confirm. Moving workers uses a resident
count and destination picker, not individual person selection.

Building details explain their worker requirement and the common staffing ratio.
Construction previews show how the new demand changes productivity across the
asteroid. Worker priorities and per-building assignment controls are future features.
Keep the current workforce interface informational; housing, gradual growth,
transfers, ship launches, and building controls change the shared calculation.

The ship queue shows material/build progress, required crew, and projected staffing
after launch. A completed hull waiting for people has a distinct status and a
conditional crew-arrival estimate. Offer hold-launch and demobilize actions;
ordinary docking never silently returns people to the workforce. Demobilization
states that the ship is removed and checks housing for its returning crew.

## Feedback and readability

Confirm resource spending and orders with visible states: pending, accepted,
under construction, blocked, or completed. Explain blocked orders in concrete
terms such as missing workers, water, berths, or construction slots.
Show command feedback on the relevant object or path. Opening a panel does not
pause production or combat; preserve simulation time and threat awareness.

Use icons and text with colour. Support reduced motion, readable tabular numbers,
adequate contrast, and keyboard-accessible DOM controls. Important chart data needs
a text or table equivalent. Audio should be optional and start after user interaction.

## Performance direction

Use a 2D renderer for the map and regular DOM/Tailwind interfaces for panels.
Interpolate ship movement between simulation ticks. Cap visual effects and reduce
offscreen work before reducing the clarity of important information.

Initial performance target: usable 30 FPS on a representative midrange phone with
around 100 asteroids and 300 active vessels. This is a validation target, not a
measured capability or an automatic gameplay cap.

Related: [analytics](economy-insights.md), [packages](architecture-and-packages.md),
[design decision](decisions-and-research.md).
