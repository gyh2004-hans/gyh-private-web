import { useRef } from 'react'
import { gsap } from 'gsap'

import PhotoMotionScene, { usePhotoSceneMotion } from '../PhotoMotionScene.jsx'

export default function M4PhotoScene({ theme, active, progress }) {
  const sceneRef = useRef(null)

  usePhotoSceneMotion(sceneRef, active, () => {
    gsap.fromTo(
      '.photo-scene__image',
      { rotation: -0.35, transformOrigin: '50% 75%' },
      {
        rotation: 0.35,
        transformOrigin: '50% 75%',
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      },
    )
    gsap.to('.photo-scene__road-streak', {
      xPercent: 18,
      duration: 1.2,
      repeat: -1,
      ease: 'none',
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
      <div className="photo-scene__road-streak" aria-hidden="true" />
      <div className="photo-scene__paint-highlight" aria-hidden="true" />
    </PhotoMotionScene>
  )
}
