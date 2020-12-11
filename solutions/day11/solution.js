const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

const states = {
  CHAIR_EMPTY: 'L',
  CHAIR_OCCUPIED: '#',
  FLOOR: '.'
}

const neighbourOffsets = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 }
]

const outOfBoundsCell = {
  state: states.FLOOR
}

function advance (game) {
  const newGameState = { grid: {}, occupiedSeats: 0, diff: 0 }
  Object.values(game.grid).forEach(cell => {
    const occupiedNeighbours = cell.neighbours.filter(key => (game.grid[key] || outOfBoundsCell).state === states.CHAIR_OCCUPIED).length
    let newCellState
    if (cell.state === states.CHAIR_EMPTY && occupiedNeighbours === 0) {
      newCellState = states.CHAIR_OCCUPIED
    } else if (cell.state === states.CHAIR_OCCUPIED && occupiedNeighbours >= 4) {
      newCellState = states.CHAIR_EMPTY
    } else {
      newCellState = cell.state
    }
    const newCell = { key: cell.key, state: newCellState, neighbours: cell.neighbours }
    newGameState.grid[cell.key] = newCell
    newGameState.occupiedSeats = newCellState === states.CHAIR_OCCUPIED ? newGameState.occupiedSeats + 1 : newGameState.occupiedSeats
  })
  newGameState.diff = newGameState.occupiedSeats - game.occupiedSeats
  return newGameState
}

function parseGridLine (acc, gridLine, row) {
  gridLine.split('').forEach((cell, col) => {
    const key = `${col}:${row}`
    const neighbours = neighbourOffsets.map(offset => {
      return `${col + offset.x}:${row + offset.y}`
    })
    acc[key] = { key, state: cell, neighbours }
  })
  return acc
}

async function solveForFirstStar (input) {
  const grid = input.split('\n').reduce(parseGridLine, {})

  let gameOfStrife = {
    grid,
    diff: 0,
    occupiedSeats: 0
  }
  do {
    const { grid } = gameOfStrife
    const emptySeats = Object.values(grid).filter(c => c.state === states.CHAIR_EMPTY).length
    const occupiedSeats = Object.values(grid).filter(c => c.state === states.CHAIR_OCCUPIED).length
    const floorTiles = Object.values(grid).filter(c => c.state === states.FLOOR).length
    console.log('Empty:', emptySeats, 'Occupied:', occupiedSeats, 'Floor:', floorTiles, 'Diff:', gameOfStrife.diff)

    gameOfStrife = advance(gameOfStrife)
  } while (gameOfStrife.diff !== 0)

  const emptySeats = Object.values(gameOfStrife.grid).filter(c => c.state === states.CHAIR_EMPTY).length
  const occupiedSeats = Object.values(gameOfStrife.grid).filter(c => c.state === states.CHAIR_OCCUPIED).length
  const floorTiles = Object.values(gameOfStrife.grid).filter(c => c.state === states.FLOOR).length

  const solution = occupiedSeats
  report('Solution 1:', solution, 'Empty:', emptySeats, 'Occupied:', occupiedSeats, 'Floor:', floorTiles, 'Diff:', gameOfStrife.diff)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
