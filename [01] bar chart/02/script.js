const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [500, 600, 200, 300, 700]
const barWidth = 100
const gap = 50
let sectionWidth = (canvas.width + gap) / data.length


function render() {
  data.forEach((e, i) => {
    ctx.fillRect(sectionWidth * i, canvas.height - e, sectionWidth - gap, e)
  })
}

controlWidth.addEventListener('input', (e) => {
  canvas.width = controlWidth.value
  sectionWidth = (canvas.width + gap) / data.length
  render()
})

render()