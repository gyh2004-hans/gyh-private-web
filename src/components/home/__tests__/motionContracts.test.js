import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const readScene = (name) =>
  readFileSync(resolve(process.cwd(), `src/components/home/scenes/${name}.jsx`), 'utf8')

describe('主页照片场景动态契约', () => {
  it('所有主体动态层都复用原照片，而不是用通用渐变冒充内容分层', () => {
    const contracts = {
      F1PhotoScene: ['smoke-back', 'smoke-mid', 'smoke-front', 'car'],
      M4PhotoScene: ['background', 'car', 'wheel-left', 'wheel-right'],
      ColnagoPhotoScene: ['forest', 'grass-near', 'rider', 'wheel-rear', 'wheel-front'],
      FishPhotoScene: ['plant-left', 'plant-right', 'fish-near', 'fish-far'],
      PhotoPhotoScene: ['clouds', 'reflection'],
    }

    for (const [scene, layers] of Object.entries(contracts)) {
      const source = readScene(scene)
      for (const layer of layers) {
        expect(source).toContain(`<PhotoLayer theme={theme} layer=\"${layer}\"`)
      }
    }
  })

  it('COLNAGO 与 FISH 不再使用规则重复纹理制造草地和焦散', () => {
    const styles = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8')
    const causticsRule = styles.match(/\.photo-scene__caustics\s*\{([^}]*)\}/)?.[1] ?? ''

    expect(styles).not.toMatch(/photo-scene__grass-(?:near|mid)[\s\S]{0,500}repeating-linear-gradient/)
    expect(causticsRule).not.toContain('repeating-radial-gradient')
    expect(causticsRule).not.toContain('radial-gradient')
  })

  it('M4 路面拖影往返运动，避免循环末端跳回', () => {
    expect(readScene('M4PhotoScene')).toMatch(
      /gsap\.to\('\.photo-scene__road-streak',\s*\{(?=[^}]*repeat:\s*-1)(?=[^}]*yoyo:\s*true)[^}]*\}/,
    )
  })

  it('COLNAGO 前后景草地均往返运动，保持视差连续', () => {
    const source = readScene('ColnagoPhotoScene')
    expect(source).toMatch(
      /gsap\.to\('\.photo-scene__grass-near',\s*\{(?=[^}]*repeat:\s*-1)(?=[^}]*yoyo:\s*true)[^}]*\}/,
    )
    expect(source).toMatch(
      /gsap\.to\('\.photo-scene__grass-mid',\s*\{(?=[^}]*repeat:\s*-1)(?=[^}]*yoyo:\s*true)[^}]*\}/,
    )
  })
})
