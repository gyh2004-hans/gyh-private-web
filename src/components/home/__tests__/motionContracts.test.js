import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const readScene = (name) =>
  readFileSync(resolve(process.cwd(), `src/components/home/scenes/${name}.jsx`), 'utf8')

describe('主页照片场景动态契约', () => {
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
