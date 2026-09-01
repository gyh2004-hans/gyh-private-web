import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { gsap } from 'gsap'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Home from '../Home.jsx'
import { FISH_CAUSTICS_OFFSET } from '../../components/home/scenes/FishPhotoScene.jsx'
import homeStyles from '../../styles/global.css?raw'

const { wipeMock } = vi.hoisted(() => ({
  wipeMock: vi.fn(),
}))

vi.mock('../../App.jsx', () => ({
  useWipe: () => wipeMock,
}))

vi.mock('../../components/reactbits/SpecularButton/SpecularButton.jsx', () => ({
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}))

describe('Home', () => {
  beforeEach(() => {
    wipeMock.mockClear()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('将水族焦散的合成位移限制在 8px 内', () => {
    expect(Math.hypot(FISH_CAUSTICS_OFFSET.x, FISH_CAUSTICS_OFFSET.y)).toBeLessThanOrEqual(8)
  })

  it('呈现笔记本主页的品牌、主题滚轮与首个主题入口', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByText('GYH')).toBeInTheDocument()
    expect(screen.getByRole('listbox', { name: /option wheel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ENTER F1' })).toBeInTheDocument()
    expect(screen.queryByText('MENU')).not.toBeInTheDocument()
  })

  it('按计划定位桌面端与移动端主页入口', () => {
    const ctaRules = [...homeStyles.matchAll(/\.screen-experience__cta\s*\{([^}]*)\}/g)]
      .map((match) => match[1])
      .filter((rule) => /bottom:/.test(rule))

    expect(ctaRules).toHaveLength(2)
    expect(ctaRules[0]).toMatch(/bottom:\s*6%/)
    expect(ctaRules[1]).toMatch(/bottom:\s*5%/)
  })

  it('在窄竖屏中以视口高度放大笔记本并保持可视区裁切', () => {
    expect(homeStyles).toMatch(
      /@media\s*\(max-width:\s*720px\)[\s\S]*?\.home-v3__device\s*\{[^}]*width:\s*max\(125vw,\s*105vh\)/,
    )
    expect(homeStyles).toMatch(/\.home-v3\s*\{[^}]*overflow:\s*hidden/)
  })

  it('在 768px 竖屏验收尺寸中继续使用高度驱动的样机几何', () => {
    expect(homeStyles).toMatch(
      /@media\s*\(min-width:\s*721px\)\s*and\s*\(max-width:\s*900px\)\s*and\s*\(orientation:\s*portrait\)[\s\S]*?\.home-v3__device\s*\{[^}]*width:\s*max\(125vw,\s*105vh\)/,
    )
    expect(homeStyles).toMatch(
      /@media\s*\(min-width:\s*721px\)\s*and\s*\(max-width:\s*900px\)\s*and\s*\(orientation:\s*portrait\)[\s\S]*?\.home-v3__desk\s*\{[^}]*height:\s*50%/,
    )
  })

  it('下移底座以避开主页入口', () => {
    expect(homeStyles).toMatch(/\.home-v3__base\s*\{[^}]*bottom:\s*-4%/)
  })

  it('在移动端抬高台面可见上沿', () => {
    expect(homeStyles).toMatch(
      /@media\s*\(max-width:\s*720px\)[\s\S]*?\.home-v3__desk\s*\{[^}]*height:\s*50%/,
    )
  })

  it('让主题滚轮的交互层覆盖整个笔记本屏幕', () => {
    expect(homeStyles).toMatch(
      /\.screen-experience__wheel\s*\{[^}]*inset:\s*0[^}]*width:\s*auto/,
    )
    expect(homeStyles).toMatch(
      /@media\s*\(max-width:\s*720px\)[\s\S]*?\.screen-experience__wheel\s*\{(?=[^}]*width:\s*100vw)(?=[^}]*left:\s*50%)(?=[^}]*transform:\s*translateX\(-50%\))[^}]*\}/,
    )
  })

  it('将巨型主题字融入背景并避让照片主体', () => {
    expect(homeStyles).toMatch(
      /\.screen-experience__words\s*\{[^}]*mix-blend-mode:\s*normal[^}]*mask-image:\s*radial-gradient\([^;]*rgba\(0,\s*0,\s*0,\s*0\.58\)\s*0\s*28%/,
    )
  })

  it('场景带中的每张照片始终可见，active 仅控制动态启停', () => {
    expect(homeStyles).toMatch(/\.photo-scene\s*\{[^}]*opacity:\s*1/)
    expect(homeStyles).not.toMatch(/\.photo-scene\[data-active="true"\]\s*\{/)
  })

  it('挂载五组真实照片动态场景', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    const view = within(container)

    for (const label of ['F1 scene', 'M4 scene', 'COLNAGO scene', 'FISH scene', 'PHOTO scene']) {
      expect(view.getByLabelText(label)).toBeInTheDocument()
    }
  })

  it('uses the Specular Button as the only entry action', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const enterButton = screen.getByRole('button', { name: 'ENTER F1' })

    fireEvent.keyDown(enterButton, { key: 'Enter' })
    expect(wipeMock).not.toHaveBeenCalled()

    fireEvent.click(enterButton)

    expect(wipeMock).toHaveBeenCalledWith('/racing', 'F1')
    expect(wipeMock).toHaveBeenCalledTimes(1)
  })

  it('enters the active theme when Enter is pressed outside an editable field', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    fireEvent.keyDown(window, { key: 'Enter' })

    expect(wipeMock).toHaveBeenCalledWith('/racing', 'F1')
  })

  it('enters the active theme when Enter is pressed on the wheel', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const wheel = screen.getByRole('listbox', { name: /option wheel/i })
    fireEvent.keyDown(wheel, { key: 'ArrowDown' })
    fireEvent.keyDown(wheel, { key: 'Enter' })

    expect(wipeMock).toHaveBeenCalledWith('/cars', 'M4')
  })

  it('does not rewrite theme CSS variables while the wheel position is unchanged', () => {
    const tickerCallbacks = []
    vi.spyOn(gsap.ticker, 'add').mockImplementation((callback) => {
      tickerCallbacks.push(callback)
    })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(tickerCallbacks).toHaveLength(1)
    const setPropertySpy = vi.spyOn(CSSStyleDeclaration.prototype, 'setProperty')

    tickerCallbacks[0]()
    const writesAfterFirstTick = setPropertySpy.mock.calls.length
    tickerCallbacks[0]()

    expect(writesAfterFirstTick).toBe(3)
    expect(setPropertySpy).toHaveBeenCalledTimes(writesAfterFirstTick)
  })
})
