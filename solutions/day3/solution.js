const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

async function solveForFirstStar (input) {
  const TILES = {
    TREE: '#',
    SNOW: '.'
  }

  const slopeMap = {}
  slopeMap.slice = input.split('\n').map(line => line.split(''))
  slopeMap.width = slopeMap.slice[0].length
  slopeMap.height = slopeMap.slice.length
  slopeMap.getPosition = (x, y) => {
    return slopeMap.slice[y][x % slopeMap.width]
  }

  const position = { x: 0, y: 0 }
  const route = [clone(position)]

  do {
    const location = slopeMap.getPosition(position.x, position.y)
    route.push({ x: position.x, y: position.y, tile: location })
    position.x = position.x + 3
    position.y = position.y + 1
  } while (position.y < slopeMap.height)

  console.log('Encounters:', route)

  const solution = route.filter(n => n.tile === TILES.TREE).length

  report('Solution 1:', solution, 'trees encountered out of', route.length, 'traversals')
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
