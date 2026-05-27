const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const data = [
  { label: "A", value: 500 },
  { label: "B", value: 600 },
  { label: "C", value: 200 },
  { label: "D", value: 300 },
  { label: "E", value: 700 },
  { label: "F", value: 400 },
  { label: "G", value: 350 }
]
const max = Math.max(...data.map(d => d.value))
const padding = 50
const sectionWidth = (canvas.width - padding) / data.length
const barDuration = 1500
const barDelay = 300

function valueToHeight(value) {
  return (canvas.height - padding * 2) / max * value
}

function getBarX(i) {
  return sectionWidth * i + padding
}

function getBarW() {
  return sectionWidth - padding * 0.4
}

function getPointX(i) {
  return getBarX(i) + getBarW() / 2
}

function getPointY(value, progress) {
  return canvas.height - padding - valueToHeight(value) * progress
}

function getProgress(timestamp, startTime, i) {
  const elapsed = timestamp - startTime - i * barDelay
  const p = Math.min(Math.max(elapsed / barDuration, 0), 1)
  return 1 - (1 - p) ** 3
}

// -----

function drawBar(i, value, ease) {
  const x = getBarX(i)
  const barW = getBarW()
  const barH = valueToHeight(value) * ease
  const y = canvas.height - padding - barH
  ctx.fillStyle = '#85B7EB'
  ctx.fillRect(x, y, barW, barH)
}

function drawLabel(i, label) {
  const x = getBarX(i)
  const barW = getBarW()
  ctx.fillStyle = '#888'
  ctx.font = '13px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(label, x + barW / 2, canvas.height - padding + 8)
}

function drawLine(progresses) {
  ctx.beginPath()
  ctx.strokeStyle = '#E24B4A'
  ctx.lineWidth = 2
  ctx.setLineDash([])

  data.forEach(({ value }, i) => {
    const ease = progresses[i]
    if (ease <= 0) return
    const x = getPointX(i)
    const y = getPointY(value, ease)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()
}

function drawDots(progresses) {
  data.forEach(({ value }, i) => {
    const ease = progresses[i]
    if (ease <= 0) return
    const x = getPointX(i)
    const y = getPointY(value, ease)
    ctx.beginPath()
    ctx.fillStyle = '#E24B4A'
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.fillStyle = '#fff'
    ctx.arc(x, y, 2, 0, Math.PI * 2)
    ctx.fill()
  })
}

// -----

function render(timestamp, startTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const progresses = data.map((_, i) => getProgress(timestamp, startTime, i))

  data.forEach(({ label, value }, i) => {
    drawBar(i, value, progresses[i])
    drawLabel(i, label)
  })
  drawLine(progresses)
  drawDots(progresses)

  return progresses.some(p => p < 1)
}

// -----

function animate(startTime) {
  return (timestamp) => {
    const running = render(timestamp, startTime)
    if (running) requestAnimationFrame(animate(startTime))
  }
}

requestAnimationFrame((timestamp) => {
  requestAnimationFrame(animate(timestamp))
})