import { useEffect, useRef } from 'react'

type Theme = 'light' | 'dark'
type RGB = [number, number, number]
type Koi = {
  x: number; y: number; heading: number; speed: number; length: number
  nodes: Float32Array; spine: Float32Array
  seed: number; variety: number; depth: number; curiosity: number
  tailPhase: number; beat: number; finPhase: number; turn: number
  nextBurst: number; burstUntil: number; wander: number
}
type Ripple = { x: number; y: number; age: number }
type ClickTarget = { x: number; y: number; age: number }
type Palette = { bg: RGB; white: RGB; red: RGB; black: RGB; fin: RGB; eye: RGB; tile: [number, number]; hi: RGB[]; ink: number }
type Hit = { s: number; v: number; a: number; across: number; part: string; tx: number; ty: number }

const NODE_COUNT = 20
const GLYPHS = 't%SX8@x+*.:;'
const EDGE_GLYPHS = '.,:;/\\-'
const TAU = Math.PI * 2
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const smoothstep = (start: number, end: number, value: number) => {
  const t = clamp((value - start) / (end - start), 0, 1)
  return t * t * (3 - 2 * t)
}
const angleDiff = (from: number, to: number) => Math.atan2(Math.sin(to - from), Math.cos(to - from))
const mix = (a: RGB, b: RGB, amount: number): RGB => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * amount)) as RGB
const shade = (color: RGB, amount: number): RGB => color.map((channel) => Math.round(clamp(channel * amount, 0, 255))) as RGB
const cssColor = ([r, g, b]: RGB) => `rgb(${r}, ${g}, ${b})`

function ramp(stops: RGB[], amount: number): RGB {
  const position = clamp(amount, 0, 1) * (stops.length - 1)
  const index = Math.min(stops.length - 2, Math.floor(position))
  return mix(stops[index], stops[index + 1], position - index)
}

function hash(a: number, b: number, c: number, time = 0) {
  const value = Math.sin(a * 78.233 + b * 127.1 + c * 311.7 + time * 39.425) * 43758.5453
  return value - Math.floor(value)
}

function paletteFor(theme: Theme): Palette {
  return theme === 'light'
    ? {
        bg: [245, 244, 241], white: [112, 108, 104], red: [204, 62, 28], black: [36, 33, 40],
        fin: [138, 132, 126], eye: [24, 22, 26], tile: [0.78, 0.55],
        hi: [[138, 24, 22], [184, 38, 24], [222, 62, 28], [238, 100, 38], [244, 140, 66], [248, 176, 116]], ink: 0.45,
      }
    : {
        bg: [26, 25, 33], white: [236, 228, 218], red: [232, 96, 56], black: [92, 90, 108],
        fin: [214, 206, 198], eye: [20, 20, 26], tile: [0.68, 0.98],
        hi: [[112, 22, 24], [168, 34, 28], [214, 58, 30], [240, 96, 34], [250, 138, 52], [255, 178, 96]], ink: 0.42,
      }
}

function bodyHalfWidth(s: number) {
  const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
  if (s < 0.12) return 0.11 * Math.pow(Math.sin((s / 0.12 * Math.PI) / 2), 0.55)
  if (s < 0.3) return 0.11 + 0.025 * smooth(0.12, 0.3, s)
  return 0.033 + 0.102 * (1 - smooth(0.3, 0.74, s))
}

function inFin(s: number, across: number, root: number, reach: number, width: number, angle: number) {
  const rootAcross = bodyHalfWidth(root) * 0.85
  const alongDelta = s - root
  const acrossDelta = across - rootAcross
  const along = alongDelta * Math.cos(angle) + acrossDelta * Math.sin(angle) - reach
  const side = -alongDelta * Math.sin(angle) + acrossDelta * Math.cos(angle)
  return (along / reach) ** 2 + (side / width) ** 2 <= 1
}

function classify(s: number, v: number, past: number, ahead: number, lateral: number, side: number, koi: Koi): Hit | null {
  const across = Math.abs(v)
  const halfWidth = bodyHalfWidth(s)
  const a = across / halfWidth
  let part = ''
  if (ahead > 0) {
    if (ahead < 0.05 && Math.abs(lateral - (0.045 + ahead * 0.7)) < 0.016) part = 'barbel'
  } else if (s >= 0 && s <= 0.74 && across <= halfWidth) {
    if (s > 0.055 && s < 0.105 && a > 0.48 && a < 0.86) part = 'eye'
    else if (s > 0.28 && s < 0.61 && a < 0.13) part = 'dorsal'
    else if (s > 0.14 && s < 0.2 && a > 0.5) part = 'gill'
    else part = 'body'
  } else if (s > 0.68 && past <= 0) {
    const tailWidth = 0.03 + 0.15 * Math.pow(clamp((s - 0.7) / 0.3, 0, 1), 0.8)
    if (across <= tailWidth && s <= 0.86 + 0.14 * (across / tailWidth)) part = 'tail'
  }

  const scull = 0.18 * (1 - koi.beat) * Math.sin(koi.finPhase + side * 1.3)
  const spread = 1 - 0.25 * koi.beat + scull
  const bank = clamp(koi.turn * (side > 0 ? -0.6 : 0.6), -0.35, 0.35)
  if (!part && (inFin(s, across, 0.19, 0.066 * spread, 0.04, 0.85 + bank) || inFin(s, across, 0.47, 0.036 * spread, 0.018, 0.75 + bank * 0.5))) part = 'fin'
  if (!part) return null
  return { s, v, a, across, part, tx: 1, ty: 0 }
}

function inMarking(s: number, v: number, variety: number, seed: number) {
  if (variety === 2) return ((s - 0.105) / 0.06) ** 2 + (v / 0.105) ** 2 < 1 ? 0 : -1
  const wobble = (hash(seed, Math.floor(s * 90), Math.floor(v * 90)) - 0.5) * 0.55
  if (variety === 0 && ((s - 0.1) / 0.07) ** 2 + (v / 0.11) ** 2 < 1 + wobble) return 0
  const centers = variety === 1 ? [0.25, 0.43, 0.62] : [0.27, 0.47, 0.65]
  for (let i = 0; i < centers.length; i += 1) {
    const shifted = centers[i] + (hash(seed, 10 + i, 2) - 0.5) * 0.035
    if (((s - shifted) / (i === 1 ? 0.07 : 0.058)) ** 2 + (v / 0.115) ** 2 < 1 + wobble) return i % 2 + 1
  }
  if (variety === 1 && s > 0.2 && s < 0.72 && hash(seed, Math.floor(s * 165), Math.floor(v * 260)) > 0.985) return 3
  return -1
}

function makeKoi(width: number, height: number): Koi[] {
  const baseLength = clamp(Math.min(width, height) * 0.5, 170, 420)
  const adults = clamp(Math.round(width * height / 240000), 3, 6)
  const young = width >= 1024 ? 2 : 0
  const fish: Koi[] = []
  for (let i = 0; i < adults + young; i += 1) {
    const length = baseLength * (i >= adults ? 0.32 + Math.random() * 0.13 : 0.6 + Math.random() * 0.4)
    const heading = Math.random() * TAU
    const margin = length * 0.58
    let point = { x: width / 2, y: height / 2 }
    for (let attempt = 0; attempt < 100; attempt += 1) {
      point = { x: margin + Math.random() * Math.max(1, width - margin * 2), y: margin * 0.65 + Math.random() * Math.max(1, height - margin * 1.3) }
      const separation = Math.max(85, length * 0.4)
      if (fish.every((other) => Math.hypot(other.x - point.x, other.y - point.y) > Math.max(separation, other.length * 0.4))) break
    }
    const nodes = new Float32Array(NODE_COUNT * 2)
    const spine = new Float32Array(NODE_COUNT * 2)
    const segment = length / (NODE_COUNT - 1)
    for (let n = 0; n < NODE_COUNT; n += 1) {
      nodes[n * 2] = point.x - Math.cos(heading) * segment * n
      nodes[n * 2 + 1] = point.y - Math.sin(heading) * segment * n
    }
    fish.push({ x: point.x, y: point.y, heading, speed: 12 + length * 0.05, length, nodes, spine, seed: Math.random() * 10000, variety: Math.floor(Math.random() * 3), depth: 0.5 + Math.random() * 0.5, curiosity: 0.35 + Math.random() * 0.65, tailPhase: Math.random() * TAU, beat: Math.random() * 0.3, finPhase: Math.random() * TAU, turn: 0, nextBurst: Math.random() * 2.5, burstUntil: 0, wander: 0 })
  }
  return fish
}

function advanceSpine(koi: Koi, seconds: number, clickActive: boolean) {
  const { nodes, spine, length } = koi
  nodes[0] = koi.x
  nodes[1] = koi.y
  const segment = length / (NODE_COUNT - 1)
  let previousAngle = koi.heading + Math.PI
  for (let n = 1; n < NODE_COUNT; n += 1) {
    const px = nodes[(n - 1) * 2]
    const py = nodes[(n - 1) * 2 + 1]
    const oldX = nodes[n * 2]
    const oldY = nodes[n * 2 + 1]
    const desired = Math.atan2(oldY - py, oldX - px)
    const flex = 0.13 + (clickActive ? 0.015 : 0)
    const angle = previousAngle + clamp(angleDiff(previousAngle, desired), -flex, flex)
    nodes[n * 2] = px + Math.cos(angle) * segment
    nodes[n * 2 + 1] = py + Math.sin(angle) * segment
    previousAngle = angle
  }

  for (let n = 0; n < NODE_COUNT; n += 1) {
    const s = n / (NODE_COUNT - 1)
    const before = Math.max(0, n - 1)
    const after = Math.min(NODE_COUNT - 1, n + 1)
    let tx = nodes[before * 2] - nodes[after * 2]
    let ty = nodes[before * 2 + 1] - nodes[after * 2 + 1]
    const tangentLength = Math.hypot(tx, ty) || 1
    tx /= tangentLength
    ty /= tangentLength
    const amplitude = length * 0.045 * (0.035 + 0.965 * Math.pow(s, 2.3)) * (0.2 + 1.1 * koi.beat)
    const offset = amplitude * Math.sin(koi.tailPhase - s * 4.8)
    spine[n * 2] = nodes[n * 2] - ty * offset
    spine[n * 2 + 1] = nodes[n * 2 + 1] + tx * offset
  }
}

function sampleSpine(koi: Koi, x: number, y: number) {
  let best = Infinity
  let bestS = 0
  let bestSign = 1
  let bestRaw = 0
  let bestSegment = 0
  let tx = 1
  let ty = 0
  for (let n = 0; n < NODE_COUNT - 1; n += 1) {
    const ax = koi.spine[n * 2]
    const ay = koi.spine[n * 2 + 1]
    const dx = koi.spine[(n + 1) * 2] - ax
    const dy = koi.spine[(n + 1) * 2 + 1] - ay
    const lengthSquared = dx * dx + dy * dy || 1
    const raw = ((x - ax) * dx + (y - ay) * dy) / lengthSquared
    const u = clamp(raw, 0, 1)
    const qx = ax + dx * u
    const qy = ay + dy * u
    const distanceSquared = (x - qx) ** 2 + (y - qy) ** 2
    if (distanceSquared >= best) continue
    const segmentLength = Math.sqrt(lengthSquared)
    best = distanceSquared
    bestS = (n + u) / (NODE_COUNT - 1)
    bestSign = dx * (y - qy) - dy * (x - qx) >= 0 ? 1 : -1
    bestRaw = raw
    bestSegment = n
    tx = dx / segmentLength
    ty = dy / segmentLength
  }
  const distance = Math.sqrt(best)
  const ahead = bestSegment === 0 ? Math.max(0, -bestRaw) * (koi.length / (NODE_COUNT - 1)) : 0
  const past = bestSegment === NODE_COUNT - 2 ? Math.max(0, bestRaw - 1) * (koi.length / (NODE_COUNT - 1)) : 0
  const lateral = Math.abs(tx * (y - koi.spine[bestSegment * 2 + 1]) - ty * (x - koi.spine[bestSegment * 2]))
  const v = (distance * bestSign) / koi.length
  const side = bestSign
  const part = classify(bestS, v, past / koi.length, ahead / koi.length, lateral / koi.length, side, koi)
  if (!part) return null
  return { ...part, tx, ty }
}

function markingColor(hit: Hit, koi: Koi, palette: Palette, lum: number, time: number): RGB {
  if (hit.part === 'fin' || hit.part === 'tail' || hit.part === 'barbel') return palette.fin
  if (hit.part === 'eye') return palette.eye
  if (hit.part === 'gill') return palette.red
  if (hit.part === 'dorsal') return palette.fin
  const mark = inMarking(hit.s, hit.v, koi.variety, koi.seed)
  if (mark === 3) return palette.black
  if (mark >= 0) {
    const grain = (hash(koi.seed, Math.floor(hit.s * 150), Math.floor(hit.v * 250), Math.floor(time)) - 0.5) * 0.16
    const sheen = Math.max(0, Math.sin(hit.s * 11 - time * 1.8 + koi.seed) - 0.7) / 0.3
    return ramp(palette.hi, 0.15 + 0.8 * lum + grain + sheen * 0.25)
  }
  return palette.white
}

function drawKoi(ctx: CanvasRenderingContext2D, koi: Koi, theme: Theme, cw: number, ch: number, time: number) {
  const palette = paletteFor(theme)
  const spine = koi.spine
  const pad = koi.length * 0.26
  const minX = Math.min(...Array.from({ length: NODE_COUNT }, (_, n) => spine[n * 2])) - pad
  const maxX = Math.max(...Array.from({ length: NODE_COUNT }, (_, n) => spine[n * 2])) + pad
  const minY = Math.min(...Array.from({ length: NODE_COUNT }, (_, n) => spine[n * 2 + 1])) - pad
  const maxY = Math.max(...Array.from({ length: NODE_COUNT }, (_, n) => spine[n * 2 + 1])) + pad
  const c0 = Math.max(0, Math.floor(minX / cw))
  const c1 = Math.min(Math.ceil(ctx.canvas.width / (window.devicePixelRatio || 1) / cw), Math.ceil(maxX / cw))
  const r0 = Math.max(0, Math.floor(minY / ch))
  const r1 = Math.min(Math.ceil(ctx.canvas.height / (window.devicePixelRatio || 1) / ch), Math.ceil(maxY / ch))
  const samples = [[0.5, 0.5], [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]] as const
  const tick = Math.floor(time * 2.2)

  ctx.font = `600 ${Math.round(ch * 0.72)}px "DM Mono", ui-monospace, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let row = r0; row < r1; row += 1) {
    for (let col = c0; col < c1; col += 1) {
      const x = col * cw
      const y = row * ch
      let coverage = 0
      let hit: Hit | null = null
      for (const [ox, oy] of samples) {
        const sample = sampleSpine(koi, x + ox * cw, y + oy * ch)
        if (sample) { coverage += 1; if (!hit || ox === 0.5) hit = sample }
      }
      if (!hit || coverage === 0) continue

      const across = clamp(hit.a / Math.max(0.01, bodyHalfWidth(hit.s)), 0, 1)
      const facing = (hit.v >= 0 ? 1 : -1) * (0.6 * hit.ty - 0.8 * hit.tx) * across
      const lum = clamp(0.22 + 0.5 * Math.sqrt(1 - across * across) + 0.18 * facing, 0, 1)
      const skin = markingColor(hit, koi, palette, lum, time)
      const tileBlend = palette.tile[0] + (palette.tile[1] - palette.tile[0]) * lum
      let tile = hit.part === 'fin' || hit.part === 'tail'
        ? mix(palette.bg, palette.fin, 0.55)
        : hit.part === 'eye'
          ? mix(palette.bg, palette.eye, 0.85)
          : mix(palette.bg, skin, tileBlend)
      const coverageRatio = coverage / samples.length
      const edge = coverage < samples.length
      if (edge) tile = mix(palette.bg, tile, 0.32 + 0.38 * coverageRatio)

      const key = Math.floor(hash(koi.seed, col * 3 + 17, row * 3 - 5) * 0xffffffff) >>> 0
      const animated = hash(key, tick, 19)
      const glyphIndex = clamp(Math.round((1 - lum) * (GLYPHS.length - 1)) + (key % 3) - 1, 0, GLYPHS.length - 1)
      let glyph = key % 100 < 9 ? GLYPHS[Math.floor(animated * GLYPHS.length)] : GLYPHS[glyphIndex]
      if (edge) glyph = EDGE_GLYPHS[key % EDGE_GLYPHS.length]
      if (hit.part === 'eye') glyph = 'o'
      else if (hit.part === 'gill') glyph = ')'
      else if (hit.part === 'dorsal') glyph = ['^', '/', '\\'][key % 3]
      else if (hit.part === 'barbel') glyph = '~'
      else if ((hit.part === 'fin' || hit.part === 'tail') && key % 3 !== 0) glyph = '.'

      ctx.globalAlpha = edge ? 0.72 : (hit.part === 'fin' || hit.part === 'tail' ? 0.45 : 0.94) * (0.58 + 0.42 * koi.depth)
      ctx.fillStyle = cssColor(tile)
      ctx.fillRect(x + 1, y + 1, cw - 1, ch - 1)
      if (glyph !== ' ') {
        ctx.globalAlpha = edge ? 0.62 : (hit.part === 'fin' || hit.part === 'tail' ? 0.48 : 0.88) * (0.58 + 0.42 * koi.depth)
        ctx.fillStyle = cssColor(shade(tile, palette.ink + (edge ? 0.28 : 0)))
        if (hit.part === 'eye') ctx.fillStyle = cssColor(mix(palette.bg, palette.white, 0.9))
        ctx.fillText(glyph, x + cw / 2, y + ch / 2 + 1)
      }
    }
  }
}

export default function OceanCanvas({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const themeRef = useRef(theme)
  themeRef.current = theme
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let time = 0
    let lastTime = 0
    let raf = 0
    let visible = true
    let koi: Koi[] = []
    let clickTarget: ClickTarget | null = null
    let ripple: Ripple | null = null
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const cellWidth = () => clamp(Math.round(width / 125), 8, 12)
    const cellHeight = () => cellWidth() + 2

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      koi = makeKoi(width, height)
      draw()
    }

    const onClick = (event: PointerEvent) => {
      if (reduceMotion.matches) return
      const rect = canvas.getBoundingClientRect()
      clickTarget = { x: event.clientX - rect.left, y: event.clientY - rect.top, age: 0 }
      ripple = { x: clickTarget.x, y: clickTarget.y, age: 0 }
    }

    const draw = (timestamp = performance.now()) => {
      const seconds = lastTime ? clamp((timestamp - lastTime) / 1000, 0, 0.05) : 0
      lastTime = timestamp
      if (!reduceMotion.matches) time += seconds
      ctx.clearRect(0, 0, width, height)
      const cw = cellWidth()
      const ch = cellHeight()
      for (const fish of [...koi].sort((a, b) => a.depth - b.depth)) {
        if (!reduceMotion.matches && time >= fish.nextBurst && time >= fish.burstUntil) {
          fish.burstUntil = time + 0.7 + hash(fish.seed, Math.floor(time * 10), 4) * 0.9
          fish.nextBurst = fish.burstUntil + 1.2 + hash(fish.seed, Math.floor(time * 10), 9) * 2.8
        }
        const gatherStrength = clickTarget ? 1 - smoothstep(0.65, 2.2, clickTarget.age) : 0
        const gathering = gatherStrength > 0.001
        const bursting = time < fish.burstUntil || gathering
        fish.beat += ((bursting ? 1 : 0) - fish.beat) * Math.min(1, seconds * 3)
        fish.finPhase += seconds * 2.4
        fish.tailPhase += seconds * (0.6 + fish.beat * (2.2 + fish.speed / 11))

        const cruise = 12 + fish.length * 0.05
        // Dao Ho's wandering vector gives each koi a slow, continuous path instead
        // of repeatedly steering toward a new random point.
        fish.wander = clamp(fish.wander + (Math.random() - 0.5) * seconds * 2.4, -0.9, 0.9)
        let steerX = Math.cos(fish.heading) + Math.cos(fish.heading + fish.wander) * 0.6
        let steerY = Math.sin(fish.heading) + Math.sin(fish.heading + fish.wander) * 0.6
        let targetHeading = Math.atan2(steerY, steerX)
        let curious = false
        let speedScale = bursting ? 1.35 : 0.45
        if (clickTarget && gathering) {
          const toX = clickTarget.x - fish.x
          const toY = clickTarget.y - fish.y
          const distance = Math.hypot(toX, toY) || 1
          const range = 300
          if (distance < range) {
            const near = clamp(distance / (fish.length * 0.6), 0, 1)
            const weight = fish.curiosity * (1 - distance / range) * 2.2 * gatherStrength
            steerX += ((toX / distance) * near - (toY / distance) * (1 - near)) * weight
            steerY += ((toY / distance) * near + (toX / distance) * (1 - near)) * weight
            targetHeading = Math.atan2(steerY, steerX)
            speedScale += (1.6 - speedScale) * gatherStrength
            curious = gatherStrength > 0.15
          }
        }
        if (!clickTarget || gatherStrength < 1) {
          const marginX = fish.length * 0.58
          const marginY = fish.length * 0.25
          let awayX = 0
          let awayY = 0
          if (fish.x < marginX) awayX += 1
          if (fish.x > width - marginX) awayX -= 1
          if (fish.y < marginY) awayY += 1
          if (fish.y > height - marginY) awayY -= 1
          if (awayX || awayY) {
            const edgeHeading = Math.atan2(awayY, awayX)
            steerX += Math.cos(edgeHeading) * 2.4 * (1 - gatherStrength)
            steerY += Math.sin(edgeHeading) * 2.4 * (1 - gatherStrength)
          }
        }

        const desiredTurn = angleDiff(fish.heading, targetHeading)
        const turnRate = Math.min(gathering ? 1.2 : 0.7, (fish.speed / fish.length) * 4)
        const agility = turnRate * (curious ? 1.2 : 1)
        const maxTurn = agility * seconds
        const turned = clamp(desiredTurn, -maxTurn, maxTurn)
        fish.heading += turned
        if (seconds > 0) fish.turn += (turned / seconds - fish.turn) * Math.min(1, seconds * 3)
        const speedTarget = cruise * speedScale * (gathering ? 1 : 1.1)
        fish.speed += (speedTarget - fish.speed) * Math.min(1, seconds * (bursting ? 1.6 : 0.35))
        fish.x += Math.cos(fish.heading) * fish.speed * seconds
        fish.y += Math.sin(fish.heading) * fish.speed * seconds

        advanceSpine(fish, seconds, gathering)
        drawKoi(ctx, fish, themeRef.current, cw, ch, time)
      }

      if (clickTarget && seconds > 0) {
        clickTarget.age += seconds
        if (clickTarget.age >= 2.2) clickTarget = null
      }

      if (ripple) {
        ripple.age += seconds
        if (ripple.age > 2.4) ripple = null
        else {
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.age * 55, 0, TAU)
          ctx.strokeStyle = themeRef.current === 'light' ? `rgba(162,105,77,${1 - ripple.age / 2.4})` : `rgba(238,155,101,${1 - ripple.age / 2.4})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
      if (!reduceMotion.matches && visible) raf = window.requestAnimationFrame(draw)
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      window.cancelAnimationFrame(raf)
      if (visible && !reduceMotion.matches) raf = window.requestAnimationFrame(draw)
      else draw()
    })
    const resizeObserver = new ResizeObserver(resize)
    intersection.observe(canvas)
    resizeObserver.observe(canvas)
    resize()
    canvas.addEventListener('pointerdown', onClick)
    return () => {
      window.cancelAnimationFrame(raf)
      intersection.disconnect()
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', onClick)
    }
  }, [])

  return <canvas ref={canvasRef} className="ocean-canvas" aria-hidden="true" />
}
