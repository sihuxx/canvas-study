const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [{ k: "공격", v: 80 }, { k: "방어", v: 60 }, { k: "속도", v: 90 }, { k: "체력", v: 70 }, { k: "마법", v: 85 }, { k: "운", v: 50 },]
const duration = 1500
const cx = canvas.width / 2
const cy = canvas.height / 2
const radius = 200
const max = Math.max(...data.map(d => d.v))
let startTime

function getPoint(i, r) {
  const angle = (Math.PI * 2 / data.length) * i - Math.PI / 2
  return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r}
}

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

    ;[0.25, 0.5, 0.75, 1].forEach(scale => {
      ctx.beginPath()
      ctx.strokeStyle = "#ccc"
      data.forEach(({ v }, i) => {
        const { x, y } = getPoint(i, radius * scale)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.stroke()
    })

    ctx.beginPath()
  data.forEach(({ v }, i) => {
    const { x, y } = getPoint(i, valueToRadius(v) * progress)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = "#ffc13caf"
  ctx.fill()
}
function valueToRadius(value) {
  return value / max * radius
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