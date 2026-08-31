import { describe, expect, it } from 'vitest'

import { clamp, mixRgb, pointerTilt, splitPosition } from '../motionMath'

describe('clamp', () => {
  it('将值限制在给定范围内', () => {
    expect(clamp(8, 0, 4)).toBe(4)
  })
})

describe('splitPosition', () => {
  it('拆分相邻主题索引与插值进度', () => {
    expect(splitPosition(2.25, 5)).toEqual({ from: 2, to: 3, progress: 0.25 })
  })

  it('在末端保持最后一个主题且进度归零', () => {
    expect(splitPosition(4, 5)).toEqual({ from: 4, to: 4, progress: 0 })
  })

  it('在没有主题时保持安全的零位置', () => {
    expect(splitPosition(2, 0)).toEqual({ from: 0, to: 0, progress: 0 })
  })
})

describe('pointerTilt', () => {
  it('把归一化指针坐标映射到默认倾斜角度', () => {
    expect(pointerTilt(0, 0)).toEqual({ x: 1.5, y: -1.5 })
    expect(pointerTilt(1, 1)).toEqual({ x: -1.5, y: 1.5 })
    expect(pointerTilt(0.5, 0.5)).toEqual({ x: 0, y: 0 })
  })
})

describe('mixRgb', () => {
  it('逐通道混合并输出空格分隔的 CSS 颜色', () => {
    expect(mixRgb([0, 10, 20], [100, 110, 120], 0.5)).toBe('rgb(50 60 70)')
  })
})
