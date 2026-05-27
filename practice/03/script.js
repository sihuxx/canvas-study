const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const tooltip = document.querySelector(".tooltip")
const data = [
  { k: "1월", v: 320 },
  { k: "2월", v: 280 },
  { k: "3월", v: 450 },
  { k: "4월", v: 390 },
  { k: "5월", v: 520 },
  { k: "6월", v: 610 },
  { k: "7월", v: 580 },
  { k: "8월", v: 640 },
  { k: "9월", v: 470 },
  { k: "10월", v: 390  },
  { k: "11월", v: 510  },
  { k: "12월", v: 720  },
]
const radius = 200
const duration = 1500
const cx = canvas.width / 2
const cy = canvas.height / 2
const max = Math.max(...data.map(d => d.v))
const angle = Math.PI * 2 / data.length
let startTime 
const paths = []

canvas.addEventListener("mousemove", ({ offsetX, offsetY, clientX, clientY }) => {
  const area = paths.find(({ path }) => ctx.isPointInPath(path, offsetX, offsetY) )
  const currentArea = data[area?.id]
  
  tooltip.style.opacity = 0  
  if(currentArea) {
    tooltip.style.opacity = 1
    tooltip.style.left = clientX + 15 + 'px'
    tooltip.style.top = clientY + 15 + 'px'
    tooltip.innerHTML = `<span style="background-color: hsl(${30 * data.indexOf(currentArea)}, 70%, 60%)"></span> ${currentArea.k} - ${currentArea.v} `
  }
})

function render(progress, isRun) {
  data.sort((a, b) => a.v - b.v)
  let startAngle = -Math.PI / 2

  data.forEach(({ k, v }, i) => {
    const r = v / max * radius * progress

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, startAngle, startAngle + angle)
    ctx.fillStyle = `hsl(${30 * i}, 70%, 60%)` 
    ctx.fill()

    const midAngle = startAngle + (angle * progress) / 2
    const lx = cx + Math.cos(midAngle) * (r * 0.65)
    const ly = cy + Math.sin(midAngle) * (r * 0.65)
    ctx.fillStyle = '#fff'
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(k, lx, ly)

    if(!isRun) {
      const pathCtx = new Path2D()
      pathCtx.moveTo(cx, cy)
      pathCtx.arc(cx, cy, r, startAngle, startAngle + angle)
      paths.push({ path: pathCtx, id: i })
    }    
    
    startAngle += angle
  })
}

let aniId = null
function animate(timestamp) {
  if(!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / duration, 1)
  const ease = 1 - (1 - progress) ** 3
  if(progress < 1) {
    aniId = requestAnimationFrame(animate)
    render(ease, true)
  } else {
    cancelAnimationFrame(aniId)
    render(ease, false)
  }
}
requestAnimationFrame(animate)