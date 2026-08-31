export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function splitPosition(position, count) {
  const boundedPosition = clamp(position, 0, count - 1)
  const from = Math.floor(boundedPosition)
  const to = Math.min(count - 1, from + 1)

  return {
    from,
    to,
    progress: from === to ? 0 : boundedPosition - from,
  }
}

export function pointerTilt(normalizedX, normalizedY, maxTilt = 1.5) {
  const x = (0.5 - clamp(normalizedY, 0, 1)) * maxTilt * 2
  const y = (clamp(normalizedX, 0, 1) - 0.5) * maxTilt * 2

  return {
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3)),
  }
}

export function mixRgb(from, to, progress) {
  const amount = clamp(progress, 0, 1)
  const channels = from.map((channel, index) =>
    Math.round(channel + (to[index] - channel) * amount),
  )

  return `rgb(${channels.join(' ')})`
}
