import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

import { pointerTilt } from './motionMath.js'

gsap.registerPlugin(useGSAP)

export default function LaptopStage({ background, children, rootRef }) {
  const internalStageRef = useRef(null)
  const stageRef = rootRef ?? internalStageRef
  const deviceRef = useRef(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const stage = stageRef.current
      const device = deviceRef.current
      if (!stage || !device) return

      const setRotateX = gsap.quickTo(device, '--pointer-rx', {
        duration: 0.55,
        ease: 'power3.out',
      })
      const setRotateY = gsap.quickTo(device, '--pointer-ry', {
        duration: 0.55,
        ease: 'power3.out',
      })

      const handlePointerMove = (event) => {
        const bounds = stage.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return

        const normalizedX = (event.clientX - bounds.left) / bounds.width
        const normalizedY = (event.clientY - bounds.top) / bounds.height
        const tilt = pointerTilt(normalizedX, normalizedY)

        setRotateX(tilt.x)
        setRotateY(tilt.y)
      }

      const handlePointerLeave = () => {
        setRotateX(0)
        setRotateY(0)
      }

      stage.addEventListener('pointermove', handlePointerMove)
      stage.addEventListener('pointerleave', handlePointerLeave)

      return () => {
        stage.removeEventListener('pointermove', handlePointerMove)
        stage.removeEventListener('pointerleave', handlePointerLeave)
      }
    },
    { scope: stageRef },
  )

  return (
    <main
      ref={stageRef}
      className="home-v3"
      data-lenis-prevent
      style={{ '--home-matte': background }}
    >
      <div className="home-v3__grain" aria-hidden="true" />
      <div className="home-v3__desk" aria-hidden="true" />
      <div ref={deviceRef} className="home-v3__device">
        <div className="home-v3__lid">
          <div className="home-v3__screen">{children}</div>
        </div>
        <div className="home-v3__base" aria-hidden="true" />
      </div>
    </main>
  )
}
