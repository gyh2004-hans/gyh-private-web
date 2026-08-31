import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export default function F1PhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.to('.photo-scene__smoke', {
      xPercent: 8,
      scale: 1.08,
      opacity: 0.48,
      duration: 6,
      stagger: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__heat', {
      x: () => gsap.utils.random(-1.5, 1.5),
      duration: 0.12,
      repeat: -1,
      yoyo: true,
      repeatRefresh: true,
      ease: 'sine.inOut',
    })
    gsap.fromTo(
      '.photo-scene__flash',
      { opacity: 0 },
      {
        opacity: () => gsap.utils.random(0.3, 0.7),
        duration: 0.08,
        repeat: -1,
        repeatDelay: () => gsap.utils.random(2.5, 6.9),
        repeatRefresh: true,
        stagger: 0.4,
        ease: 'power2.out',
      },
    )
  })

  return (
    <PhotoMotionScene theme={theme} active={active} progress={progress} sceneRef={sceneRef}>
      <div className="photo-scene__smoke photo-scene__smoke--one" aria-hidden="true" />
      <div className="photo-scene__smoke photo-scene__smoke--two" aria-hidden="true" />
      <div className="photo-scene__smoke photo-scene__smoke--three" aria-hidden="true" />
      <div className="photo-scene__heat" aria-hidden="true" />
      <div className="photo-scene__flash photo-scene__flash--one" aria-hidden="true" />
      <div className="photo-scene__flash photo-scene__flash--two" aria-hidden="true" />
    </PhotoMotionScene>
  )
}
