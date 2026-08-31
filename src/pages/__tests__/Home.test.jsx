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

  it('将主页入口抬离笔记本底座的遮挡区域', () => {
    const ctaRules = [...homeStyles.matchAll(/\.screen-experience__cta\s*\{([^}]*)\}/g)]
      .map((match) => match[1])
      .filter((rule) => /bottom:/.test(rule))

    expect(ctaRules).toHaveLength(2)
    expect(ctaRules.every((rule) => /bottom:\s*10%/.test(rule))).toBe(true)
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
