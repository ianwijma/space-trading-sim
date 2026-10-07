"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { ArrowDownLeft, ArrowRight, ChartNoAxesCombined, Check, ChevronRight, CircleHelp, Coins, Compass, Crosshair, Expand, Factory, Hammer, House, Layers, Minus, MoveUpRight, Navigation, Pause, Play, Plus, Radar, Rocket, Route, Shield, Sparkles, Swords, Users, X } from "lucide-react";
import { BUILDINGS, COLORS, FACTIONS, HEIGHT, RESOURCE, WIDTH, addRoute, build, buildHull, coverage, createWorld, demand, growthRate, housing, issueOrder, launch, selectedShips, slots, step, type Building, type OrderKind, type Point, type Rock, type Selection, type Ship, type World } from "./model";

type View = "build" | "shipyard" | "reports" | "fleet" | "help" | null;
type TargetMode = OrderKind | "route" | null;
const pct = (n: number) => `${Math.round(n * 100)}%`;
const clock = (n: number) => `${Math.floor(n / 60).toString().padStart(2, "0")}:${Math.floor(n % 60).toString().padStart(2, "0")}`;

function createController() {
  const current = createWorld();
  let snapshot = structuredClone(current);
  const listeners = new Set<() => void>();
  const publish = () => { snapshot = structuredClone(current); listeners.forEach(listener => listener()); };
  return {
    get: () => snapshot,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    advance: () => { step(current, 0.1); publish(); },
    command: (fn: (world: World) => string | null) => { const result = fn(current); publish(); return result; },
  };
}
function rockShape(rock: Rock) {
  return Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2;
    const r = rock.radius * (0.76 + ((rock.x + i * 23) % 30) / 100);
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
}

function Asteroid({ rock, selected, onChoose }: { rock: Rock; selected: boolean; onChoose: () => void }) {
  const owned = rock.owner !== 3;
  return <g id={`asteroid-${rock.id}`} data-kind="rock" data-id={rock.id}
    transform={`translate(${rock.x} ${rock.y})`} className={`map-object asteroid ${selected ? "is-selected" : ""}`}
    tabIndex={0} role="button" aria-label={`${rock.name}, ${FACTIONS[rock.owner]}, ${RESOURCE[rock.resource].name}`}
    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChoose(); } }}>
    <circle r={Math.max(26, rock.radius + 14)} fill="transparent" stroke="transparent" strokeWidth="28" vectorEffect="non-scaling-stroke" />
    {owned ? <circle r={rock.radius + 10} fill={`${COLORS[rock.owner]}0a`} stroke={COLORS[rock.owner]} strokeOpacity=".25" strokeWidth="1" /> : null}
    {selected ? <circle r={rock.radius + 17} fill="none" stroke="#e5c083" strokeWidth="2" strokeDasharray="8 5" className="selection-ring" /> : null}
    <polygon points={rockShape(rock)} fill={owned ? "#273a43" : "#22303b"} stroke={owned ? COLORS[rock.owner] : "#64707b"} strokeWidth={owned ? 2 : 1} />
    <path d={`M ${-rock.radius * .5} ${-rock.radius * .35} L ${rock.radius * .14} ${-rock.radius * .68} L ${rock.radius * .53} ${rock.radius * .1} L ${-rock.radius * .15} ${rock.radius * .4} Z`} fill="#92a2ac" opacity=".09" />
    <text y="5" fill={RESOURCE[rock.resource].color} textAnchor="middle" fontSize={owned ? 15 : 12} fontWeight="600">{RESOURCE[rock.resource].short}</text>
    {owned ? <>
      <g transform={`translate(${-rock.radius * .6} ${rock.radius * .65})`} fill={COLORS[rock.owner]}>
        <rect x="0" y="-5" width="6" height="8" rx="1" /><rect x="10" y="-2" width="8" height="5" rx="1" /><path d="M23,2 L23,-7 L28,-3 L28,2Z" />
      </g>
      <text y={rock.radius + 30} textAnchor="middle" fill={selected ? "#f3dfb7" : "#d4dbe0"} fontSize="14" letterSpacing="1.4" fontWeight="600">{rock.name.toUpperCase()}</text>
      <circle cy={-rock.radius - 8} r="4" fill={COLORS[rock.owner]} />
    </> : null}
    {rock.queue.length ? <circle r={rock.radius + 6} fill="none" stroke="#e5c083" strokeWidth="3" strokeDasharray={`${(rock.queue[0].work / rock.queue[0].total) * 2 * Math.PI * (rock.radius + 6)} 1000`} transform="rotate(-90)" /> : null}
    {rock.hullReady && rock.owner === 0 ? <circle cx={rock.radius + 4} cy={-rock.radius * .5} r="5" fill="#e5c083" className="ready-marker" /> : null}
  </g>;
}

function Vessel({ ship, selected, onChoose }: { ship: Ship; selected: boolean; onChoose: () => void }) {
  return <g data-kind="ship" data-id={ship.id} className={`map-object vessel ${selected ? "is-selected" : ""}`}
    style={{ transform: `translate(${ship.x}px, ${ship.y}px)` }} tabIndex={0} role="button"
    aria-label={`${ship.name}, ${FACTIONS[ship.owner]}, ${ship.kind}`}
    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChoose(); } }}>
    <circle r="23" fill="transparent" stroke="transparent" strokeWidth="28" vectorEffect="non-scaling-stroke" />
    {selected ? <circle r="21" fill="#e5c08312" stroke="#e5c083" strokeWidth="1.5" /> : null}
    <g transform={`rotate(${ship.heading})`}>
      <path d="M-7,-3 L-24,0 L-7,3" fill={COLORS[ship.owner]} opacity=".16" />
      {ship.kind === "warship" ? <path d="M13,0 L-8,-7 L-4,0 L-8,7 Z" fill={COLORS[ship.owner]} stroke="#e1ecee" strokeOpacity=".35" /> :
        <path d="M9,0 L3,-5 L-8,-5 L-10,0 L-8,5 L3,5 Z" fill={COLORS[ship.owner]} fillOpacity=".7" stroke={COLORS[ship.owner]} />}
    </g>
    {selected || ship.hp < ship.maxHp ? <><rect x="-17" y="-28" width="34" height="3" rx="1" fill="#41515d" /><rect x="-17" y="-28" width={34 * ship.hp / ship.maxHp} height="3" rx="1" fill={COLORS[ship.owner]} /></> : null}
    {selected ? <text y="37" fill="#e9d4ae" textAnchor="middle" fontSize="12">{ship.name}</text> : null}
    {ship.boarding > 0 ? <circle r="27" fill="none" stroke="#e5c083" strokeWidth="3" strokeDasharray={`${ship.boarding / 4 * 170} 170`} /> : null}
  </g>;
}

function Panel({ view, world, rock, run, close, selectShip }: { view: Exclude<View, null>; world: World; rock?: Rock;
  run: (action: (w: World) => string | null) => void; close: () => void; selectShip: (s: Ship) => void }) {
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus({ preventScroll: true });
    return () => { if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, [view]);
  const titles = { build: "Develop your colony", shipyard: "Construction harbour", reports: "Resource flows", fleet: "Your fleet", help: "Command the reach" };
  const local = (w: World) => w.rocks.find(r => r.id === rock?.id)!;
  const c = rock ? coverage(rock) : 1;
  const after = rock ? Math.min(1, Math.min(Math.max(0, rock.people - 5), housing(rock)) / Math.max(1, demand(rock))) : 0;
  return <section ref={panelRef} tabIndex={-1} className="detail-panel" role="dialog" aria-modal="false" aria-labelledby="panel-title">
    <header><div><span className="eyebrow">{view === "reports" ? "EMPIRE ECONOMY" : rock?.name.toUpperCase() ?? "ASTER GUILD"}</span><h2 id="panel-title">{titles[view]}</h2></div><button className="icon-button" onClick={close} aria-label="Close panel"><X size={19} /></button></header>
    <div className="panel-scroll">
      {view === "build" && rock ? <>
        <div className="panel-summary"><span><Users size={15} />{rock.people} / {demand(rock)} workers</span><strong>{pct(c)} staffing</strong></div>
        <p className="muted small">Each new building shares this asteroid’s workers. Housing fills gradually.</p>
        <div className="building-list">{(Object.keys(BUILDINGS) as Building[]).map(key => {
          const item = BUILDINGS[key];
          const reserved = rock.queue.reduce((n, p) => n + (p.kind === "interceptor" ? 0 : BUILDINGS[p.kind].slots), 0);
          const noSpace = slots(rock) + reserved + item.slots > rock.capacity;
          const staffing = Math.min(1, Math.min(rock.people, housing(rock)) / Math.max(1, demand(rock) + item.workers));
          return <button key={key} className="build-option" disabled={noSpace || world.credits < item.price || rock.alloys < item.alloys}
            onClick={() => run(w => build(w, local(w), key))}>
            <span className="build-icon">{key === "habitat" ? <House size={21} /> : key === "shipyard" ? <Rocket size={21} /> : <Factory size={21} />}</span>
            <span><strong>{item.name}<small> ×{rock.buildings[key]}</small></strong><span>{item.detail}</span><span className="build-price">{item.price} credits · {item.alloys} alloys · {item.slots} slots</span>
            <span className="build-impact">{noSpace ? "Not enough space" : `${pct(staffing)} staffing after completion`}</span></span><Plus size={18} />
          </button>;
        })}</div>
        {rock.queue.length ? <div className="queue-note"><Hammer size={15} />{rock.queue.length} queued · {Math.round(rock.queue[0].work / rock.queue[0].total * 100)}% complete</div> : null}
      </> : null}
      {view === "shipyard" && rock ? <>
        <div className="ship-illustration"><svg viewBox="0 0 260 85" aria-hidden="true"><path d="M24 38L80 28L118 10L159 30L238 43L157 54L121 73L83 54L24 50L59 44Z" fill="#d8c5a0" /><path d="M80 37L131 24L185 43L130 59L80 50L107 44Z" fill="#3f5660" /><path d="M12 38L56 42L12 50L32 44Z" fill="#7bd9bc" opacity=".7" /><path d="M117 38L160 43L116 50Z" fill="#eedbb9" /></svg></div>
        <div className="ship-heading"><h3>Guild interceptor</h3><span className="status-badge">{rock.hullReady ? "Hull ready" : rock.queue.some(p => p.kind === "interceptor") ? "Building" : "Build bay open"}</span></div>
        {rock.queue.some(p => p.kind === "interceptor") ? <progress aria-label="Hull construction" max={8} value={rock.queue.find(p => p.kind === "interceptor")!.work} /> : null}
        <p className="muted small">A swift patrol ship for escorts and intercepting trade.</p>
        <div className="crew-impact"><span className="eyebrow">CREW COMMITMENT</span><h3><Users size={20} />5 workers board the ship</h3><div><span>Workers ashore</span><strong>{rock.people} <ArrowRight size={14} /> {Math.max(0, rock.people - 5)}</strong></div><div><span>All building work rates</span><strong>{pct(c)} <ArrowRight size={14} /> <b className="gold">{pct(after)}</b></strong></div><p>Population grows back over time. Shipyard workers remain ashore.</p></div>
        <div className="support-line"><House size={16} />{rock.people} / {housing(rock)} residents <span className="mint">+{growthRate(rock).toFixed(2)}/min</span></div>
        {!rock.buildings.shipyard ? <p className="gold">Build a construction harbour here first.</p> : null}
        <button className="primary-button" disabled={!rock.buildings.shipyard || (rock.hullReady ? Math.min(rock.people, housing(rock)) < 5 : rock.queue.some(p => p.kind === "interceptor") || world.credits < 120 || rock.alloys < 6)}
          onClick={() => run(w => local(w).hullReady ? launch(w, local(w)) : buildHull(w, local(w)))}><Rocket size={19} />{rock.hullReady ? "Launch · 5 crew" : "Build hull · 120 credits + 6 alloys"}</button>
        <p className="muted small center">{rock.hullReady ? "Leave this hull here until you’re ready to launch." : "The completed hull waits for your launch order."}</p>
      </> : null}
      {view === "reports" ? <>
        <div className="report-window"><span className="live-dot" />{world.report.time ? `Last 10 seconds · updated at ${clock(world.report.time)}` : "Gathering the first 10 seconds of activity…"}</div>
        <div className="report-totals"><div><span>Extracted</span><strong>{world.report.extracted.toFixed(1)}<small> units</small></strong></div><div><span>Delivered</span><strong>{world.report.delivered.toFixed(0)}<small> cargo</small></strong></div></div>
        <h3>Colony throughput</h3><p className="muted small">Recorded mining rates in the latest interval.</p>
        {world.rocks.filter(r => r.owner === 0).map((r, i) => <div key={r.id} className="flow-row"><div><strong>{r.name}</strong><span>{(world.report.rates[i] ?? 0).toFixed(1)} {RESOURCE[r.resource].name.toLowerCase()}/min</span></div><meter min={0} max={Math.max(60, (world.report.rates[i] ?? 0))} value={world.report.rates[i] ?? 0} aria-label={`${r.name} mining rate`} /><small>{pct(coverage(r))} staffing now · {r.people}/{demand(r)} workers</small></div>)}
        <div className="report-note">The map continues while you inspect flows. Lower staffing affects every staffed building on that asteroid.</div>
      </> : null}
      {view === "fleet" ? <>
        <div className="fleet-metrics"><span>{world.ships.filter(s => s.owner === 0 && s.kind === "warship").length} warships</span><span>{world.ships.filter(s => s.owner === 0).reduce((n, s) => n + s.crew, 0)} crew aboard</span></div>
        {world.ships.filter(s => s.owner === 0).map(ship => <button key={ship.id} className="fleet-row" onClick={() => selectShip(ship)}><Navigation size={20} /><span><strong>{ship.name}</strong><small>{ship.kind === "warship" ? `${ship.crew} crew · ${ship.order?.kind ?? "holding position"}` : `${ship.cargo} cargo · ${ship.route ? "in transit" : "docked"}`}</small></span><span>{Math.round(ship.hp)}%</span><ChevronRight size={15} /></button>)}
        <h3 className="section-gap">Battle record</h3><div className="record-row"><span>Warships destroyed</span><strong>{world.kills}</strong></div><div className="record-row"><span>Trade captures / secured</span><strong>{world.captures} / {world.secured}</strong></div><div className="record-row"><span>Crew casualties</span><strong>{world.casualties}</strong></div>
      </> : null}
      {view === "help" ? <>
        <p className="intro-copy">An asteroid economy you command directly on a living map.</p>
        <ol className="help-steps"><li><strong>Explore the reach</strong><span>Drag to pan. Pinch or scroll to zoom. Tap an asteroid or ship to select it.</span></li><li><strong>Send your fleet</strong><span>Select a warship, choose an order, then tap its destination or target. Right-click is a desktop shortcut. Escape cancels.</span></li><li><strong>Grow your colony</strong><span>Select Kestrel to build housing or industry. More buildings share the same local workers.</span></li><li><strong>Launch an interceptor</strong><span>Open Kestrel’s shipyard. Five people board, and local staffing immediately falls.</span></li><li><strong>Protect or take a shipment</strong><span>Escort a friendly freighter, or intercept a rival’s freighter and return its cargo home.</span></li></ol>
        <div className="report-note">Interaction study 02. Building times are accelerated and supply is assumed healthy. This study starts over on reload.</div>
      </> : null}
    </div>
  </section>;
}

export default function MapStudy() {
  const [controller] = useState(createController);
  const world = useSyncExternalStore(controller.subscribe, controller.get, controller.get);
  const [selection, setSelection] = useState<Selection>({ kind: "rock", id: "kestrel" });
  const [view, setView] = useState<View>(null);
  const [mode, setMode] = useState<TargetMode>(null);
  const [paused, setPaused] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const camera = useRef<ReactZoomPanPinchRef>(null);
  const pointerStart = useRef<Point | null>(null);
  const pointers = useRef(new Set<number>());
  const dragged = useRef(false);
  const rock = selection?.kind === "rock" ? world.rocks.find(r => r.id === selection.id) : undefined;
  const ship = selection?.kind === "ship" ? world.ships.find(s => s.id === selection.id) : undefined;
  const fleet = selectedShips(world, selection);
  const home = world.rocks[0];
  const corsair = world.ships.find(s => s.id === "corsair");

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => { if (!document.hidden) controller.advance(); }, 100);
    return () => window.clearInterval(timer);
  }, [controller, paused]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const cancel = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMode(null); setView(null); }
    };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, []);
  useEffect(() => {
    if (selection?.kind === "ship" && !world.ships.some(s => s.id === selection.id)) {
      setSelection(null); setMode(null); setView(null);
    }
  }, [selection, world.ships]);

  const run = useCallback((action: (w: World) => string | null) => {
    const error = controller.command(action);
    if (error) setToast(error);
  }, [controller]);
  const focus = useCallback((p: Point, scale = .95, duration = 300) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (rect) camera.current?.setTransform(rect.width / 2 - p.x * scale, rect.height * .44 - p.y * scale, scale, duration);
  }, []);
  const choose = useCallback((kind: "rock" | "ship" | null, id: string | undefined, point: Point, shortcut = false) => {
    const snapshot = controller.get();
    const found = kind === "ship" ? snapshot.ships.find(s => s.id === id) : undefined;
    const selectedFleet = selectedShips(snapshot, selection);
    if (shortcut && selectedFleet.length) {
      const order: OrderKind = found && found.owner !== 0 ? "intercept" : found?.owner === 0 && found.kind === "freighter" ? "escort" : "move";
      const error = controller.command(w => issueOrder(w, selection, order, point, order === "move" ? undefined : found?.id));
      if (error) setToast(error);
      setMode(null); return;
    }
    if (mode) {
      const error = controller.command(w => mode === "route"
        ? kind === "rock" && selection?.kind === "rock"
          ? addRoute(w, w.rocks.find(r => r.id === selection.id)!, w.rocks.find(r => r.id === id)!)
          : "Choose a destination asteroid."
        : issueOrder(w, selection, mode, point, mode === "escort" || mode === "intercept" ? found?.id : undefined));
      if (error) setToast(error); else { setMode(null); setView(null); }
      return;
    }
    setSelection(kind && id ? { kind, id } : null);
    setView(null);
  }, [controller, selection, mode]);

  const mapClick = (event: MouseEvent<SVGSVGElement>, shortcut = false) => {
    if (shortcut) event.preventDefault();
    if (dragged.current) return;
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const object = (event.target as Element).closest<SVGGElement>("[data-kind]");
    choose(object?.dataset.kind as "rock" | "ship" | undefined ?? null, object?.dataset.id, point, shortcut);
  };
  const selectShip = (vessel: Ship) => { setSelection({ kind: "ship", id: vessel.id }); setMode(null); setView(null); focus(vessel); };
  const closePanel = useCallback(() => setView(null), []);
  const queueMode = (next: TargetMode) => { setMode(next); setView(null); };
  const modeText = mode === "route" ? "Choose an owned destination asteroid" : mode === "escort" ? "Tap a friendly freighter to escort" : mode === "intercept" ? "Tap a hostile ship to intercept" : mode === "patrol" ? "Tap the other end of your patrol" : "Tap anywhere to move your ships";

  return <main className="game-shell">
    <header className="command-header">
      <div className="brand-mark"><Sparkles size={25} /><div><span className="eyebrow">THE SHATTERED</span><strong>REACH</strong></div></div>
      <div className="hud-resources"><span title="Empire credits"><Coins size={16} /><b>{Math.floor(world.credits).toLocaleString("en-US")}</b><small>credits</small></span><span title="Local construction alloys"><Layers size={16} /><b>{Math.floor((rock?.owner === 0 ? rock : home).alloys)}</b><small>alloys</small></span><span className="population-hud" title="Residents across your colonies"><Users size={16} /><b>{world.rocks.filter(r => r.owner === 0).reduce((n, r) => n + r.people, 0)}</b><small>residents</small></span></div>
      <div className="header-controls"><span className="match-clock"><i className={paused ? "paused-dot" : "live-dot"} />{clock(world.time)}</span><button className="icon-button" aria-label={paused ? "Resume study" : "Pause study"} onClick={() => setPaused(p => !p)}>{paused ? <Play size={17} /> : <Pause size={17} />}</button><button className="icon-button help-toggle" aria-label="How to play" onClick={() => setView(v => v === "help" ? null : "help")}><CircleHelp size={19} /></button></div>
    </header>
    <div ref={mapRef} className={`map-area ${mode ? "targeting" : ""}`}
      onPointerDownCapture={event => { if (!pointers.current.size) { dragged.current = false; pointerStart.current = { x: event.clientX, y: event.clientY }; } pointers.current.add(event.pointerId); if (pointers.current.size > 1) dragged.current = true; }}
      onPointerMoveCapture={event => { if (pointers.current.size && pointerStart.current && Math.hypot(event.clientX - pointerStart.current.x, event.clientY - pointerStart.current.y) > 8) dragged.current = true; }}
      onPointerUpCapture={event => pointers.current.delete(event.pointerId)}
      onPointerCancelCapture={event => { pointers.current.delete(event.pointerId); dragged.current = true; }}>
      <TransformWrapper ref={camera} initialScale={.85} minScale={.35} maxScale={2.4} limitToBounds={false} doubleClick={{ disabled: true }} wheel={{ step: .12 }}
        onInit={() => { requestAnimationFrame(() => {
          const mobile = (mapRef.current?.clientWidth ?? 900) < 640;
          focus(mobile ? { x: 510, y: 480 } : { x: 720, y: 510 }, mobile ? .77 : .95, 0);
        }); }}>
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: WIDTH, height: HEIGHT }}>
          <svg ref={svgRef} width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-label="Live asteroid map. Select objects to issue orders." onClick={mapClick} onContextMenu={event => mapClick(event, true)}>
            <defs><pattern id="sector-grid" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M 120 0 L 0 0 0 120" fill="none" stroke="#68798d" strokeWidth=".5" opacity=".10" /></pattern></defs>
            <rect width={WIDTH} height={HEIGHT} fill="#101a22" /><rect width={WIDTH} height={HEIGHT} fill="url(#sector-grid)" />
            {Array.from({ length: 180 }, (_, i) => <circle key={`star-${i}`} cx={(i * 233 + 71) % WIDTH} cy={(i * 157 + 23) % HEIGHT} r={i % 5 ? .7 : 1.1} fill="#b1c0cb" opacity={i % 3 ? .14 : .3} pointerEvents="none" />)}
            <text x="170" y="505" className="sector-label">WESTERN REACH</text><text x="970" y="900" className="sector-label">CINDER PASSAGE</text><text x="835" y="90" className="sector-label">VESPER EXPANSE</text>
            {showRoutes ? world.ships.filter(s => s.route).map(s => {
              const from = world.rocks.find(r => r.id === s.route![0])!;
              const to = world.rocks.find(r => r.id === s.route![1])!;
              return <line key={`route-${s.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={COLORS[s.owner]} strokeWidth="1.3" strokeDasharray="4 7" strokeOpacity=".32" pointerEvents="none" />;
            }) : null}
            {fleet.filter(s => s.order).map(s => {
              const target = world.ships.find(t => t.id === s.order!.targetId) ?? s.order!.target;
              return <g key={`order-${s.id}`} pointerEvents="none"><line x1={s.x} y1={s.y} x2={target.x} y2={target.y} stroke="#e5c083" strokeDasharray="6 5" strokeOpacity=".8" /><circle cx={target.x} cy={target.y} r="12" fill="none" stroke="#e5c083" strokeDasharray="3 3" /></g>;
            })}
            {world.rocks.map(r => <Asteroid key={r.id} rock={r} selected={rock?.id === r.id} onChoose={() => choose("rock", r.id, r)} />)}
            {world.ships.map(s => <Vessel key={s.id} ship={s} selected={fleet.some(v => v.id === s.id) || ship?.id === s.id} onChoose={() => choose("ship", s.id, s)} />)}
            {world.beams.map(beam => <line key={beam.id} x1={beam.from.x} y1={beam.from.y} x2={beam.to.x} y2={beam.to.y} stroke={beam.hostile ? "#ffab7a" : "#bde9db"} strokeWidth="2" opacity=".8" pointerEvents="none" />)}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>

    <div className="map-heading"><span className="eyebrow">SECTOR 07 / ASTER GUILD</span><span className="study-tag">INTERACTION STUDY 02</span></div>
    {corsair && !mode && !view ? <button className="threat-chip" onClick={() => { setSelection({ kind: "ship", id: corsair.id }); focus(corsair); }}><Radar size={15} /><span>Pirate patrol near Cinder Passage</span><ChevronRight size={14} /></button> : null}
    {mode ? <div className="target-prompt" role="status"><Crosshair size={18} /><span>{modeText}</span><button className="icon-button" aria-label="Cancel order targeting" onClick={() => setMode(null)}><X size={18} /></button></div> : null}
    {paused ? <div className="paused-banner"><Pause size={14} /> Simulation paused <button onClick={() => setPaused(false)}>Resume</button></div> : null}

    <div className="map-tools"><button className="icon-button" aria-label="Zoom in" onClick={() => camera.current?.zoomIn(.2)}><Plus size={19} /></button><button className="icon-button" aria-label="Zoom out" onClick={() => camera.current?.zoomOut(.2)}><Minus size={19} /></button><button className="icon-button" aria-label="Focus home colony" onClick={() => { focus(home); setSelection({ kind: "rock", id: home.id }); setMode(null); }}><Expand size={18} /></button><button className={`icon-button ${showRoutes ? "active" : ""}`} aria-label="Show trade routes" aria-pressed={showRoutes} onClick={() => setShowRoutes(v => !v)}><Route size={18} /></button></div>

    {!view && !mode ? <div className="selection-dock">
      {rock ? <div className="selection-card"><div className="selection-title"><span className="resource-token" style={{ color: RESOURCE[rock.resource].color }}>{RESOURCE[rock.resource].short}</span><div><h1>{rock.name}</h1><span>{FACTIONS[rock.owner]} <i>·</i> {RESOURCE[rock.resource].name}</span></div><button className="icon-button" aria-label="Clear selection" onClick={() => setSelection(null)}><X size={17} /></button></div>
        {rock.owner === 0 ? <><div className="colony-stats"><span><Users size={14} /><strong>{rock.people}/{demand(rock)}</strong> workers</span><span className={coverage(rock) < 1 ? "gold" : "mint"}>{pct(coverage(rock))} staffing</span><span><House size={14} />{rock.people}/{housing(rock)}</span><span>{slots(rock)}/{rock.capacity} slots</span></div><div className="context-actions"><button onClick={() => setView("build")}><Hammer size={18} />Build</button><button className={rock.hullReady ? "ready-action" : ""} onClick={() => setView("shipyard")}><Rocket size={18} />Shipyard{rock.hullReady ? <i /> : null}</button><button onClick={() => queueMode("route")}><Route size={18} />Route</button></div></> : <div className="inspect-note">{rock.owner === 3 ? "Unclaimed deposit · infinite reserves" : "Rival colony · select a warship to engage its fleet"}</div>}
      </div> : ship || fleet.length ? <div className="selection-card"><div className="selection-title"><Navigation size={25} className="mint" /><div><h1>{selection?.kind === "fleet" ? `${fleet.length} warships selected` : ship?.name}</h1><span>{ship ? `${FACTIONS[ship.owner]} · ${ship.kind === "warship" ? `${ship.crew} crew aboard` : `${ship.cargo} ${RESOURCE[ship.cargoResource].name.toLowerCase()}`}` : "Aster Guild · fleet orders"}</span></div><button className="icon-button" aria-label="Clear selection" onClick={() => setSelection(null)}><X size={17} /></button></div>
        {fleet.length ? <div className="context-actions fleet-actions"><button onClick={() => queueMode("move")}><MoveUpRight size={18} />Move</button><button onClick={() => queueMode("patrol")}><Radar size={18} />Patrol</button><button onClick={() => queueMode("escort")}><Shield size={18} />Escort</button><button onClick={() => queueMode("intercept")}><Swords size={18} />Intercept</button><button onClick={() => { run(w => issueOrder(w, selection, "move", home)); }}><ArrowDownLeft size={18} />Return</button></div> : <div className="inspect-note">{ship?.owner === 0 ? "Select a warship and choose Escort to protect this shipment." : "Select your fleet, then Intercept and tap this vessel."}</div>}
      </div> : <div className="map-hint"><Compass size={17} />Tap a colony or ship. Drag to explore.</div>}
    </div> : null}

    {view ? <Panel view={view} world={world} rock={rock?.owner === 0 ? rock : undefined} run={run} close={closePanel} selectShip={selectShip} /> : null}
    <nav className="bottom-nav" aria-label="Game controls"><button className={!view && !mode ? "nav-active" : ""} onClick={() => { setView(null); setMode(null); }}><Compass size={20} /><span>Map</span></button><button onClick={() => { setSelection({ kind: "fleet" }); setView(null); setMode(null); }}><Crosshair size={20} /><span>Select fleet</span></button><button className={view === "fleet" ? "nav-active" : ""} onClick={() => { setView(v => v === "fleet" ? null : "fleet"); setMode(null); }}><Navigation size={20} /><span>Ships <small>{world.ships.filter(s => s.owner === 0 && s.kind === "warship").length}</small></span></button><button className={view === "reports" ? "nav-active" : ""} onClick={() => { setView(v => v === "reports" ? null : "reports"); setMode(null); }}><ChartNoAxesCombined size={20} /><span>Flows</span></button><button className="mobile-help" onClick={() => setView(v => v === "help" ? null : "help")}><CircleHelp size={20} /><span>Help</span></button></nav>
    <div className="event-line" aria-live="polite" aria-atomic="true">{toast ? <span className="toast-error">{toast}</span> : world.activities[0] ? <span><Check size={13} />{world.activities[0].text}</span> : null}</div>
  </main>;
}
