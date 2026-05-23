const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
const data = [500, 600, 200, 300, 700, 400, 350]
const padding = 50
const sectionWidth = (canvas.width - padding) / data.length
const max = Math.max(...data)
const duration = 1000
let startTime

function render(progress) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  data.forEach((e, i) => {
    ctx.fillRect(
      sectionWidth * i + padding,      // x: 막대 시작 위치
      canvas.height - padding,         // y: 바닥에서 시작
      sectionWidth - padding,          // width: 막대 가로 너비
      -valueToHeight(e) * progress     // height: 막대 세로 높이 (음수 = 위로)
    )
  })
  ctx.strokeStyle = "#ccc"
  ctx.beginPath()
  ctx.moveTo(padding, canvas.height - padding)
  ctx.lineTo(canvas.width - padding, canvas.height - padding)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, canvas.height - padding)
  ctx.stroke()

  data.forEach((data, i) => {
    ctx.strokeStyle = "#ccc"
    ctx.beginPath()
    ctx.moveTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    ctx.font = '20px sans-serif'
    ctx.fillText("X", padding - 20, canvas.height - padding - 20)
    ctx.fillText("Y", padding, canvas.height - padding + 20)
  })
}

function valueToHeight(value) { // 값을 높이로 변환
  return (canvas.height - padding * 2) / max * value
  // (캔버스에 그릴 영역) / 최대값 * 현재값
  // => 이러면 최대값 비율에 맞춰서 다른 그래프들도 그려짐
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp // 최초 1회 실행
  const elapsed = timestamp - startTime // 경과 시간
  const progress = Math.min(elapsed / duration, 1) // 0.0 ~ 1.0 진행률

  render(progress)
  // 1초에 60번 render()을 실행하며 인자로 쭉 증가하는 progress를 보내 높이값에 곱해서
  // ex) 700 * 0.1 => 700 * 0.2 ... 쭉 증가하며 높이가 700 * 0에서 700 * 1이 된다.
  if (progress < 1) requestAnimationFrame(animate) // progress가 1이 되기 전까지 animate 함수를 계속 실행한다
}

requestAnimationFrame(animate) // 최초 1번 실행

/* 
  브라우저 호출          timestamp    elapsed    progress
  ─────────────────────────────────────────────────────
  animate(1000)    →    1000ms       0ms        0.00  ← startTime 저장
  animate(1016)    →    1016ms       16ms       0.016
  animate(1032)    →    1032ms       32ms       0.032
  ...
  animate(2000)    →    2000ms       1000ms     1.00  ← 애니메이션 종료
*/