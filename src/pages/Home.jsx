import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

import { useWipe } from '../App.jsx'
import { HOME_THEMES } from '../components/home/homeThemes.js'
import LaptopStage from '../components/home/LaptopStage.jsx'
import { mixRgb, splitPosition } from '../components/home/motionMath.js'
import ScreenExperience from '../components/home/ScreenExperience.jsx'

export default function Home() {
  const [active, setActive] = useState(0)
  const positionRef = useRef(0)
  const stageRef = useRef(null)
  const wipe = useWipe()

  const handleEnter = useCallback(() => {
    const theme = HOME_THEMES[active]
    wipe(theme.route, theme.word)
  }, [active, wipe])

  useEffect(() => {
    const tick = () => {
      const stage = stageRef.current
      if (!stage) return

      const position = positionRef.current
      const { from, to, progress } = splitPosition(position, HOME_THEMES.length)

      stage.style.setProperty('--theme-position', String(position))
      stage.style.setProperty('--theme-progress', String(progress))
      stage.style.setProperty(
        '--home-matte',
        mixRgb(HOME_THEMES[from].matte, HOME_THEMES[to].matte, progress),
      )
    }

    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const isEditable =
        target instanceof Element &&
        target.closest("input, textarea, [contenteditable='true']")

      if (event.key !== 'Enter' || isEditable) return

      event.preventDefault()
      handleEnter()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleEnter])

  return (
    <LaptopStage
      rootRef={stageRef}
      background={mixRgb(HOME_THEMES[0].matte, HOME_THEMES[0].matte, 0)}
    >
      <ScreenExperience
        themes={HOME_THEMES}
        active={active}
        onActiveChange={setActive}
        onPositionChange={(position) => {
          positionRef.current = position
        }}
        onEnter={handleEnter}
      />
    </LaptopStage>
  )
}
