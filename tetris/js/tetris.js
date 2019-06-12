const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const nextPieceCanvas = document.getElementById('nextPiece')
const nextPieceCtx = nextPieceCanvas.getContext('2d')

ctx.scale(20, 20)
nextPieceCtx.scale(20, 20)
const arena = crateMatrix(12, 20)
var nextPiece = getRandomPiece()
const player = {
  pos: {x: 0, y: 0},
  matrix: null,
  score: 0
}

const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];

function arenaSweep() {
  let rowCount = 1
  outer: for (let y = arena.length - 1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0){
        continue outer
      }
    }
    const row = arena.splice(y, 1)[0].fill(0) //inmediatly access
    arena.unshift(row)
    y++
    player.score += rowCount * 10
    rowCount *= 2
  }
}

function collide (arena, player) {
  const [m, o] = [player.matrix, player.pos]
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 &&
        (arena[y + o.y] && //check if arena row exists
        arena[y + o.y][x + o.x]) !== 0) { //and if exists it checks if != 0
          return true
      }
    }
  }
  return false
}

function crateMatrix(w, h) {
  const matrix = []
  while (h--) { // 0 is considered false in JS
    matrix.push(new Array(w).fill(0))
  }
  return matrix 
}

function createPiece(type)
{
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

function draw() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height) 
  drawMatrix(arena, {x: 0, y: 0}, ctx) 
  drawMatrix(player.matrix, player.pos, ctx)

  nextPieceCtx.fillStyle = '#000'
  nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height)
  drawMatrix(nextPiece, {x:1, y:1}, nextPieceCtx) 

}

function drawMatrix(matrix, offset, ctx){
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = colors[value];
        ctx.fillRect(x + offset.x,
                     y + offset.y,
                     1, 1)
      }
    })
  })
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value
      }
    })
  })
}

function playerDrop() {
  player.pos.y++
  if (collide(arena, player)) {
    player.pos.y--
    merge(arena, player)
    playerReset()
    arenaSweep()
    updateScore()
  }
  dropCounter = 0
}

function playerXmove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir
  }
}

function getRandomPiece(){
  const pieces = 'ILJOTSZ'
  return createPiece(pieces[pieces.length * Math.random() | 0])
}

function playerReset() {
  
  player.matrix = nextPiece
  nextPiece = getRandomPiece()
  player.pos.y = 0
  player.pos.x = (arena[0].length / 2 | 0) - 
                  (player.matrix[0].length / 2 | 0)
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0))
    player.score = 0
    updateScore()
  }
}

function playerRotate(dir) {
  const pos = player.pos.x
  let offset = 1
  rotate(player.matrix, dir)
  while (collide(arena, player)) {
    player.pos.x += offset
    offset = -(offset + (offset > 0 ? 1 : -1))
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir)
      player.pos.x = pos
    }
  }
}

function rotate (matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ]
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse())
  } else {
    matrix.reverse()
  }
}

let dropCounter = 0
let dropInterval = 1000 // in miliseconds

let lastTime = 0
function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime
  if (dropCounter > dropInterval){
    playerDrop()
  }
  draw();
  requestAnimationFrame(update)
}

function updateScore() {
  document.getElementById('score').innerText = player.score
}

document.addEventListener('keydown', event => {
  switch (event.keyCode) {
    case 37:
      playerXmove(-1)
      break

    case 39:
      playerXmove(1)
      break

    case 40:
      playerDrop()
      break

    case 65:
      playerRotate(-1)
      break

    case 83:
      playerRotate(+1)
      break
  }
})

playerReset()
updateScore()
update()