const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const data = [{ label: "A", value: 500 }, { label: "B", value: 600 }, { label: "C", value: 200 }, { label: "D", value: 300 }, { label: "E", value: 700 }, { label: "F", value: 400 }, { label: "G", value: 350 }]
const padding = 50
const sectionWidth = (canvas.width - padding) / data.length
const max = Math.max(...data.map(d => d.value))
const duration = 1000
let startTime

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  data.forEach(({value}, i) => {
    ctx.fillRect( 
      sectionWidth * i + padding,
      canvas.height - padding,
      sectionWidth - padding,
      -valueToHeight(value) * progress
    )
  })
  data.forEach(({label, value}, i) => {
    ctx.fillText(label, sectionWidth * i + padding, canvas.height - padding + 30)
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