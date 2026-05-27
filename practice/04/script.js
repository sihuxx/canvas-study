const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const [cx, cy] = [canvas.width / 2, canvas.height / 2]
const data = [{ k: "공격", v: 80 },{ k: "방어", v: 60 },{ k: "속도", v: 90 },{ k: "체력", v: 70 },{ k: "마법", v: 85 },{ k: "운", v: 50 },]
const max = Math.max(...data.map(d => d.v))
const maxR = 200

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 정육각형 만들기!
  for(let j = 0; j < 4; j++) {
    ctx.beginPath()
    data.forEach(({k}, i) => {
      const angle = (Math.PI * 2 / data.length) * i - Math.PI / 2
      const x = cx + (maxR - 200 / 4 * j) * Math.cos(angle)
      const y = cy + (maxR - 200 / 4 * j) * Math.sin(angle)
      
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)

      const tx = cx + (maxR + 20) * Math.cos(angle)
      const ty = cy + (maxR + 20) * Math.sin(angle)
      
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      if (j === 3) ctx.fillText(k, tx, ty)
    })
    ctx.closePath()
    ctx.strokeStyle = '#00000099'
    ctx.stroke()
  }

  // 색칠하기!
  ctx.beginPath()
  data.forEach(({ v, k }, i) => {
    const angle = (Math.PI * 2 / data.length) * i - Math.PI / 2
    const x = cx + valueToRadius(v) * progress * Math.cos(angle)
    const y = cy + valueToRadius(v) * progress * Math.sin(angle)
    
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
})
  ctx.fillStyle = "rgba(255, 94, 0, 0.5)"
  ctx.fill()
  ctx.closePath()
  
  ctx.beginPath()
  data.forEach(({ v, k }, i) => {
    const angle = (Math.PI * 2 / data.length) * i - Math.PI / 2
    const x = cx + valueToRadius(v) * progress * Math.cos(angle)
    const y = cy + valueToRadius(v) * progress * Math.sin(angle)

    const tx = cx + (valueToRadius(v) - 20) * progress * Math.cos(angle)
    const ty = cy + (valueToRadius(v) - 20) * progress * Math.sin(angle)
    
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = '#000'
    ctx.fillText(v, tx, ty)
    
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.stroke()
}

function valueToRadius(value) {
  return value / max * maxR
}

render()

let startTime
const duration = 1500

function animate(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / duration, 1)
  const ease = 1 - (1 - progress) ** 3
  render(ease)
  if (progress < 1) requestAnimationFrame(animate)
}

requestAnimationFrame(animate)