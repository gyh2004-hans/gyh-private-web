// usage: node fetch_commons.mjs "<search query>" "<output path>" [resultIndex]
import fs from "fs";

const [query, outPath, idxArg] = process.argv.slice(2);
const idx = parseInt(idxArg || "0", 10);
const UA = "Mozilla/5.0 personal-site-asset-fetch";

const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1600&format=json`;

const res = await fetch(api, { headers: { "User-Agent": UA } });
const data = await res.json();
const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
// sort by search index
pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
const candidates = pages
  .filter(p => p.imageinfo && p.imageinfo[0])
  .map(p => ({ title: p.title, info: p.imageinfo[0] }))
  .filter(c => /image|jpeg|jpg/i.test(c.info.mime || ""));

if (!candidates.length) {
  console.error(`NOCANDIDATES ${query}`);
  process.exit(2);
}
for (const c of candidates) console.error(`  cand: ${c.title} ${c.info.width}x${c.info.height}`);
const pick = candidates[Math.min(idx, candidates.length - 1)];
const url = pick.info.thumburl || pick.info.url;
console.error(`PICK: ${pick.title} -> ${url}`);
const imgRes = await fetch(url, { headers: { "User-Agent": UA } });
if (!imgRes.ok) { console.error(`HTTP ${imgRes.status}`); process.exit(3); }
const buf = Buffer.from(await imgRes.arrayBuffer());
fs.writeFileSync(outPath, buf);
console.log(`SAVED ${outPath} ${(buf.length / 1024).toFixed(0)}KB from ${pick.title}`);
