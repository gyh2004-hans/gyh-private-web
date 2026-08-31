import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export default function FishPhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.to('.photo-scene__particles', {
      yPercent: -8,
      duration: 9,
      repeat: -1,
      ease: 'none',
    })
    gsap.to('.photo-scene__caustics', {
      x: 8,
      y: 3,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  })

  return (
    <PhotoMotionScene theme={theme} active={active} progress={progress} sceneRef={sceneRef}>
      <div className="photo-scene__particles" aria-hidden="true" />
      <div className="photo-scene__caustics" aria-hidden="true" />
    </PhotoMotionScene>
  )
}
