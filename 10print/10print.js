//  Const

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const lineSize = 20

//  Functions and Procedures

function tenPrint () {
  let x = 0
  let y = 0
  ctx.strokeStyle = 'blue'
  while (y < canvas.height) {
    while (x < canvas.width) {
      if (Math.random() >= 0.5) {
        drawSlash(x, y)
      } else {
        drawBackSlash(x, y + lineSize)
      }
      x += lineSize
    }
    x = 0
    y += lineSize
  }
}

function drawSlash (x, y) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + lineSize, y + lineSize)
  ctx.stroke()
}

function drawBackSlash (x, y) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + lineSize, y - lineSize)
  ctx.stroke()
}

//  MAIN

tenPrint()
