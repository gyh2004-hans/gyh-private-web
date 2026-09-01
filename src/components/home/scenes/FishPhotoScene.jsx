import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { PhotoLayer, usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export const FISH_CAUSTICS_OFFSET = Object.freeze({ x: 7, y: 3 })

const PARTICLES = [
  [14, 24, 0.8, 11], [27, 67, 1.1, 15], [41, 19, 0.7, 13], [54, 46, 1.4, 18],
  [69, 28, 0.9, 12], [82, 71, 1.2, 17], [91, 38, 0.7, 14], [36, 82, 1.3, 19],
]

export default function FishPhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.to('.photo-scene__particle', {
      y: -16,
      x: 4,
      duration: 11,
      stagger: 0.7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__layer--plant-left, .photo-scene__layer--plant-right', {
      rotation: 0.35,
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__layer--fish-near', {
      x: 5,
      y: -2,
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__layer--fish-far', {
      x: 2.5,
      y: 1,
      duration: 5.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.photo-scene__caustics', {
      x: FISH_CAUSTICS_OFFSET.x,
      y: FISH_CAUSTICS_OFFSET.y,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  })

  return (
    <PhotoMotionScene theme={theme} active={active} progress={progress} sceneRef={sceneRef}>
      <PhotoLayer theme={theme} layer="plant-left" />
      <PhotoLayer theme={theme} layer="plant-right" />
      <PhotoLayer theme={theme} layer="fish-near" />
      <PhotoLayer theme={theme} layer="fish-far" />
      <div className="photo-scene__particles" aria-hidden="true">
        {PARTICLES.map(([x, y, size, duration], index) => (
          <i
            key={index}
            className="photo-scene__particle"
            style={{ '--particle-x': `${x}%`, '--particle-y': `${y}%`, '--particle-size': `${size}px`, '--particle-duration': `${duration}s` }}
          />
        ))}
      </div>
      <div className="photo-scene__caustics" aria-hidden="true" />
    </PhotoMotionScene>
  )
}
