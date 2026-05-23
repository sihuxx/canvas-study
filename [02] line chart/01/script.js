const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [100, 230, 400, 300, 350, 500, 80]
const label = ["100", "200", "400", "300", "350", "500", "80"]
const sectionWidth = canvas.width / data.length;

ctx.beginPath()
data.forEach((e, i) => {
  ctx[i === 0 ? 'moveTo' : 'lineTo'](sectionWidth * (i + 1) - sectionWidth / 2, canvas.height - e);
})
ctx.stroke();

data.forEach((e, i) => {
  ctx.beginPath()
  ctx.fillStyle = "red";
  ctx.arc(sectionWidth * (i + 1) - sectionWidth / 2, canvas.height - e, 10, 0, Math.PI * 2)
  ctx.fill()
})

data.forEach((e, i) => {
  ctx.fillText(e, sectionWidth * (i + 1) - sectionWidth / 2, canvas.height - e + 30)
  ctx.textAlign = "center"
})