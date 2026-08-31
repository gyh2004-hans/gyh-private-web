import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export default function ColnagoPhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.to('.photo-scene__grass-near', {
      xPercent: -16,
      duration: 1.4,
      repeat: -1,
      ease: 'none',
    })
    gsap.to('.photo-scene__grass-mid', {
      xPercent: -6,
      duration: 2.8,
      repeat: -1,
      ease: 'none',
    })
    gsap.to('.photo-scene__image', {
      y: 1,
      duration: 0.11,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  })

  return (
    <PhotoMotionScene theme={theme} active={active} progress={progress} sceneRef={sceneRef}>
      <div className="photo-scene__grass-mid" aria-hidden="true" />
      <div className="photo-scene__grass-near" aria-hidden="true" />
    </PhotoMotionScene>
  )
}
