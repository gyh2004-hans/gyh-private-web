import fs from "fs";
import path from "path";

const BASE = "https://cdn.jsdelivr.net/gh/DavidHDev/react-bits@main/public/r";
const DEST = "C:\\Users\\24939\\.zcode\\workspace\\default\\gyh-site\\src\\components\\reactbits";
fs.mkdirSync(DEST, { recursive: true });

const WANT = process.argv.slice(2);
const j = async (u) => (await fetch(u)).json();

const reg = await j(`${BASE}/registry.json`);
const deps = new Set();
for (const name of WANT) {
  const item = reg.items.find(i => i.name === `${name}-JS-TW`);
  if (!item) { console.error("NOT FOUND", name); continue; }
  const meta = await j(`${BASE}/${item.name}.json`);
  for (const f of meta.files) {
    const fp = path.join(DEST, f.path);
    fs.mkdirSync(path.dirname(fp), { recursive: true });
    fs.writeFileSync(fp, f.content);
    console.log("wrote", f.path);
  }
  (meta.dependencies || []).forEach(d => deps.add(d));
}
console.log("DEPS:", [...deps].join(" "));
