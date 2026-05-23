const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [
  { k: "1월", v: 320, c: "hsl(0, 70%, 60%)" },
  { k: "2월", v: 280, c: "hsl(30, 70%, 60%)" },
  { k: "3월", v: 450, c: "hsl(60, 70%, 60%)" },
  { k: "4월", v: 390, c: "hsl(90, 70%, 60%)" },
  { k: "5월", v: 520, c: "hsl(120, 70%, 60%)" },
  { k: "6월", v: 610, c: "hsl(150, 70%, 60%)" },
]
const angle = Math.PI * 2 / data.length
const max = Math.max(...data.map(d => d.v))
const cx = canvas.width / 2
const cy = canvas.height / 2
const radius = 200
const duration = 1000
let startTime 

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let current = -Math.PI / 2

  data.forEach(({k,v,c}) => {
    const r = (v / max) * radius * progress
    
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, current, current + angle * progress)
    ctx.fillStyle = c
    ctx.fill()

    const midAngle = current + angle / 2
    const lx = cx + Math.cos(midAngle) * (r * 0.65)
    const ly = cy + Math.sin(midAngle) * (r * 0.65)
    ctx.fillStyle = "#fff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(k, lx, ly)

    current += angle * progress
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