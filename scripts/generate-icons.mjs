import sharp from "sharp";
import { mkdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "p ublic", "icons");
const svgPath = path.join(iconsDir, "icon.svg");

async function main() {
  await mkdir(iconsDir, { recursive: true });
  const svg = await readFile(svgPath, "utf8");
  const buffer = Buffer.from(svg);

  await sharp(buffer).resize(192, 192).png().toFile(path.join(iconsDir, "icon-192.png"));
  await sharp(buffer).resize(512, 512).png().toFile(path.join(iconsDir, "icon-512.png"));

  console.log("Icons generated from icon.svg!");
}

main().catch(console.error);
