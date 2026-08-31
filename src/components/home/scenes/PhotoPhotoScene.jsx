import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export default function PhotoPhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.to('.photo-scene__cloud', {
      xPercent: 12,
      duration: 32,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__reflection', {
      scaleY: 1.04,
      opacity: 0.32,
      duration: 3.4,
      delay: 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.fromTo(
      '.photo-scene__light-trail',
      { scaleX: 0.15 },
      {
        scaleX: 1,
        duration: 12,
        delay: 1.9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      },
    )
  })

  return (
    <PhotoMotionScene theme={theme} active={active} progress={progress} sceneRef={sceneRef}>
      <div className="photo-scene__cloud" aria-hidden="true" />
      <div className="photo-scene__reflection" aria-hidden="true" />
      <div className="photo-scene__light-trail" aria-hidden="true" />
    </PhotoMotionScene>
  )
}
