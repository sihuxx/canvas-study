// 공통 데이터
const data = [
  { label: '1월', value: 65 },
  { label: '2월', value: 72 },
  { label: '3월', value: 88 },
  { label: '4월', value: 95 },
  { label: '5월', value: 120 },
  { label: '6월', value: 102 },
];
const colors = ['#4A90D9', '#5BAD8F', '#E8924A', '#A97FD4', '#E8C54A', '#D95B7A'];

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')

const values = data.map(d => d.value) // data에서 value만 가져온 배열
const max = Math.max(...values) // 스프레드 형태로 배열 벗어남

// 차트 넓이, 패딩 값
const width = 600
const height = 200
const paddingBottom = 30
const paddingTop = 10
const paddingLeft = 10

const slotW = (width - paddingLeft) / data.length // 차트 바 슬롯 width (각 바 width + 양 옆 여백)
const barW = slotW * 0.55 // 차트 바 width

data.forEach(({ label, value }, i) => {
  const bh = (value / max) * (height - paddingBottom - paddingTop) // 각 바 높이
  // (현재 값 / 최대값) * 바가 그려질 전채 높이)
  const x = paddingLeft + slotW * i + (slotW - barW) / 2
  // 왼쪽 패딩 + 슬롯 넓이 * i + (슬롯 넓이 - 바 넓이) / 2
  // (i = 0) 10 + 98 * 0 + (98 - 54) / 2 = 32px
  /* 
    paddingLeft          → 왼쪽 여백만큼 오른쪽으로
    slotW * i            → i번째 칸으로 이동
    (slotW - barW) / 2   → 칸 안에서 막대를 중앙 정렬
  */
  const y = paddingTop + (height - paddingBottom - paddingTop) - bh
  // y = 10 + 160 - 94 = 76px   ← 여기서 시작해서 아래로 94px 그림
  // y = 10 + 160 - 160 = 10px   ← padT 바로 아래, 거의 꼭대기

  // 막대 그리기 
  ctx.fillStyle = colors[i]
  ctx.fillRect(x, y, barW, bh)

  // 라벨 그리기 
  ctx.fillStyle = "#888"
  ctx.textAlign = "center"
  ctx.fillText(label, x + barW / 2, height - 8)

  // 값 라벨 그리기 
  ctx.fillStyle = "#888"
  ctx.fillText(value, x + barW / 2, y - 4)
})