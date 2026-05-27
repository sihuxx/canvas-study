const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const tooltip = document.querySelector('.tooltip')
let data = [
  { k: "1월", v: 320, isHovered: false },
  { k: "2월", v: 280, isHovered: false },
  { k: "3월", v: 450, isHovered: false },
  { k: "4월", v: 390, isHovered: false },
  { k: "5월", v: 520, isHovered: false },
  { k: "6월", v: 610, isHovered: false },
  { k: "7월", v: 580, isHovered: false },
  { k: "8월", v: 640, isHovered: false },
  { k: "9월", v: 470, isHovered: false },
  { k: "10월", v: 390, isHovered: false },
  { k: "11월", v: 510, isHovered: false },
  { k: "12월", v: 720, isHovered: false },
]

const duration = 1500
const radius = 200
const cx = canvas.width / 2
const cy = canvas.height / 2
let startTime
let paths = []

canvas.onmousemove = ({ offsetX, offsetY, clientX, clientY }) => {
  const area = paths.find(({ path }) => ctx.isPointInPath(path, offsetX, offsetY))
  const currentData = data[area?.id]
  
  tooltip.style.opacity = 0
  data.map(d => d.isHovered = false)
  
  if (currentData) {
    tooltip.style.opacity = 1
    tooltip.style.left = clientX + 12 + 'px'
    tooltip.style.top = clientY + 12 + 'px'
    tooltip.textContent = `${currentData.k}\n${currentData.v}`
    
    currentData.isHovered = true
  }
  
  render(1, false)
}

canvas.onclick = ({ offsetX, offsetY }) => {
  const area = paths.find(({ path }) => ctx.isPointInPath(path, offsetX, offsetY))
  const currentData = data[area?.id]
  
  if (currentData) {
    data = data.filter(d => d !== currentData)
  }
  
  render(1, false)
}

function render(progress, isRun) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let start = -Math.PI / 2
  const total = data.reduce((acc, cur) => acc + cur.v, 0)
  paths = []

  data.forEach(({ v, k, isHovered }, i) => {
    const angle = ((v / total) * Math.PI * 2)

    ctx.beginPath()
    ctx.moveTo(cx, cy)

    ctx.arc(cx, cy, isHovered ? radius + 5 : radius, start, start + angle * progress)
    ctx.fillStyle = isHovered ? `hsl(${30 * i}, 80%, 50%)` : `hsl(${30 * i}, 70%, 60%)`
    ctx.fill()

    const midAngle = start + (angle * progress) / 2
    const lx = cx + Math.cos(midAngle) * (radius * 0.65)
    const ly = cy + Math.sin(midAngle) * (radius * 0.65)
    ctx.fillStyle = '#fff'
    ctx.fillText(k, lx, ly)

    if (!isRun) {
      const pathCtx = new Path2D()
      pathCtx.moveTo(cx, cy)
      pathCtx.arc(cx, cy, radius, start, start + angle * progress)

      paths.push({ path: pathCtx, id: i })
    }

    start += angle * progress

  })
}

let aniId = null
function animate(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / duration, 1)
  const ease = 1 - (1 - progress) ** 3
  if (progress < 1) {
    render(ease, true)
    aniId = requestAnimationFrame(animate)
  } else {
    cancelAnimationFrame(aniId)
    render(ease, false)
  }
}
requestAnimationFrame(animate)