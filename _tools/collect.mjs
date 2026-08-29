import fs from "fs";
import path from "path";

const SRC = "C:\\Users\\24939\\Desktop\\UI-picture";
const DEST = "C:\\Users\\24939\\.zcode\\workspace\\default\\gyh-site\\public\\images";

// file -> [destFolder, newName]
const MAP = {
  // ── Racing · F1 cars ──
  "1635040331178.png": ["racing/f1", "art-verstappen-hamilton.png"],
  "1e506365a4daf79568ad1ab5a6969784c1ab60f7_raw.jpg": ["racing/f1", "mercedes-halo-detail.jpg"],
  "36b488eb4958dcfa2ed8d834c09bdab199a94835_raw.jpg": ["racing/f1", "mercedes-spray.jpg"],
  "5d8634a7b699f69bf9a878465e98ec69281fb8bd_raw.jpg": ["racing/f1", "mercedes-night.jpg"],
  "71634c23f9f7a2e0bd27cb5024735dd418bbb4f5_raw.jpg": ["racing/f1", "redbull-donut.jpg"],
  "80a999aeb79f4473ecaa572769b8397263f9b840_raw.jpg": ["racing/f1", "mercedes-blur.jpg"],
  "84e5776cf427200eab3bf10f680e75ebdf4153f4_raw.jpg": ["racing/f1", "mercedes-track.jpg"],
  // ── Racing · drivers ──
  "2e1ac0c1f75d26fe6917af1a53c3253920aa5a47_raw.jpg": ["racing/drivers", "russell-paddock.jpg"],
  "ded7929a2d4f2509922fd3f6d0ec1747044a2c68_raw.jpg": ["racing/drivers", "vintage-warsteiner.jpg"],
  "eba7bdb88e66cfc3ee45c985df4d3abaf5f354b7_raw.jpg": ["racing/drivers", "hamilton-portrait.jpg"],
  "f4ab1088ac40995427e1b3fd737149fbd18eae73_raw.jpg": ["racing/drivers", "driver-race-suit.jpg"],
  "f9554edc3b3211bcfd6c1f23f32b9677469ef8fa_raw.jpg": ["racing/drivers", "hamilton-helmet.jpg"],
  "share_806dd27f8e5b12fe99dafddfa5870247.png": ["racing/drivers", "hamilton-garage.png"],
  "thumbmmexport7236f2618b082ae3e7d47b5b994dbf8f_1632665998966.jpeg": ["racing/drivers", "hamilton-100wins.jpg"],
  // ── Racing · GT3 ──
  "9bb6ea30cc052aba1f8c250ab093ac10.jpg": ["racing/gt3", "porsche-911gt3-rear.jpg"],
  "cc93d2aae990ad1b6c7f225cb3529d6be641d8e3_raw.jpg": ["racing/gt3", "gt-car-aerial.jpg"],
  "mmexport1638360586074.jpg": ["racing/gt3", "porsche-911gt3-art.jpg"],
  // ── Street cars ──
  "7d0bc959660dc895f74823c93ec417bc.jpg": ["cars/audi-rs", "rs7-sunset.jpg"],
  "88cc45fddb25e8d89f7bf72844c80005.jpg": ["cars/audi-rs", "abt-rs-grey.jpg"],
  "share_724e9176b3bce2a2a740bc19cc5b2e06_edit_220297783771592.png": ["cars/audi-rs", "abt-front-detail.png"],
  "Εа７ø车载音乐⚡️［持更］_109951167395215325.jpg": ["cars/amg", "amg-gt-black.jpg"],
  // ── Photo works: wildlife ──
  "20240921-_DSC5981.jpg": ["photos/wildlife", "eagle.jpg"],
  "20240921-_DSC6064.jpg": ["photos/wildlife", "elephant.jpg"],
  "20240921-_DSC6227.jpg": ["photos/wildlife", "swan.jpg"],
  "20240921-_DSC6341.jpg": ["photos/wildlife", "lemur.jpg"],
  "20240921-_DSC6401.jpg": ["photos/wildlife", "flamingo.jpg"],
  "20240921-_DSC6533.jpg": ["photos/wildlife", "crane.jpg"],
  // ── Photo works: night / events ──
  "20240810-_DSC0027.jpg": ["photos/night", "ferris-stars.jpg"],
  "20250210-_DSC1545.jpg": ["photos/night", "sparkler.jpg"],
  "20250606-_DSC6008.jpg": ["photos/city", "city-dusk.jpg"],
  "20250726-_DSC0863.jpg": ["photos/concert", "concert-laser.jpg"],
  "20250726-_DSC1171.jpg": ["photos/concert", "concert-stage.jpg"],
  "20250726-_DSC1646.jpg": ["photos/concert", "concert-splash.jpg"],
  "20250726-_DSC1848.jpg": ["photos/concert", "concert-piano.jpg"],
  "20250726-_DSC1879.jpg": ["photos/concert", "concert-piano-gold.jpg"],
  "20250726-_DSC2553.jpg": ["photos/concert", "concert-gem-neon.jpg"],
  "20250620-_DSC0047.jpg": ["photos/night", "night-market.jpg"],
  "20250620-_DSC0236.jpg": ["photos/night", "night-lights.jpg"],
  // ── Photo works: scenery / street ──
  "20250316-_DSC2451.jpg": ["photos/scenery", "blossom-sun.jpg"],
  "20250720-_DSC0385.jpg": ["photos/scenery", "temple-sky.jpg"],
  "20250720-_DSC0410.jpg": ["photos/city", "skyline-dusk.jpg"],
  "DSC_0687.jpg": ["photos/scenery", "sunset-pavilion.jpg"],
  "_DSC0006.jpg": ["photos/city", "tower-night.jpg"],
  "mmexport1721234293534.jpg": ["photos/city", "green-skyline.jpg"],
  "mmexport1721234304713.jpg": ["photos/scenery", "cloud-eave.jpg"],
  "mmexport1721234332742.jpg": ["photos/city", "street-bus.jpg"],
  "mmexport1721789549338.jpg": ["photos/city", "night-towers.jpg"],
  "mmexport1724079711821.jpg": ["photos/scenery", "cumulus.jpg"],
  "mmexport1734777523499.jpg": ["photos/scenery", "autumn-lake.jpg"],
  "mmexport1721790158789.jpg": ["photos/city", "cathedral.jpg"],
  // ── Photo works: flowers macro ──
  "_DSC0012-1.jpg": ["photos/flowers", "cosmos-field.jpg"],
  "_DSC0031-2.jpg": ["photos/flowers", "white-cosmos.jpg"],
  "_DSC0079-5.jpg": ["photos/flowers", "zinnia-mix.jpg"],
  "_DSC0099-7.jpg": ["photos/flowers", "zinnia-colors.jpg"],
  "_DSC0108-8.jpg": ["photos/flowers", "marigold-gold.jpg"],
  "_DSC8587-1.jpg": ["photos/flowers", "tulip-macro.jpg"],
  "_DSC8632-1.jpg": ["photos/flowers", "tulips-pink.jpg"],
  "_DSC7406-2.jpg": ["photos/flowers", "graffiti-day.jpg"],
  "_DSC7451-7.jpg": ["photos/flowers", "bokeh-pink.jpg"],
};

let ok = 0, miss = 0;
for (const [src, [folder, name]] of Object.entries(MAP)) {
  const from = path.join(SRC, src);
  const to = path.join(DEST, folder, name);
  if (!fs.existsSync(from)) { console.error("MISS", src); miss++; continue; }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  ok++;
}
console.log(`copied ${ok}, missing ${miss}`);
