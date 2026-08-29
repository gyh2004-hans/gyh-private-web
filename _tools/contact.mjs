import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = "C:\\Users\\24939\\Desktop\\UI-picture";
const OUT = path.join(import.meta.dirname, "thumbs");
fs.mkdirSync(OUT, { recursive: true });

const TW = 320, TH = 214, CAP = 26; // thumb size + caption bar
const COLS = 5, ROWS = 4; // 20 per sheet

const files = fs.readdirSync(SRC).filter(f => /\.(jpe?g|png|webp|gif|bmp)$/i.test(f));

async function makeThumb(f) {
  const img = path.join(SRC, f);
  const base = sharp(img, { failOn: "none" }).rotate();
  const meta = await base.metadata();
  // fit cover into thumb
  const photo = await base.resize(TW, TH - 0, { fit: "cover" }).jpeg({ quality: 72 }).toBuffer();
  const short = f.length > 34 ? f.slice(0, 16) + "…" + f.slice(-16) : f;
  const label = Buffer.from(
    `<svg width="${TW}" height="${CAP}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="18" font-size="12" fill="#fff" font-family="Consolas,monospace">${short.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></svg>`
  );
  return sharp({ create: { width: TW, height: TH + CAP, channels: 3, background: "#111" } })
    .composite([{ input: photo, top: 0, left: 0 }, { input: label, top: TH, left: 0 }])
    .jpeg({ quality: 72 }).toBuffer();
}

const thumbs = [];
for (const f of files) {
  try { thumbs.push({ name: f, buf: await makeThumb(f) }); }
  catch (e) { console.error("SKIP", f, e.message); }
}

const per = COLS * ROWS;
for (let s = 0; s * per < thumbs.length; s++) {
  const batch = thumbs.slice(s * per, (s + 1) * per);
  const comps = batch.map((t, i) => ({
    input: t.buf,
    left: (i % COLS) * (TW + 4) + 4,
    top: Math.floor(i / COLS) * (TH + CAP + 4) + 4,
  }));
  const W = COLS * (TW + 4) + 4;
  const H = Math.ceil(batch.length / COLS) * (TH + CAP + 4) + 4;
  await sharp({ create: { width: W, height: H, channels: 3, background: "#333" } })
    .composite(comps).jpeg({ quality: 78 }).toFile(path.join(OUT, `sheet${s + 1}.jpg`));
  console.log(`sheet${s + 1}.jpg: ${batch.length} imgs`);
}
console.log("TOTAL", thumbs.length);
