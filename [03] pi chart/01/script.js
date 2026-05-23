const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [
  { color: '#4A90D9', value: 65 },
  { color: '#5BAD8F', value: 120 },
  { color: '#E8924A', value: 88 },
  { color: '#A97FD4', value: 200 },
  { color: '#E8C54A', value: 155 },
  { color: "#D95B7A", value: 310 },
]
const total = data.reduce((acc, cur) => acc + cur.value, 0) // 데이터 value 총합 구함
const radius = 200 // 반지름
let current = -Math.PI // arc는 3시 방향에서 시작 (-180도 -> 3시 방향)

function render() {
  data.forEach(({color, value}, i) => {
    const sliceAngle = (value / total) * Math.PI * 2
    // 360도 * 현재값 / 총합값
    // => 총합값에 따른 현재값의 비율이 계산됨

    ctx.beginPath() 
    ctx.moveTo(canvas.width / 2, canvas.height / 2) // 캔버스 중앙으로 이동 (arc는 중심부터 그리기 때문에 따로 위치 조정 필요 x)
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, current, current + sliceAngle) 
    ctx.fillStyle = color
    ctx.fill()

    current += sliceAngle // 기존 current 각도에 현재 각도를 더해서 누적을 반복
  })
}

render()