import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)

export function usePhotoSceneMotion(sceneRef, active, setup) {
  useGSAP(
    () => {
      if (!active) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', setup)

      return () => mm.revert()
    },
    {
      scope: sceneRef,
      dependencies: [active],
      revertOnUpdate: true,
    },
  )
}

export default function PhotoMotionScene({
  theme,
  active,
  progress,
  className = '',
  sceneRef,
  children,
}) {
  const srcSet = theme.sources.map(({ src, width }) => `${src} ${width}w`).join(', ')
  const classes = [`photo-scene`, `photo-scene--${theme.effect}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <section
      ref={sceneRef}
      className={classes}
      aria-label={`${theme.word} scene`}
      data-active={active ? 'true' : 'false'}
      style={{
        '--scene-progress': progress,
        '--scene-focus': theme.focus,
      }}
    >
      <img
        className="photo-scene__image"
        src={theme.sources[1].src}
        srcSet={srcSet}
        sizes="(max-width: 960px) 960px, (max-width: 1600px) 1600px, 2560px"
        alt=""
        draggable={false}
      />
      {children}
    </section>
  )
}
