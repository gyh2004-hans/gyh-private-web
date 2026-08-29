import crypto from "crypto";
import fs from "fs";
import path from "path";

const ROOT = "C:\\Users\\24939\\.zcode\\workspace\\default\\gyh-site\\public\\images\\cars";
const UA = { headers: { "User-Agent": "Mozilla/5.0 personal-site" } };

const FILES = [
  ["amg/amg-c63.jpg", ["Mercedes-AMG_C63_S_E_PERFORMANCE_(W206)_front.jpg", "Mercedes-AMG_C_63_S_E_Performance_(W206)_front.jpg"]],
  ["bmw-m/bmw-m3-g80.jpg", ["2023_BMW_M3_Competition_xDrive_Auto_1.jpg", "BMW_M3_Competition_(G80)_1X7A1573.jpg", "BMW_M3_(G80,_2022)_(52915614161).jpg"]],
  ["audi-rs/audi-rs6-avant.jpg", ["AUDI_RS6_AVANT_C8_China.jpg", "Audi_RS6_Avant_C8_IMG_5682.jpg", "Audi_RS6_Avant_C8_(2).jpg"]],
  ["gti/golf-gti-mk8.jpg", ["VW_Golf_GTI_(VIII)_\u2212_f_03012021.jpg", "VW_Golf_GTI_(VIII)_\u2013_f_03012021.jpg", "Volkswagen_Golf_GTI_(2021)_(52926196503).jpg"]],
  ["volvo/volvo-xc90.jpg", ["0_Volvo_XC90_II_3.jpg", "VOLVO_XC90_II_China_(8).jpg"]],
  ["volvo/volvo-v60-or-polestar.jpg", ["2021_Volvo_V60_Polestar_Engineered_T8_Recharge_AWD_Auto.jpg", "Volvo_V60_Polestar_Engineered_(SPA)_DSC_0746.jpg"]],
  ["supercar/ferrari-sf90.jpg", ["Ferrari_SF90_Stradale_4.jpg", "Ferrari_SF90_Stradale_in_Bridgehampton,_front_left.jpg", "Ferrari_SF90_Stradale_in_Böblingen_02.jpg"]],
  ["supercar/lamborghini-revuelto.jpg", ["Lamborghini_Huracan_STO_1X7A0297.jpg", "2021_Lamborghini_Huracan_STO_Launch_spec.jpg", "Lamborghini_Huracán_STO_IMG_9892.jpg"]],
  ["supercar/koenigsegg-jesko.jpg", ["2023_Koenigsegg_Jesko_Absolut.jpg", "2024_Koenigsegg_Jesko_Absolut.jpg"]],
];

const tryUrl = async (url) => {
  const res = await fetch(url, UA);
  const buf = Buffer.from(await res.arrayBuffer());
  if (res.ok && buf.length > 20000) return buf;
  return null;
};

for (const [dest, names] of FILES) {
  const out = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  let saved = false;
  for (const name of names) {
    // 方法1：MD5 直达路径
    const h = crypto.createHash("md5").update(name).digest("hex");
    const enc = encodeURIComponent(name);
    let buf = await tryUrl(`https://images.weserv.nl/?url=upload.wikimedia.org%2Fwikipedia%2Fcommons%2F${h[0]}%2F${h.slice(0, 2)}%2F${enc}&w=1600&output=jpg`);
    // 方法2：Special:FilePath 重定向
    if (!buf) {
      buf = await tryUrl(`https://images.weserv.nl/?url=commons.wikimedia.org%2Fwiki%2FSpecial%3AFilePath%2F${enc}&w=1600&output=jpg`);
    }
    if (buf) {
      fs.writeFileSync(out, buf);
      console.log("OK  ", dest, "<-", name, (buf.length / 1024).toFixed(0) + "KB");
      saved = true;
      break;
    }
    console.log("miss", name);
  }
  if (!saved) console.error("FAIL", dest);
}
