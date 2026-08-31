import OptionWheel from '../reactbits/OptionWheel/OptionWheel.jsx'
import SpecularButton from '../reactbits/SpecularButton/SpecularButton.jsx'

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
      <div className="screen-experience__word" aria-hidden="true">
        {activeWord}
      </div>
      <div className="screen-experience__scenes" data-testid="photo-scenes" />
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
