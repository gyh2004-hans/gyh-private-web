import { useRef, useState } from 'react'

import { useWipe } from '../App.jsx'
import { HOME_THEMES } from '../components/home/homeThemes.js'
import LaptopStage from '../components/home/LaptopStage.jsx'
import ScreenExperience from '../components/home/ScreenExperience.jsx'

export default function Home() {
  const [active, setActive] = useState(0)
  const positionRef = useRef(0)
  const stageRef = useRef(null)
  const wipe = useWipe()

  const handlePositionChange = (position) => {
    positionRef.current = position
  }

  const handleEnter = () => {
    const theme = HOME_THEMES[active]
    wipe(theme.route, theme.word)
  }

  return (
    <LaptopStage rootRef={stageRef} background="rgb(24 54 56)">
      <ScreenExperience
        themes={HOME_THEMES}
        active={active}
        onActiveChange={setActive}
        onPositionChange={handlePositionChange}
        onEnter={handleEnter}
      />
    </LaptopStage>
  )
}
