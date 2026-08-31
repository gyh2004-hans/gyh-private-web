import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Home from '../Home.jsx'
import { FISH_CAUSTICS_OFFSET } from '../../components/home/scenes/FishPhotoScene.jsx'

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

    fireEvent.click(screen.getByRole('button', { name: 'ENTER F1' }))

    expect(wipeMock).toHaveBeenCalledWith('/racing', 'F1')
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
})
