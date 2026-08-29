import crypto from "crypto";
import fs from "fs";
import path from "path";

const ROOT = "C:\\Users\\24939\\.zcode\\workspace\\default\\gyh-site\\public\\images\\cars";
const FILES = [
  ["amg/amg-c63.jpg", "Mercedes-AMG_C63_S_E_PERFORMANCE_(W206)_front.jpg"],
  ["amg/amg-a45.jpg", "Mercedes-AMG_A_45_S_4MATIC+_(W177)_1X7A0312.jpg"],
  ["bmw-m/bmw-m3-g80.jpg", "2023_BMW_M3_Competition_xDrive_Auto_1.jpg"],
  ["bmw-m/bmw-m4-g82.jpg", "BMW_M4_Competition_Coupé_G82_front_view.jpg"],
  ["bmw-m/bmw-m5-g90.jpg", "BMW_M5_(G90)_DSC_6010.jpg"],
  ["audi-rs/audi-rs6-avant.jpg", "Audi_RS6_Avant_C8_(2).jpg"],
  ["audi-rs/audi-rs3.jpg", "Audi_RS3_8Y_IMG_9723.jpg"],
  ["audi-rs/audi-etron-gt.jpg", "Audi_RS_e-tron_GT_2024.jpg"],
  ["gti/golf-gti-mk8.jpg", "VW_Golf_GTI_(VIII)_–_f_03012021.jpg"],
  ["gti/golf-gti-clubsport.jpg", "VW_Golf_VIII_GTI_Clubsport.jpg"],
  ["volvo/volvo-xc90.jpg", "VOLVO_XC90_II_China_(8).jpg"],
  ["volvo/volvo-v60-or-polestar.jpg", "Volvo_V60_Polestar_Engineered_(SPA)_DSC_0746.jpg"],
  ["supercar/ferrari-sf90.jpg", "Ferrari_SF90_Stradale_in_Böblingen_02.jpg"],
  ["supercar/lamborghini-revuelto.jpg", "2021_Lamborghini_Huracan_STO_Launch_spec.jpg"],
  ["supercar/mclaren-750s.jpg", "McLaren_750S.jpg"],
  ["supercar/porsche-911-gt3rs.jpg", "Porsche_911_GT3_RS_(2023).jpg"],
  ["supercar/koenigsegg-jesko.jpg", "2024_Koenigsegg_Jesko_Absolut.jpg"],
];

for (const [dest, name] of FILES) {
  const h = crypto.createHash("md5").update(name).digest("hex");
  const enc = encodeURIComponent(name).replace(/%2B/g, "%2B");
  const url = `https://images.weserv.nl/?url=upload.wikimedia.org%2Fwikipedia%2Fcommons%2F${h[0]}%2F${h.slice(0, 2)}%2F${enc}&w=1600&output=jpg`;
  const out = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 personal-site" } });
  const buf = Buffer.from(await res.arrayBuffer());
  if (res.ok && buf.length > 20000) {
    fs.writeFileSync(out, buf);
    console.log("OK  ", dest, (buf.length / 1024).toFixed(0) + "KB");
  } else {
    console.error("FAIL", dest, res.status, buf.length + "B");
  }
}
