const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

const TILES = {
  TREE: '#',
  SNOW: '.'
}

function createSlopeMap (input) {
  const slopeMap = {}
  slopeMap.slice = input.split('\n').map(line => line.split(''))
  slopeMap.width = slopeMap.slice[0].length
  slopeMap.height = slopeMap.slice.length
  slopeMap.getPosition = (x, y) => {
    return slopeMap.slice[y][x % slopeMap.width]
  }
  return slopeMap
}

function traverse (slopeMap, { dx, dy }) {
  const position = { x: 0, y: 0 }
  const route = []

  do {
    const location = slopeMap.getPosition(position.x, position.y)
    route.push({ x: position.x, y: position.y, tile: location })
    position.x = position.x + dx
    position.y = position.y + dy
  } while (position.y < slopeMap.height)

  return route
}

function countEncounters (route) {
  return route.filter(n => n.tile === TILES.TREE).length
}

async function solveForFirstStar (input) {
  const slopeMap = createSlopeMap(input)

  const route = traverse(slopeMap, { dx: 3, dy: 1 })

  console.log('Encounters:', route)
  const solution = countEncounters(route)

  report('Solution 1:', solution, 'trees encountered out of', route.length, 'traversals')
}

async function solveForSecondStar (input) {
  const slopeMap = createSlopeMap(input)

  const routes = [
    { dx: 1, dy: 1 },
    { dx: 3, dy: 1 },
    { dx: 5, dy: 1 },
    { dx: 7, dy: 1 },
    { dx: 1, dy: 2 }
  ]

  const traversals = routes.map(route => traverse(slopeMap, route))
  console.log('Traversals', traversals)

  const encounters = traversals.map(countEncounters)
  console.log('Encounters', encounters)

  const solution = encounters.reduce((acc, item) => {
    return acc * item
  }, 1)

  report('Solution 2:', solution)
}

run()
