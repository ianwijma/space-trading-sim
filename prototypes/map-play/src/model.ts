// Local interaction-study fixture. This is not the authoritative multiplayer engine.
export type Point = { x: number; y: number };
export type Resource = "ore" | "ice" | "silicon" | "crystal";
export type Building = "habitat" | "mine" | "harbour" | "warehouse" | "shipyard" | "farm";
export type OrderKind = "move" | "patrol" | "escort" | "intercept";
export type Order = { kind: OrderKind; target: Point; targetId?: string; origin?: Point };
export type Project = { kind: Building | "interceptor"; work: number; total: number };
export type Rock = Point & {
  id: string; name: string; owner: number; resource: Resource; radius: number; capacity: number;
  people: number; growth: number; buildings: Record<Building, number>;
  ore: number; alloys: number; queue: Project[]; hullReady: boolean;
};
export type Ship = Point & {
  id: string; name: string; owner: number; kind: "warship" | "freighter";
  hp: number; maxHp: number; crew: number; heading: number; order?: Order;
  route?: [string, string]; leg: number; boarding: number; cargo: number;
  cargoResource: Resource; captured: boolean;
};
export type Selection = { kind: "rock" | "ship"; id: string } | { kind: "fleet" } | null;
export type Activity = { id: number; time: number; text: string; point?: Point };
export type Beam = { id: string; from: Point; to: Point; hostile: boolean };
export type FlowReport = { time: number; extracted: number; delivered: number; rates: number[] };
export type World = {
  time: number; economyTick: number; credits: number; serial: number;
  rocks: Rock[]; ships: Ship[]; activities: Activity[]; beams: Beam[];
  kills: number; captures: number; secured: number; casualties: number;
  extracted: number; delivered: number; report: FlowReport;
};

export const WIDTH = 1440;
export const HEIGHT = 1020;
export const COLORS = ["#7bd9bc", "#ee846f", "#b6a0e7", "#dfbd78"];
export const FACTIONS = ["Aster Guild", "Ironwake", "Vesper Union", "Unclaimed"];
export const RESOURCE: Record<Resource, { name: string; short: string; color: string }> = {
  ore: { name: "Metal ore", short: "Fe", color: "#b6c0c8" },
  ice: { name: "Ice", short: "H₂O", color: "#89c7e0" },
  silicon: { name: "Silicon", short: "Si", color: "#e3b78b" },
  crystal: { name: "Crystals", short: "◆", color: "#b8a0dd" },
};
export const BUILDINGS: Record<Building, { name: string; workers: number; slots: number; price: number; alloys: number; detail: string }> = {
  habitat: { name: "Habitat", workers: 0, slots: 2, price: 100, alloys: 4, detail: "+30 beds · fills gradually" },
  mine: { name: "Mining rig", workers: 5, slots: 1, price: 80, alloys: 3, detail: "+30 raw/min · 5 workers" },
  harbour: { name: "Freight harbour", workers: 4, slots: 2, price: 120, alloys: 5, detail: "+60 cargo/min · 4 workers" },
  warehouse: { name: "Warehouse", workers: 1, slots: 1, price: 70, alloys: 3, detail: "+300 storage · 1 worker" },
  shipyard: { name: "Construction harbour", workers: 6, slots: 3, price: 180, alloys: 8, detail: "+1 build bay · 6 workers" },
  farm: { name: "Hydroponics", workers: 4, slots: 2, price: 90, alloys: 4, detail: "+24 food/min · 4 workers" },
};
const EMPTY_BUILDINGS: Record<Building, number> = { habitat: 0, mine: 0, harbour: 0, warehouse: 0, shipyard: 0, farm: 0 };
export function demand(rock: Rock) {
  return (Object.keys(BUILDINGS) as Building[]).reduce((n, key) => n + rock.buildings[key] * BUILDINGS[key].workers, 0);
}
export function housing(rock: Rock) { return rock.buildings.habitat * 30; }
export function coverage(rock: Rock) { return demand(rock) ? Math.min(1, Math.min(rock.people, housing(rock)) / demand(rock)) : 1; }
export function slots(rock: Rock) {
  return 1 + (Object.keys(BUILDINGS) as Building[]).reduce((n, key) => n + rock.buildings[key] * BUILDINGS[key].slots, 0);
}
export function growthRate(rock: Rock) {
  const h = housing(rock);
  if (!h || rock.people >= h) return 0;
  const x = rock.people / h;
  return h * (0.03 + 0.18 * x) * (1 - x);
}
export function distance(a: Point, b: Point) { return Math.hypot(a.x - b.x, a.y - b.y); }
export function selectedShips(world: World, selection: Selection) {
  return world.ships.filter(s => s.owner === 0 && s.kind === "warship" &&
    (selection?.kind === "fleet" || (selection?.kind === "ship" && selection.id === s.id)));
}
function note(world: World, text: string, point?: Point) {
  world.activities = [{ id: ++world.serial, time: world.time, text, point }, ...world.activities].slice(0, 8);
}
function makeRock(id: string, name: string, x: number, y: number, resource: Resource, owner: number, radius = 30): Rock {
  return { id, name, x, y, resource, owner, radius, capacity: 18, people: owner === 3 ? 0 : 20,
    growth: 0, ore: 86, alloys: 32, queue: [], hullReady: id === "kestrel",
    buildings: owner === 3 ? { ...EMPTY_BUILDINGS } : { habitat: 1, mine: 1, harbour: 1, warehouse: 1, shipyard: id === "kestrel" ? 1 : 0, farm: id === "kestrel" ? 1 : 0 } };
}
function makeShip(id: string, name: string, owner: number, kind: Ship["kind"], p: Point): Ship {
  return { id, name, owner, kind, ...p, hp: kind === "warship" ? 100 : 65, maxHp: kind === "warship" ? 100 : 65,
    crew: kind === "warship" ? 5 : 0, heading: 0, leg: 1, boarding: 0, cargo: 0, cargoResource: "ore", captured: false };
}
function loadCargo(world: World, ship: Ship, rock: Rock) {
  ship.cargoResource = rock.resource;
  ship.cargo = Math.min(8, Math.floor(rock.ore));
  rock.ore -= ship.cargo;
}
export function createWorld(): World {
  const rocks = [
    makeRock("kestrel", "Kestrel", 510, 565, "ore", 0, 43),
    makeRock("veil", "Veil", 375, 290, "ice", 0, 34),
    makeRock("ashgate", "Ashgate", 755, 725, "silicon", 0, 35),
    makeRock("ironwake", "Ironwake", 1050, 420, "ore", 1, 43),
    makeRock("cinder", "Cinder", 1030, 770, "crystal", 1, 31),
    makeRock("vesper", "Vesper", 965, 170, "silicon", 2, 37),
    makeRock("lumen", "Lumen", 1240, 195, "ice", 2, 29),
  ];
  const resources: Resource[] = ["ore", "ice", "silicon", "crystal"];
  for (let i = 0; i < 90; i++) {
    const p = { x: 70 + ((i * 173 + (i % 3) * 47) % 1290), y: 75 + ((i * 131 + (i % 5) * 37) % 875) };
    if (rocks.some(r => distance(p, r) < r.radius + 68)) continue;
    rocks.push(makeRock(`rock-${i}`, `Reach ${i + 1}`, p.x, p.y, resources[i % 4], 3, 13 + i % 15));
  }
  const ships = [makeShip("meridian", "Meridian", 0, "warship", { x: 595, y: 505 }),
    makeShip("swift", "Swift", 0, "warship", { x: 570, y: 630 }),
    makeShip("aurora", "Aurora", 0, "warship", { x: 445, y: 475 }),
    makeShip("corsair", "Red Corsair", 1, "warship", { x: 970, y: 515 })];
  ships[3].order = { kind: "patrol", origin: { x: 970, y: 515 }, target: { x: 825, y: 625 } };
  const world: World = { time: 0, economyTick: 0, credits: 1240, serial: 100, rocks, ships, activities: [], beams: [],
    kills: 0, captures: 0, secured: 0, casualties: 0, extracted: 0, delivered: 0,
    report: { time: 0, extracted: 0, delivered: 0, rates: [] } };
  for (const [i, from, to, owner] of [[0, "veil", "kestrel", 0], [1, "kestrel", "ashgate", 0], [2, "ironwake", "cinder", 1], [3, "vesper", "lumen", 2]] as const) {
    const start = rocks.find(r => r.id === from)!;
    const ship = makeShip(`freight-${i}`, ["Waterline", "Guild Runner", "Red Caravan", "Vesper Courier"][i], owner, "freighter", start);
    ship.route = [from, to];
    loadCargo(world, ship, start);
    world.ships.push(ship);
  }
  note(world, "Kestrel's interceptor is ready to crew and launch.", rocks[0]);
  return world;
}
function move(ship: Ship, target: Point, dt: number, speed = 36) {
  const d = distance(ship, target);
  ship.heading = Math.atan2(target.y - ship.y, target.x - ship.x) * 180 / Math.PI;
  const fraction = Math.min(1, speed * dt / Math.max(0.001, d));
  ship.x += (target.x - ship.x) * fraction;
  ship.y += (target.y - ship.y) * fraction;
  return d < Math.max(5, speed * dt);
}
export function issueOrder(world: World, selection: Selection, kind: OrderKind, point: Point, targetId?: string) {
  const fleet = selectedShips(world, selection);
  if (!fleet.length) return "Select one of your warships first.";
  const target = world.ships.find(s => s.id === targetId);
  if (kind === "escort" && (!target || target.owner !== 0 || target.kind !== "freighter")) return "Choose one of your freighters to escort.";
  if (kind === "intercept" && (!target || target.owner === 0)) return "Choose a hostile vessel to intercept.";
  fleet.forEach((ship, index) => {
    ship.order = { kind, target: { x: Math.max(20, Math.min(WIDTH - 20, point.x + index * 16)), y: Math.max(20, Math.min(HEIGHT - 20, point.y)) },
      targetId, origin: { x: ship.x, y: ship.y } };
    ship.boarding = 0;
  });
  note(world, `${fleet.length === 1 ? fleet[0].name : `${fleet.length} ships`}: ${kind} order accepted.`, point);
  return null;
}
export function build(world: World, rock: Rock, kind: Building) {
  if (rock.owner !== 0) return "Choose an owned asteroid.";
  const item = BUILDINGS[kind];
  const reserved = rock.queue.reduce((sum, p) => sum + (p.kind === "interceptor" ? 0 : BUILDINGS[p.kind].slots), 0);
  if (slots(rock) + reserved + item.slots > rock.capacity) return "There isn't enough construction space.";
  if (world.credits < item.price || rock.alloys < item.alloys) return "More credits or local alloys are needed.";
  world.credits -= item.price;
  rock.alloys -= item.alloys;
  rock.queue.push({ kind, work: 0, total: 6 });
  note(world, `${rock.name}: ${item.name.toLowerCase()} queued.`, rock);
  return null;
}
export function buildHull(world: World, rock: Rock) {
  if (rock.owner !== 0 || !rock.buildings.shipyard) return "A local construction harbour is required.";
  if (rock.hullReady || rock.queue.some(p => p.kind === "interceptor")) return "The build bay already has a hull.";
  if (world.credits < 120 || rock.alloys < 6) return "120 credits and 6 local alloys are needed.";
  world.credits -= 120;
  rock.alloys -= 6;
  rock.queue.push({ kind: "interceptor", work: 0, total: 8 });
  note(world, `${rock.name}: interceptor hull under construction.`, rock);
  return null;
}
export function launch(world: World, rock: Rock) {
  if (rock.owner !== 0 || !rock.hullReady) return "There is no completed local hull.";
  if (Math.min(rock.people, housing(rock)) < 5) return "Waiting for a full crew of 5 housed residents.";
  rock.people -= 5;
  rock.hullReady = false;
  const ship = makeShip(`ship-${++world.serial}`, `Lancer ${world.serial - 100}`, 0, "warship", { x: rock.x + 58, y: rock.y + 10 });
  world.ships.push(ship);
  note(world, `${ship.name} launched. ${rock.name} staffing: ${Math.round(coverage(rock) * 100)}%.`, rock);
  return null;
}
export function addRoute(world: World, source: Rock, destination: Rock) {
  if (source.owner !== 0 || destination.owner !== 0 || source.id === destination.id) return "Choose a different owned asteroid.";
  const ship = world.ships.find(s => s.owner === 0 && s.kind === "freighter" && s.route?.includes(source.id));
  if (!ship) return "No available freighter serves this asteroid.";
  // Keep the hull and cargo in place. Redirect its existing physical journey.
  ship.route = [source.id, destination.id];
  ship.leg = 1;
  note(world, `${ship.name} rerouted: ${source.name} → ${destination.name}.`, destination);
  return null;
}
export function step(world: World, dt: number) {
  world.time += dt;
  world.beams = [];
  if (Math.floor(world.time) > world.economyTick) {
    world.economyTick = Math.floor(world.time);
    for (const rock of world.rocks) {
      if (rock.owner === 3) continue;
      const c = coverage(rock);
      const extracted = rock.buildings.mine * 30 * c / 60;
      rock.ore += extracted;
      if (rock.owner === 0) world.extracted += extracted;
      rock.growth += growthRate(rock) / 60;
      if (rock.people >= housing(rock)) rock.growth = 0;
      if (rock.growth >= 1) { rock.people++; rock.growth -= 1; }
      const project = rock.queue[0];
      if (project) {
        project.work += project.kind === "interceptor" ? c * rock.buildings.shipyard : 1;
        if (project.work >= project.total) {
          if (project.kind === "interceptor") rock.hullReady = true;
          else rock.buildings[project.kind]++;
          rock.queue.shift();
          if (rock.owner === 0) note(world, `${rock.name}: ${project.kind === "interceptor" ? "hull ready for crew" : `${BUILDINGS[project.kind].name} completed`}.`, rock);
        }
      }
    }
    if (world.economyTick % 10 === 0) {
      world.report = { time: world.economyTick, extracted: world.extracted, delivered: world.delivered,
        rates: world.rocks.filter(r => r.owner === 0).map(r => 30 * r.buildings.mine * coverage(r)) };
      world.extracted = 0;
      world.delivered = 0;
    }
  }
  for (const ship of world.ships) {
    if (ship.hp <= 0) continue;
    if (ship.kind === "freighter" && ship.route) {
      const target = world.rocks.find(r => r.id === ship.route![ship.leg]);
      if (target && move(ship, target, dt, 24)) {
        if (ship.owner === 0) world.delivered += ship.cargo;
        // The study reports cargo delivered; processed destination goods are abstracted.
        ship.cargo = 0;
        if (ship.captured) {
          ship.route = undefined;
          ship.captured = false;
          world.secured++;
          note(world, `${ship.name}: captured cargo secured at ${target.name}.`, target);
        } else { ship.leg = 1 - ship.leg; loadCargo(world, ship, target); }
      }
    }
    if (ship.kind === "warship") {
      const enemy = world.ships.find(s => s.kind === "warship" && s.owner !== ship.owner && s.hp > 0 && distance(s, ship) < 95);
      if (enemy) {
        enemy.hp = Math.max(0, enemy.hp - dt * 6);
        enemy.boarding = 0;
        if (Math.floor(world.time * 5) % 3 === 0) world.beams.push({ id: ship.id, from: { ...ship }, to: { ...enemy }, hostile: ship.owner !== 0 });
        if (enemy.hp === 0) {
          if (ship.owner === 0) world.kills++;
          if (enemy.owner === 0) world.casualties += enemy.crew;
          note(world, `${enemy.name} destroyed${enemy.owner === 0 ? ` · ${enemy.crew} crew lost` : ""}.`, enemy);
        }
      }
    }
    const order = ship.order;
    if (!order) continue;
    const targetShip = order.targetId ? world.ships.find(s => s.id === order.targetId && s.hp > 0) : undefined;
    if (order.targetId && !targetShip) { ship.order = undefined; continue; }
    if (order.kind === "escort" && targetShip) {
      if (targetShip.owner !== ship.owner) { ship.order = undefined; continue; }
      if (distance(ship, targetShip) > 32) move(ship, { x: targetShip.x - 25, y: targetShip.y + 25 }, dt, 43);
    } else if (order.kind === "intercept" && targetShip) {
      if (ship.owner === targetShip.owner) { ship.order = undefined; continue; }
      if (distance(ship, targetShip) > 38) { move(ship, targetShip, dt, 55); ship.boarding = 0; }
      else if (targetShip.kind === "freighter") {
        ship.boarding += dt;
        if (ship.boarding >= 4) {
          targetShip.owner = ship.owner;
          targetShip.captured = true;
          const home = world.rocks.find(r => r.owner === ship.owner)!;
          targetShip.route = [home.id, home.id]; targetShip.leg = 1;
          ship.order = undefined; ship.boarding = 0;
          if (ship.owner === 0) world.captures++;
          note(world, `${targetShip.name} captured; returning with its cargo.`, targetShip);
        }
      }
    } else {
      if (move(ship, order.target, dt, 48)) {
        if (order.kind === "patrol") { const p = order.target; order.target = order.origin!; order.origin = p; }
        else ship.order = undefined;
      }
    }
  }
  world.ships = world.ships.filter(s => s.hp > 0);
}
