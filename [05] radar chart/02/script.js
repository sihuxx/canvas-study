const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [
  { k: "공격", v: 80 },
  { k: "방어", v: 60 },
  { k: "속도", v: 90 },
  { k: "체력", v: 70 },
  { k: "마법", v: 85 },
  { k: "운",   v: 50 },
]
const max = Math.max(...data.map(d => d.v))
const cx = canvas.width / 2
const cy = canvas.height / 2
const radius = 150
const duration = 1500
let startTime

function getPoint(i, r) {
  const angle = (Math.PI * 2 / data.length) * i - Math.PI / 2
  return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r}
}

function drawPolygon(r, fill, stroke) {
  ctx.beginPath()
  data.forEach((_, i) => {
    const { x, y } = getPoint(i, r)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = stroke
  ctx.stroke()
}

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  [0, 0.25, 0.5, 0.75, 1].forEach(scale => {
    drawPolygon(radius * scale, "rgba(200,200,200,0.15)", "#ddd")
  })

  data.forEach((_, i) => {
    const { x, y } = getPoint(i, radius)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(x, y)
    ctx.strokeStyle = "#ddd"
    ctx.stroke()
  })

  ctx.beginPath()
  data.forEach(({v}, i) => {
    const r = (v / max) * radius * progress
    const { x, y } = getPoint(i, r)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = "rgba(74, 144, 217, 0.3)"
  ctx.fill()
  ctx.strokeStyle = "#4A90D9"
  ctx.lineWidth = 2
  ctx.stroke()

  // 점 그리기
  data.forEach(({v}, i) => {
    const r = (v / max) * radius * progress
    const { x, y } = getPoint(i, r)
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = "#4A90D9"
    ctx.fill()
  })

  // 라벨 그리기
  data.forEach(({k}, i) => {
    const { x, y } = getPoint(i, radius + 25) // 반지름보다 25px 바깥
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(k, x, y)
  })
}

function animate(timestamp) {
  if(!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / duration, 1)
  const ease = 1 - (1 - progress) ** 3
  render(ease)
  if(progress < 1) requestAnimationFrame(animate)
}

requestAnimationFrame(animate)