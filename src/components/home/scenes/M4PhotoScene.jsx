import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { PhotoLayer, usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export default function M4PhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.fromTo(
      '.photo-scene__layer--car',
      { x: -0.35, y: -0.45 },
      {
        x: 0.35,
        y: 0.45,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      },
    )
    gsap.to('.photo-scene__road-streak', {
      xPercent: 1.6,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'none',
    })
    gsap.to('.photo-scene__layer--wheel-left, .photo-scene__layer--wheel-right', {
      x: 0.8,
      skewY: 0.28,
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__paint-highlight', {
      xPercent: 45,
      duration: 4.5,
      delay: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  })

  return (
    <PhotoMotionScene theme={theme} active={active} progress={progress} sceneRef={sceneRef}>
      <PhotoLayer theme={theme} layer="background" />
      <PhotoLayer theme={theme} layer="road" className="photo-scene__road-streak" />
      <PhotoLayer theme={theme} layer="car" />
      <PhotoLayer theme={theme} layer="wheel-left" />
      <PhotoLayer theme={theme} layer="wheel-right" />
      <div className="photo-scene__paint-highlight" aria-hidden="true" />
    </PhotoMotionScene>
  )
}
