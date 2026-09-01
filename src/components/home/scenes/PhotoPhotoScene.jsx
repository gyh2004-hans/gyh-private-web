import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { PhotoLayer, usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export default function PhotoPhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.to('.photo-scene__layer--clouds', {
      xPercent: 1.4,
      duration: 32,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__layer--reflection', {
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
    gsap.fromTo(
      '.photo-scene__city-light',
      { opacity: 0.34 },
      {
        opacity: () => gsap.utils.random(0.55, 0.95),
        duration: 0.12,
        repeat: -1,
        repeatDelay: () => gsap.utils.random(1.8, 5.6),
        repeatRefresh: true,
        stagger: 0.3,
      },
    )
  })

  return (
    <PhotoMotionScene theme={theme} active={active} progress={progress} sceneRef={sceneRef}>
      <PhotoLayer theme={theme} layer="clouds" />
      <PhotoLayer theme={theme} layer="reflection" />
      <div className="photo-scene__city-lights" aria-hidden="true">
        <i className="photo-scene__city-light photo-scene__city-light--tower" />
        <i className="photo-scene__city-light photo-scene__city-light--left" />
        <i className="photo-scene__city-light photo-scene__city-light--right" />
      </div>
      <div className="photo-scene__light-trail" aria-hidden="true" />
    </PhotoMotionScene>
  )
}
