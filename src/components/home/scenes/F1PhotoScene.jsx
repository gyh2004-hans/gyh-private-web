import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { PhotoLayer, usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export default function F1PhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.to('.photo-scene__layer--smoke-back', {
      xPercent: 1.4,
      scale: 1.025,
      opacity: 0.5,
      duration: 8.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__layer--smoke-mid', {
      xPercent: 2.2,
      yPercent: -0.5,
      scale: 1.035,
      opacity: 0.64,
      duration: 6.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__layer--smoke-front', {
      xPercent: 3.2,
      yPercent: -0.8,
      scale: 1.045,
      opacity: 0.76,
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__layer--car', {
      x: 0.7,
      y: -0.8,
      rotation: 0.045,
      duration: 0.09,
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
      <PhotoLayer theme={theme} layer="smoke-back" />
      <PhotoLayer theme={theme} layer="smoke-mid" />
      <PhotoLayer theme={theme} layer="smoke-front" />
      <PhotoLayer theme={theme} layer="car" />
      <div className="photo-scene__heat" aria-hidden="true" />
      <div className="photo-scene__flash photo-scene__flash--one" aria-hidden="true" />
      <div className="photo-scene__flash photo-scene__flash--two" aria-hidden="true" />
    </PhotoMotionScene>
  )
}
