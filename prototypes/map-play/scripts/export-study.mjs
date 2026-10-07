import { build } from "esbuild";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const destination = path.resolve(root, "../../docs/design/round-02/playable-study.html");
const results = await Promise.all([
  build({ absWorkingDir: root, entryPoints: ["src/standalone.tsx"], bundle: true,
    minify: true, write: false, format: "iife", platform: "browser", target: "es2022",
    define: { "process.env.NODE_ENV": '"production"' }, legalComments: "inline" }),
  readFile(path.join(root, "app/globals.css"), "utf8").then(css =>
    postcss([tailwind({ base: root })]).process(css, { from: path.join(root, "app/globals.css") })),
]);
const script = results[0].outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const css = results[1].css.replace(/<\/style/gi, "<\\/style");
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#101a22"><title>The Shattered Reach · Interactive map study</title><style>${css}</style></head>
<body><div id="root"></div><noscript>This interactive study needs JavaScript enabled.</noscript><script>${script}</script></body></html>\n`;
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(`Exported ${destination} (${Math.round(Buffer.byteLength(html) / 1024)} KiB). Open directly in a browser; no server is required.`);
