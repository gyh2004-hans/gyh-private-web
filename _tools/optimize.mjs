import sharp from "sharp";
import fs from "fs";
import path from "path";

const dir = process.argv[2];
if (!dir) { console.error("usage: node optimize.mjs <folder>"); process.exit(1); }

const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
for (const f of files) {
  const p = path.join(dir, f);
  const buf = fs.readFileSync(p);
  if (buf.length < 1024) { console.error("TOO SMALL, removing", f); fs.unlinkSync(p); continue; }
  try {
    const img = sharp(buf, { failOn: "none" });
    const meta = await img.metadata();
    if (!meta.width) throw new Error("not an image");
    const needsResize = meta.width > 1920;
    const isPng = /\.png$/i.test(f);
    let out;
    if (isPng) {
      // keep png but cap size
      out = await (needsResize ? img.resize({ width: 1920, withoutEnlargement: true }) : img)
        .png({ compressionLevel: 9 }).toBuffer();
    } else {
      out = await (needsResize ? img.rotate().resize({ width: 1920, withoutEnlargement: true }) : img.rotate())
        .jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    }
    if (out.length < buf.length) fs.writeFileSync(p, out);
    console.log(`${f}  ${(buf.length/1024).toFixed(0)}KB -> ${(Math.min(out.length, buf.length)/1024).toFixed(0)}KB  ${meta.width}w`);
  } catch (e) {
    console.error("INVALID, removing", f, e.message);
    fs.unlinkSync(p);
  }
}
console.log("done", dir);
