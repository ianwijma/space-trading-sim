# Live map interaction study

An isolated Next.js, TypeScript, and Tailwind CSS prototype for design round 02.
It explores live map play, touch controls, contextual orders, industry, and the
worker cost of launching ships. It shares no authoritative engine with a full game.

## Open without installing anything

Download [the standalone HTML study](../../docs/design/round-02/playable-study.html)
and open the downloaded file in a modern browser. React, controls, icons, and
styles are bundled into that file. It makes no game-service requests and requires
no running server. The study resets to its fixture on reload.

## Develop

From this directory, with Node 24:

```sh
npm ci
npm run dev
```

Open the address printed by Next.js. The production build uses static export:

```sh
npm run build
```

Recreate the downloadable design artifact from the same UI and local model:

```sh
npm run export:study
```

Optional screenshot generation uses an installed Chromium executable:

```sh
node scripts/render-study.mjs
```

Set `STUDY_CHROMIUM_PATH` to a different installed Chromium path when needed.
The renderer captures design previews; it is not a gameplay test suite.

## Interactions included

- Drag/pinch/wheel camera controls, zoom buttons, and home focus.
- Select asteroids and individual ships on the map or use the fleet list.
- Select all friendly warships and issue group orders.
- Move, patrol, escort, intercept, and return-home orders with physical motion.
- Mouse right-click shortcuts for a selected fleet; explicit touch action controls.
- Cancel targeting with its visible close action or Escape.
- Live civilian traffic, simplified naval fighting, boarding, and captured cargo return.
- Build repeated colony facilities with slot, credit, alloy, and worker constraints.
- Add housing without filling it instantly; observe gradual resident growth.
- Launch a ready interceptor and move five residents into its crew.
- Redirect an existing freighter between owned colonies without teleporting it.
- Interval flow summaries and fleet/casualty statistics while the map continues.
- Explicit solo pause and automatic suspension of this local study while hidden.

## Fixture boundaries

This is a small local interaction model. It assumes healthy household services,
uses accelerated building times and illustrative prices, and holds finished hulls
for an explicit launch action. Cargo loading/delivery is simplified, destination
processing is abstracted, and warship kill attribution uses the finishing ship.
It omits full production chains, harbour contention, fuel, research, victory,
colonization, enemy-asteroid conquest, complete AI personalities, multiplayer,
durable saves, and host migration. Those remain governed by the game specifications.

`model.ts` owns fixture changes. The React store publishes snapshots. Selection,
camera and target mode are local interface state; UI commands call the local model.
The standalone artifact and Next.js entry both render `MapStudy.tsx`.

The complete game still proposes Pixi rendering and a worker simulation. SVG and
`react-zoom-pan-pinch` let this study establish interaction before choosing final
assets and implementing the large-match runtime. `lucide-react` supplies UI icons,
and esbuild packages the standalone artifact. Dependencies are pinned in the lockfile.
