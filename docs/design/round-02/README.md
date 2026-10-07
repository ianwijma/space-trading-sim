# Round 02: command a living map

Date: 2026-10-07.

Status: interactive design study. The user found round 01 too static and wants
play closer to OpenFront. This round establishes direct map interaction while
retaining fantasy-space colours and original ship/asteroid shapes. The final art
direction remains open.

## Open the interactive study

**[Download the playable HTML](playable-study.html)** and open it in a browser.
It contains its scripts and styles, works without installation or a game backend,
and starts from a small local scenario. A GitHub file page displays source; use
its download action to open the actual HTML in a browser.

The [Next.js / TypeScript / Tailwind source](../../../prototypes/map-play/README.md)
and artifact export command are included in the repository.

## Start here

1. Drag around the map; pinch or use the zoom controls to change scale. Freighters
   continue travelling between colonies.
2. Tap a friendly warship, choose **Move**, and tap a location. Its accepted order
   and path appear on the map. **Select fleet** applies orders to the whole fleet.
3. Choose **Escort** and a friendly freighter, or **Intercept** and a rival vessel.
   The order follows the actual moving target. **Return** heads back toward Kestrel.
4. Select Kestrel and open **Shipyard**. Launch the ready interceptor: five people
   board, leaving 15 of 20 required local workers and 75% staffing.
5. Build a habitat or mining rig. Housing adds empty capacity; extra rigs increase
   the demand shared by the local workers.
6. Open **Flows** while watching traffic. Reports collect ten-second intervals;
   opening them does not pause the world.

Right-click is an additional desktop command shortcut with a fleet selected.
Escape or the target prompt's close button cancels an unsubmitted order. The
explicit pause control stops this local scenario. Reload starts the study over.

## Rendered layouts

These are screenshots of the same browser study, rather than a separate UI image.

| Phone portrait | Desktop |
| --- | --- |
| [390 × 844 preview](mobile-map.png) | [1440 × 960 preview](desktop-map.png) |

## What changed from round 01

- A broad top-down map shows actual moving ships and individually selectable objects.
- Small asteroid silhouettes and resource symbols replace large colony illustrations
  in normal play. Ownership, targets and route direction take visual priority.
- A compact colony or fleet action bar exposes the next action close to selection.
- Order targeting keeps the camera usable and provides explicit cancellation.
- Building, shipyard and flow panels open only when needed; the map keeps running.
- The ship launch updates the population, available workers, and common work rate.
- A restrained petroleum, brass and mint treatment carries the fantasy-space mood.

## Intended next feedback

First evaluate the amount of visible map, ease of selecting ships, camera feel,
and whether orders are understandable. Then refine the art and information density.
The main gameplay question still open is whether enemy-asteroid conquest should
join piracy and naval combat in the core release; see D-08.

This study's building times, healthy support assumption, simple combat and cargo
handling are shortcuts for exploring interactions. It is a local scenario without
the complete economy, victory rules, AI, P2P or save/recovery system. The full
scope remains in the [specification index](../../spec/README.md).

## Specification changes

[Map interaction and gameplay](../../spec/map-interaction-and-gameplay.md) now owns
camera gestures, selection, command targeting, live feedback, timing, and mobile/
desktop control intent. The vision, interface, combat, logistics, architecture,
delivery criteria and decision register link to that interaction contract.

Round 01 remains available as an aesthetic comparison. Its large management
panels no longer represent the proposed default gameplay view.
