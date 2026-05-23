const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [100, 230, 400, 300, 350, 500, 80, 0]
const max = Math.max(...data)
const padding = 50
const duration = 1000
let startTime
const sectionWidth = (canvas.width - padding) / data.length

function render(progress) {
  ctx.clearRect(0, 0,canvas.width, canvas.height)
  ctx.beginPath()
  data.forEach((value, i) => {
    const x = padding + sectionWidth * i + sectionWidth / 2
    const y = canvas.height - padding - valueToHeight(value) * progress
    
    if(i === 0) ctx.moveTo(x,y)
      else ctx.lineTo(x, y)
  })
  ctx.stroke()
  data.forEach((value, i) => {
    const x = padding + sectionWidth * i + sectionWidth / 2
    const y = canvas.height - padding - valueToHeight(value) * progress

    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill()
  })
}

function valueToHeight(value) {
  return (canvas.height - padding * 2) / max * value
}

function animate(timestamp){
  if(!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / duration, 1)
  render(progress)
  if(progress < 1) requestAnimationFrame(animate)
}
requestAnimationFrame(animate)

render()