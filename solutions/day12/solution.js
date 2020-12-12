const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

const offsets = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 }
}

const directions = Object.keys(offsets)

function parseDirection (line) {
  console.log('LINE:', line)
  const [, action, value] = line.match(/([NESWLRF])(\d+)/)
  return {
    action,
    value: Number.parseInt(value),
    offset: offsets[action]
  }
}

const actions = {
  N: move,
  E: move,
  S: move,
  W: move,
  L: turn,
  R: turn,
  F: forward
}

function move (ship, instruction) {
  return {
    x: ship.x + instruction.offset.x * instruction.value,
    y: ship.y + instruction.offset.y * instruction.value,
    direction: ship.direction
  }
}

function forward (ship, instruction) {
  const offset = offsets[ship.direction]
  return {
    x: ship.x + offset.x * instruction.value,
    y: ship.y + offset.y * instruction.value,
    direction: ship.direction
  }
}

function turn (ship, instruction) {
  const turnDirection = instruction.action === 'L' ? -1 : 1
  const currentDirectionIndex = directions.indexOf(ship.direction)
  const newDirectionIndex = currentDirectionIndex + (instruction.value / 90 * turnDirection)
  const newDirection = directions[(newDirectionIndex + directions.length) % directions.length]
  return {
    x: ship.x,
    y: ship.y,
    direction: newDirection
  }
}

function drive (ship, instruction) {
  const action = actions[instruction.action]
  console.log('Ship:', ship.x, ',', ship.y, 'facing:', ship.direction, '- next instruction:', instruction.action, instruction.value)
  return action(ship, instruction)
}

async function solveForFirstStar (input) {
  const instructions = input.split('\n').filter(n => n).map(parseDirection)

  const startPosition = { x: 0, y: 0, direction: 'E' }
  const finalPosition = instructions.reduce(drive, startPosition)

  const solution = Math.abs(finalPosition.x + finalPosition.y)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
