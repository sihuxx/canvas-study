const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [{ label: "A", value: 500 }, { label: "B", value: 600 }, { label: "C", value: 200 }, { label: "D", value: 300 }, { label: "E", value: 700 }, { label: "F", value: 400 }, { label: "G", value: 350 }]
const padding = 50
const sectionWidth = (canvas.width - padding) / data.length
const max = Math.max(...data.map(d => d.value))
const duration = 1500
let startTime

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 1. 막대 그리기
  data.forEach(({value}, i) => {
    ctx.fillStyle = "rgba(74, 144, 226, 0.6)"
    ctx.fillRect(
      sectionWidth * i + padding,
      canvas.height - padding,
      sectionWidth - padding,
      -valueToHeight(value) * progress
    )
  })

  // 2. 라벨 그리기
  data.forEach(({label}, i) => {
    ctx.font = "16px sans-serif"
    ctx.fillStyle = "#1756df"
    ctx.fillText(label, padding + sectionWidth * i + (sectionWidth - padding) / 2, canvas.height - padding + 30)
  })

  // 3. 라인 그리기
  ctx.beginPath()
  data.forEach(({value}, i) => {
    const x = padding + sectionWidth * i + (sectionWidth - padding) / 2
    const y = canvas.height - padding - valueToHeight(value) * progress
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.lineWidth = 2
  ctx.strokeStyle = "#1756df"
  ctx.stroke()

  // 4. 점 그리기
  data.forEach(({value}, i) => {
    const x = padding + sectionWidth * i + (sectionWidth - padding) / 2
    const y = canvas.height - padding - valueToHeight(value) * progress
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = "#1756df"
    ctx.fill()
  })
}

function valueToHeight(value) {
  return (canvas.height - padding * 2) / max * value
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