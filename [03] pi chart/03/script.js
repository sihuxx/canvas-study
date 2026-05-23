const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const data = [
  { k: "1월", v: 320, c: "hsl(0, 70%, 60%)" },
  { k: "2월", v: 280, c: "hsl(30, 70%, 60%)" },
  { k: "3월", v: 450, c: "hsl(60, 70%, 60%)" },
  { k: "4월", v: 390, c: "hsl(90, 70%, 60%)" },
  { k: "5월", v: 520, c: "hsl(120, 70%, 60%)" },
  { k: "6월", v: 610, c: "hsl(150, 70%, 60%)" },
  { k: "7월", v: 580, c: "hsl(180, 70%, 60%)" },
  { k: "8월", v: 640, c: "hsl(210, 70%, 60%)" },
  { k: "9월", v: 470, c: "hsl(240, 70%, 60%)" },
  { k: "10월", v: 390, c: "hsl(270, 70%, 60%)" },
  { k: "11월", v: 510, c: "hsl(300, 70%, 60%)" },
  { k: "12월", v: 720, c: "hsl(330, 70%, 60%)" },
]
const total = data.reduce((acc, cur) => acc + cur.v, 0) // 총합값
const radius = 200 // 반지름
const duration = 1500 // 애니메이션 실행 시간
const cx = canvas.width / 2 // 캔버스 중심 x
const cy = canvas.height / 2 // 캔버스 중심 y
let startTime
let hoverIndex = -1 // 현재 호버된 조각 (-1 = 없음)

canvas.addEventListener("mousemove", (e) => {
  // 캔버스가 브라우저에서 어느 위치에 있는지 가져옴
  // (캔버스가 화면 왼쪽 상단에 딱 붙어있지 않을 수 있어서 필요)
  const rect = canvas.getBoundingClientRect()

  // 마우스와 원 중심 사이의 x, y 거리
  // e.clientX = 브라우저 기준 마우스 x
  // - rect.left = 캔버스 시작위치 빼서 캔버스 기준으로 변환
  // - cx = 원 중심까지의 거리
  const dx = e.clientX - rect.left - cx
  const dy = e.clientY - rect.top - cy

  // 피타고라스로 실제 거리 계산
  // √(dx² + dy²) > radius 면 원 밖
  if (Math.sqrt(dx ** 2 + dy ** 2) > radius) {
    hoverIndex = -1  // 호버 해제
    render(1)
    return  // 원 밖이면 여기서 종료
  }

  // 마우스 위치를 각도로 변환 (atan2 = 좌표 → 각도)
  // 반환값 범위: -π ~ π
  let mouseAngle = Math.atan2(dy, dx)

  // 시작각도가 -π/2 (12시) 인데
  // atan2가 -π/2 보다 작은 음수를 반환하는 구간이 있어서
  // π*2 를 더해서 양수로 보정
  if (mouseAngle < -Math.PI / 2) mouseAngle += Math.PI * 2

  // 12시 방향부터 시작해서 각 조각의 범위를 누적
  let current = -Math.PI / 2
  data.forEach(({ v }, i) => {
    // 이 조각이 차지하는 각도
    const angle = (v / total) * Math.PI * 2

    // 마우스 각도가 이 조각의 시작~끝 사이에 있으면 이 조각이 호버된 것
    // current           = 이 조각 시작 각도
    // current + angle   = 이 조각 끝 각도
    if (mouseAngle >= current && mouseAngle < current + angle) hoverIndex = i

    // 다음 조각 시작각도 = 이 조각 끝각도
    current += angle
  })

  render(1)  // 호버 반영해서 다시 그리기
})

function render(progress) {
  let current = -Math.PI / 2
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  data.forEach(({ k, v, c }, i) => {
    const angle = (v / total) * Math.PI * 2

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, radius, current, current + angle * progress)
    // 호버 안된 조각은 반투명
    ctx.globalAlpha = (hoverIndex === -1 || i === hoverIndex) ? 1 : 0.5
    ctx.fillStyle = c
    ctx.fill()
    ctx.globalAlpha = 1 // 초기화 (안하면 텍스트도 흐려짐)

    const midAngle = current + (angle * progress) / 2 // 조각 중간 각도
    const lx = cx + Math.cos(midAngle) * (radius * 0.65) // 원 안쪽 x
    const ly = cy + Math.sin(midAngle) * (radius * 0.65) // 원 안쪽 y

    // 호버된 조각만 라벨 표시
    if (i === hoverIndex) {
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(k, lx, ly)
    }

    current += angle * progress
  })
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime
  const progress = Math.min(elapsed / duration, 1)
  const ease = 1 - (1 - progress) ** 3
  render(ease)
  if (progress < 1) requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

/* 
         -90도 (위) ← 12시!
          ↑
180도 ←   ·   → 0도 (3시)
          ↓
         90도 (아래)
*/