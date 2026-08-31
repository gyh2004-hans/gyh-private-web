import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const assetRoot = resolve(projectRoot, 'src/assets/home')
const originalDir = resolve(assetRoot, 'original')
const derivedDir = resolve(assetRoot, 'derived')

const masters = [
  { name: 'f1', source: 'f1.jpg' },
  { name: 'colnago', source: 'colnago.jpg' },
]

const responsiveSources = [
  { name: 'f1', source: resolve(derivedDir, 'f1-master.png') },
  { name: 'm4', source: resolve(originalDir, 'm4.jpg') },
  { name: 'colnago', source: resolve(derivedDir, 'colnago-master.png') },
  { name: 'fish', source: resolve(originalDir, 'fish.jpg') },
  { name: 'photo', source: resolve(originalDir, 'photo.jpg') },
]

const widths = [960, 1600, 2560]

await mkdir(derivedDir, { recursive: true })

for (const { name, source } of masters) {
  const sourcePath = resolve(originalDir, source)
  const { width, height } = await sharp(sourcePath).metadata()

  if (!width || !height) {
    throw new Error(`无法读取原图尺寸：${sourcePath}`)
  }

  await sharp(sourcePath)
    .resize({
      width: width * 2,
      height: height * 2,
      fit: 'fill',
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(resolve(derivedDir, `${name}-master.png`))
}

for (const { name, source } of responsiveSources) {
  for (const width of widths) {
    await sharp(source)
      .resize({ width, withoutEnlargement: false, fit: 'inside' })
      .webp({
        quality: width === 2560 ? 88 : 82,
        smartSubsample: true,
      })
      .toFile(resolve(derivedDir, `${name}-${width}.webp`))
  }
}

console.log(`已生成 ${masters.length} 个 2× master 和 ${responsiveSources.length * widths.length} 个 WebP。`)
