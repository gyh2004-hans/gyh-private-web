import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const { rendererConstructor } = vi.hoisted(() => ({ rendererConstructor: vi.fn() }))

vi.mock('ogl', () => ({
  Renderer: class {
    constructor() {
      rendererConstructor()
      this.gl = {
        canvas: document.createElement('canvas'),
        BLEND: 1,
        ONE: 1,
        ONE_MINUS_SRC_ALPHA: 1,
        clearColor: vi.fn(),
        enable: vi.fn(),
        blendFunc: vi.fn(),
        getExtension: vi.fn(() => null),
      }
    }
    setSize() {}
    render() {}
  },
  Program: class {
    constructor(_gl, options) {
      this.uniforms = options.uniforms
    }
  },
  Mesh: class {},
  Triangle: class {
    constructor() {
      this.attributes = {}
    }
  },
  Color: class {
    set() {
      this.r = 1
      this.g = 1
      this.b = 1
    }
  },
}))

import SpecularButton from '../../reactbits/SpecularButton/SpecularButton.jsx'

describe('SpecularButton', () => {
  afterEach(() => {
    cleanup()
    rendererConstructor.mockClear()
    vi.restoreAllMocks()
  })

  it('减少动态偏好下保留按钮但不创建持续 WebGL 渲染器', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true })

    render(<SpecularButton autoAnimate>ENTER F1</SpecularButton>)

    expect(screen.getByRole('button', { name: 'ENTER F1' })).toBeInTheDocument()
    expect(rendererConstructor).not.toHaveBeenCalled()
  })
})
