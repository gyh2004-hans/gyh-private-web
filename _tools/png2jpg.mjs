import sharp from "sharp";
import fs from "fs";

const jobs = [
  ["public/images/racing/f1/art-verstappen-hamilton.png", "public/images/racing/f1/art-verstappen-hamilton.jpg"],
  ["public/images/cars/audi-rs/abt-front-detail.png", "public/images/cars/audi-rs/abt-front-detail.jpg"],
];
for (const [src, dst] of jobs) {
  await sharp(src, { failOn: "none" }).rotate().jpeg({ quality: 82, mozjpeg: true }).toFile(dst);
  fs.unlinkSync(src);
  console.log("converted", dst);
}
