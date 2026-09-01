import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { HOME_THEMES } from '../homeThemes'

describe('HOME_THEMES', () => {
  it('按设计顺序定义主题文字和路由', () => {
    expect(HOME_THEMES.map(({ word }) => word)).toEqual([
      'F1',
      'M4',
      'COLNAGO',
      'FISH',
      'PHOTO',
    ])
    expect(HOME_THEMES.map(({ route }) => route)).toEqual([
      '/racing',
      '/cars',
      '/bikes',
      '/aqua',
      '/photo',
    ])
  })

  it('为每个主题提供三档可移植图片源', () => {
    for (const theme of HOME_THEMES) {
      expect(theme.sources.map(({ width }) => width)).toEqual([960, 1600, 2560])
      expect(theme.sources).toHaveLength(3)

      for (const { src } of theme.sources) {
        expect(src).not.toContain('C:\\')
        expect(src).not.toContain('/Users/')
      }
    }
  })

  it('保留主题的视觉元数据', () => {
    expect(HOME_THEMES.map(({ matte, focus, effect }) => ({ matte, focus, effect }))).toEqual([
      { matte: [24, 54, 56], focus: '50% 52%', effect: 'f1' },
      { matte: [141, 116, 31], focus: '50% 49%', effect: 'm4' },
      { matte: [182, 190, 190], focus: '43% 55%', effect: 'colnago' },
      { matte: [16, 45, 42], focus: '50% 54%', effect: 'fish' },
      { matte: [17, 56, 88], focus: '54% 48%', effect: 'photo' },
    ])
  })

  it('资产脚本只消费已验收 master，不重新生成或覆盖它们', () => {
    const script = readFileSync(
      resolve(process.cwd(), 'scripts/process-home-assets.mjs'),
      'utf8',
    )

    expect(script).toContain("resolve(derivedDir, 'f1-master.png')")
    expect(script).toContain("resolve(derivedDir, 'colnago-master.png')")
    expect(script).not.toMatch(/toFile\(resolve\(derivedDir, `\$\{name\}-master\.png`\)\)/)
  })
})
