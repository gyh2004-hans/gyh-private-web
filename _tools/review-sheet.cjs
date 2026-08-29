const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
(async () => {
  const ROOT = path.join(__dirname, "..", "public", "images");
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== "photos") walk(p); }
      else if (/\.(jpg|png|webp)$/i.test(e.name)) files.push(path.relative(ROOT, p).split(path.sep).join("/"));
    }
  };
  walk(ROOT);
  files.sort();
  const TW = 270, TH = 180, CAP = 22, COLS = 6, ROWS = 5, per = COLS * ROWS;
  for (let s = 0; s * per < files.length; s++) {
    const batch = files.slice(s * per, (s + 1) * per);
    const comps = [];
    for (let i = 0; i < batch.length; i++) {
      const buf = await sharp(path.join(ROOT, batch[i]), { failOn: "none" }).resize(TW, TH, { fit: "cover" }).jpeg({ quality: 70 }).toBuffer();
      const short = batch[i].length > 36 ? batch[i].slice(0, 18) + "…" + batch[i].slice(-17) : batch[i];
      const label = Buffer.from(`<svg width="${TW}" height="${CAP}"><rect width="100%" height="100%" fill="#111"/><text x="4" y="15" font-size="11" fill="#fff" font-family="Consolas">${short.replace(/&/g, "&amp;")}</text></svg>`);
      comps.push({ input: buf, left: (i % COLS) * (TW + 4) + 4, top: Math.floor(i / COLS) * (TH + CAP + 4) + 4 });
      comps.push({ input: label, left: (i % COLS) * (TW + 4) + 4, top: Math.floor(i / COLS) * (TH + CAP + 4) + 4 + TH });
    }
    const W = COLS * (TW + 4) + 4, H = Math.ceil(batch.length / COLS) * (TH + CAP + 4) + 4;
    await sharp({ create: { width: W, height: H, channels: 3, background: "#444" } }).composite(comps).jpeg({ quality: 78 }).toFile(path.join(__dirname, "thumbs", `rs${s + 1}.jpg`));
    console.log("rs" + (s + 1), batch.length);
  }
  console.log("total", files.length);
})();
