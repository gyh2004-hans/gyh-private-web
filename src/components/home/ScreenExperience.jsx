import OptionWheel from '../reactbits/OptionWheel/OptionWheel.jsx'
import SpecularButton from '../reactbits/SpecularButton/SpecularButton.jsx'
import ColnagoPhotoScene from './scenes/ColnagoPhotoScene.jsx'
import F1PhotoScene from './scenes/F1PhotoScene.jsx'
import FishPhotoScene from './scenes/FishPhotoScene.jsx'
import M4PhotoScene from './scenes/M4PhotoScene.jsx'
import PhotoPhotoScene from './scenes/PhotoPhotoScene.jsx'

const SCENES = [
  F1PhotoScene,
  M4PhotoScene,
  ColnagoPhotoScene,
  FishPhotoScene,
  PhotoPhotoScene,
]

export default function ScreenExperience({
  themes,
  active,
  onActiveChange,
  onPositionChange,
  onEnter,
}) {
  const activeWord = themes[active]?.word ?? ''

  return (
    <div className="screen-experience">
      <div className="screen-experience__words" aria-hidden="true">
        {themes.map((theme) => (
          <div key={theme.id} className="screen-experience__word-slot">
            {theme.word}
          </div>
        ))}
      </div>
      <div className="screen-experience__scenes" data-testid="photo-scenes">
        {themes.map((theme, index) => {
          const Scene = SCENES[index]
          return (
            <div key={theme.id} className="screen-experience__scene-slot">
              <Scene
                theme={theme}
                active={Math.abs(index - active) <= 1}
                progress={index - active}
              />
            </div>
          )
        })}
      </div>
      <div className="screen-experience__brand">GYH</div>
      <div className="screen-experience__wheel">
        <OptionWheel
          items={themes.map((theme) => theme.word)}
          defaultSelected={0}
          side="right"
          fontSize={1.45}
          spacing={1.45}
          curve={0.82}
          tilt={7}
          blur={1.5}
          fade={0.28}
          inset={20}
          onChange={onActiveChange}
          onPositionChange={onPositionChange}
        />
      </div>
      <div className="screen-experience__cta">
        <SpecularButton
          autoAnimate
          intensity={0.72}
          size="sm"
          radius={22}
          blur={10}
          tintOpacity={0.08}
          onClick={onEnter}
        >
          ENTER {activeWord}
        </SpecularButton>
      </div>
      <div className="screen-experience__glare" aria-hidden="true" />
    </div>
  )
}
