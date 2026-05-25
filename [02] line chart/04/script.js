const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [{ label: "1월", value: 65 }, { label: "2월", value: 120 }, { label: "3월", value: 88 }, { label: "4월", value: 200 }, { label: "5월", value: 155 }, { label: "6월", value: 310 }, { label: "7월", value: 275 }, { label: "8월", value: 390 }, { label: "9월", value: 220 }, { label: "10월", value: 480 }, { label: "11월", value: 340 }, { label: "12월", value: 560 }]
const max = Math.max(...data.map(d => d.value))
const padding = 50
const sectionWidth = (canvas.width - padding) / data.length
const cx = canvas.width / 2
const cy = canvas.height / 2
const duration = 1500
let startTime
let hoverIndex = -1

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect()
  const dx = e.clientX - rect.left - cx
  const dy = e.clientX - rect.top - cy
  
  if(Math.sqrt(dx ** 2 + dy ** 2) > radius) {
    hoverIndex = -1
    render(1)
    return
  }

  let mouseAngle = Math.atan2(dy, dx)
  if(mouseAngle < -Math.PI) mouseAngle += Math.PI * 2

  let current = -Math.PI / 2
  data.forEach(({v}, i) => {
    const angle = (v / total) * Math.PI * 2
    if(mouseAngle >= current && mouseAngle < current + angle) hoverIndex = i 
    current += angle
  })
  render(1)
})

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let gridCount = 12
  for (let n = 0; n < gridCount; n++) {
    const ratio = n / gridCount
    const y = padding + (canvas.height - padding * 2) * ratio

    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(canvas.width - padding, y)
    ctx.strokeStyle = "#f1f5f9"
    ctx.lineWidth = 1.5
    ctx.stroke()

    const gridValue = Math.round(max - (max * ratio))
    ctx.fillStyle = "#94a3b8"
    ctx.font = "500 12px s"
    ctx.textAlign = "right"
    ctx.textBaseline ="middle"

    ctx.fillText(gridValue, padding - 15, y)
  }

  ctx.beginPath()
  data.forEach(({ value }, i) => {
    const x = sectionWidth * i + padding + (sectionWidth - padding) / 2
    const y = canvas.height - padding - valueToHeight(value) * progress
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.strokeStyle = "#4A90D9"
  ctx.stroke()

  data.forEach(({ value }, i) => {
    ctx.beginPath()
    const x = sectionWidth * i + padding + (sectionWidth - padding) / 2
    const y = canvas.height - padding - valueToHeight(value) * progress
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = "#4A90D9"
    ctx.fill()
  })

  data.forEach(({ label, value }, i) => {
    ctx.beginPath()
    const x = sectionWidth * i + padding + (sectionWidth - padding) / 2
    const y = canvas.height - padding + 25
    ctx.textAlign = "center"
    ctx.font = "bold 15px n"
    ctx.textBaseline = "middle"
    ctx.fillText(label, x, y)
  })
}

function valueToHeight(value) {
  return (canvas.height - padding * 2) / max * value
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / duration, 1)
  const ease = 1 - (1 - progress) ** 3
  render(ease)
  if (progress < 1) requestAnimationFrame(animate)
}

requestAnimationFrame(animate)