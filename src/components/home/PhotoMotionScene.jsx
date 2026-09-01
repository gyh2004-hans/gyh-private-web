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

function responsiveImageProps(theme) {
  return {
    src: theme.sources[1].src,
    srcSet: theme.sources.map(({ src, width }) => `${src} ${width}w`).join(', '),
    sizes: '(max-width: 960px) 960px, (max-width: 1600px) 1600px, 2560px',
  }
}

export function PhotoLayer({ theme, layer, className = '' }) {
  return (
    <img
      {...responsiveImageProps(theme)}
      className={`photo-scene__layer photo-scene__layer--${layer} ${className}`.trim()}
      data-photo-layer={layer}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
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
        {...responsiveImageProps(theme)}
        className="photo-scene__image"
        alt=""
        draggable={false}
      />
      {children}
    </section>
  )
}
