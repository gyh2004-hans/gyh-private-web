import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { PhotoLayer, usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export default function ColnagoPhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.to('.photo-scene__grass-near', {
      xPercent: -1.8,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'none',
    })
    gsap.to('.photo-scene__grass-mid', {
      xPercent: -0.55,
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: 'none',
    })
    gsap.to('.photo-scene__layer--rider', {
      y: 0.8,
      rotation: 0.025,
      duration: 0.11,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__layer--wheel-rear, .photo-scene__layer--wheel-front', {
      rotation: 360,
      duration: 0.44,
      repeat: -1,
      ease: 'none',
    })
  })

  return (
    <PhotoMotionScene theme={theme} active={active} progress={progress} sceneRef={sceneRef}>
      <PhotoLayer theme={theme} layer="forest" className="photo-scene__grass-mid" />
      <PhotoLayer theme={theme} layer="grass-near" className="photo-scene__grass-near" />
      <PhotoLayer theme={theme} layer="rider" />
      <PhotoLayer theme={theme} layer="wheel-rear" />
      <PhotoLayer theme={theme} layer="wheel-front" />
    </PhotoMotionScene>
  )
}
