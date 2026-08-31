import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import Home from '../Home.jsx'

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
})
