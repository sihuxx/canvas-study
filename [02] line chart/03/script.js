const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [{ label: "1월", value: 65 }, { label: "2월", value: 120 }, { label: "3월", value: 88 }, { label: "4월", value: 200 }, { label: "5월", value: 155 }, { label: "6월", value: 310 }, { label: "7월", value: 275 }, { label: "8월", value: 390 }, { label: "9월", value: 220 }, { label: "10월", value: 480 }, { label: "11월", value: 340 }, { label: "12월", value: 560 }]
const max = Math.max(...data.map(d => d.value))
const padding = 50
const sectionWidth = (canvas.width - padding) / data.length
const duration = 1000
let startTime

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  data.forEach(({ value }, i) => {
    const x = sectionWidth * i + padding + sectionWidth / 2
    const y = canvas.height - padding - valueToHeight(value) * progress
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()

  data.forEach(({ value, label }, i) => {
    const x = sectionWidth * i + padding + sectionWidth / 2
    const y = canvas.height - padding - valueToHeight(value) * progress + 40
    ctx.textAlign = "center"
    ctx.fillText(label, x, y)
  })

  data.forEach(({ value }, i) => {
    const x = sectionWidth * i + padding + sectionWidth / 2
    const y = canvas.height - padding - valueToHeight(value) * progress
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  })
}

function valueToHeight(value) {
  return (canvas.height - padding * 2) / max * value
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / duration, 1)
  const eased = 1 - (1 - progress) ** 3  // ✅ 여기서 변환
  render(eased)  // progress 대신 eased를 넘김
  if (progress < 1) requestAnimationFrame(animate)
}

requestAnimationFrame(animate)
render()

/* 
  | 이름 | 수식 | 느낌 |
  |------|------|------|
  | linear | `progress` | 일정한 속도 |
  | easeOutQuad | `1 - (1 - progress) ** 2` | 빠르게 시작 → 천천히 끝 |
  | easeOutCubic | `1 - (1 - progress) ** 3` | easeOutQuad보다 더 강하게 |
  | easeInQuad | `progress ** 2` | 천천히 시작 → 빠르게 끝 |
  | easeInOut | `progress < 0.5 ? 2 * progress ** 2 : 1 - (-2 * progress + 2) ** 2 / 2` | 천천히 시작 → 빠르게 → 천천히 끝 |
*/