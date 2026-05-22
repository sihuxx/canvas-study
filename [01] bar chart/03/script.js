const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [500, 600, 200, 300, 700, 400]
const barWidth = 100
const padding = 50
const sectionWidth = (canvas.width - padding) / data.length
const max = Math.max(...data)
const duration = 1000
let startTime

function render(progress) {
  console.log(progress)

  data.forEach((e, i) => {
    ctx.fillRect(sectionWidth * i + padding, canvas.height - padding, sectionWidth - padding, -valueToHeight(e) * progress)
  })
  ctx.strokeStyle = "#ccc"
  ctx.beginPath()
  ctx.moveTo(padding, canvas.height - padding)
  ctx.lineTo(canvas.width - padding, canvas.height - padding)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, canvas.height - padding)
  ctx.stroke()
  data.forEach((data, i) => {
    ctx.strokeStyle = "#ccc"
    ctx.beginPath()
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()
    ctx.font = '20px sans-serif'
    ctx.fillText("X", padding - 20, canvas.height - padding- 20)
    ctx.fillText("Y", padding, canvas.height - padding + 20)
  })
}

function valueToHeight(value) {
  return (canvas.height - padding * 2) / max * value
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / duration, 1)

  render(progress)
  if (progress < 1) requestAnimationFrame(animate)
}

requestAnimationFrame(animate)