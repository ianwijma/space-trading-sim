# Interface and art direction

Status: space theme, mobile support, and OpenFront-like readability are requirements;
the visual directions and layouts below are proposals.

## Visual directions

| Direction | Palette | Treatment |
| --- | --- | --- |
| Deep Space Operations | Ink #080F1F, cyan #55DDE0, amber #FFB454 | Crisp silhouettes, restrained stars, clear tactical overlays |
| Industrial Frontier | Charcoal #171B20, copper #D88A4A, pale blue #9BC7DC | Rugged mining installations, utilitarian panels, strong status lights |
| Orbital Atlas | Midnight #11152B, lavender #A89AFF, ice white #EAF2FF | Subtle nebulae, elegant orbital graphics, softer approachable panels |

Deep Space Operations is the recommended initial direction, pending D-05.
Use original artwork and interfaces, with OpenFront as a readability reference.

## Map hierarchy

The map is the main surface. Asteroid scale communicates construction capacity;
deposit icons communicate resource; ownership uses outlines and faction emblems.
Do not use the same colour encoding for ownership and natural resources.

At wide zoom show ownership, resource icons, major routes, and fleet groups.
At closer zoom reveal buildings, cargo ships, damage, and local service states.
The asteroid silhouette and building count should remain legible on a phone.

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
- Map: selection, construction, routes, fleet orders, and settlement status.
- Economy: resource, labour, support, capacity, and trade reports.
- Scorecard: points, title competition, achievements, and victory countdowns.
- Recovery: reconnect progress, current owner, and stale-save status.
- Results: scoring timeline, economic history, and key military events.

## Desktop layout

Use a compact resource and score bar, selection inspector, and collapsible reports.
Support keyboard shortcuts for common map and fleet actions. Keep critical
commands available through visible controls as well.

## Mobile layout

Support portrait and landscape. Use pinch zoom and one-finger panning on the map,
tap selection, and a bottom sheet with Build, Routes, Fleet, and Economy actions.
Use approximately 44–48 CSS-pixel touch targets and respect device safe areas.

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
