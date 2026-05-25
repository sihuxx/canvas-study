const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [
  { k: "공격", v: 80, },
  { k: "방어", v: 60, },
  { k: "속도", v: 90, },
  { k: "체력", v: 70, },
  { k: "마법", v: 85, },
  { k: "운", v: 50, },
]
const max = Math.max(...data.map(d => d.v))
const cx = canvas.width / 2
const cy = canvas.height / 2
const radius = 150
const duration = 1500
let startTime

// 꼭짓점 좌표 계산 함수
function getPoint(i, r) {
  const angle = (Math.PI * 2 / data.length) * i - Math.PI
  // (360도 / 개수) * i  → i번째 꼭짓점 각도
  // - Math.PI / 2       → 12시 방향 보정
  return {
    x: cx + Math.cos(angle) * r, // 각도에 따른 X축 변화량 적용
    y: cy + Math.sin(angle) * r // 각도에 따른 Y축 변화량 적용
  }
}

// 다각형 그리기 함수
function drawPolygon(r, fill, stroke) {
  ctx.beginPath()
  data.forEach((_, i) => {
    const { x, y } = getPoint(i, r)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath() // 마지막 점 -> 첫 점 연결
  ctx.fillStyle = fill; 
  ctx.fill() 
  ctx.strokeStyle = stroke; 
  ctx.stroke() 
}

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. 배경 격자선 (그물망) 그리기
  // 반지름의 25%, 50%, 75%, 100% 크기로 총 4개의 육각형을 중첩
  [0.25, 0.5, 0.75, 1].forEach(scale => {
    drawPolygon(radius * scale, "rgba(200,200,200,0.15)", "#ddd")
  })

  // 2. 중심 -> 꼭짓점 축선
  data.forEach((_, i) => {
    const {x, y} = getPoint(i, radius) // 가장 바깥쪽 꼭짓점 좌표
    ctx.beginPath()
    ctx.moveTo(cx,cy) // 중심에서
    ctx.lineTo(x, y) // 꼭짓점까지
    ctx.strokeStyle = "#ddd"
    ctx.stroke()
  })

  // 3. 데이터 다각형
  ctx.beginPath()
  data.forEach(({v}, i) => {
    const r = (v / max) * radius * progress
    // (v / max) : 최댓값 대비 현재 능력치의 비율 (0 ~ 1)
    //거기에 전체 반지름과 애니메이션 진행도(progress)를 곱해 동적인 반지름을 구함
    const { x, y } = getPoint(i, r)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = "rgba(74, 144, 217, 0.3)"
  ctx.fill()
  ctx.strokeStyle = "#4A90D9"
  ctx.lineWidth = 2
  ctx.stroke()
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