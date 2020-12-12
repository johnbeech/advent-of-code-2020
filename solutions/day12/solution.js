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
    x: ship.x + (offset.x * instruction.value),
    y: ship.y + (offset.y * instruction.value),
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

function drive (actions) {
  return (ship, instruction) => {
    const action = actions[instruction.action]
    if (ship.direction) {
      console.log('Ship:', ship.x, ',', ship.y, 'facing:', ship.direction, '- next instruction:', instruction.action, instruction.value)
    }
    if (ship.wx && ship.wy) {
      console.log('Ship:', ship.x, ',', ship.y, 'Waypoint:', ship.wx, ',', ship.wy, '- next instruction:', instruction.action, instruction.value)
    }
    return action(ship, instruction)
  }
}

async function solveForFirstStar (input) {
  const instructions = input.split('\n').filter(n => n).map(parseDirection)

  const startPosition = { x: 0, y: 0, direction: 'E' }
  const finalPosition = instructions.reduce(drive(actions), startPosition)

  const solution = Math.abs(finalPosition.x + finalPosition.y)
  report('Solution 1:', solution)
}

const waypointActions = {
  N: moveWaypoint,
  E: moveWaypoint,
  S: moveWaypoint,
  W: moveWaypoint,
  L: turnWaypoint,
  R: turnWaypoint,
  F: forwardToWaypoint
}

function moveWaypoint (ship, instruction) {
  return {
    x: ship.x,
    y: ship.y,
    wx: ship.wx + (instruction.offset.x * instruction.value),
    wy: ship.wy + (instruction.offset.y * instruction.value)
  }
}

function turnWaypoint (ship, instruction) {
  const turnDirection = instruction.action === 'L' ? -1 : 1
  let turnSteps = ((instruction.value / 90) * turnDirection + 4) % 4
  let wx = ship.wx
  let wy = ship.wy
  while (turnSteps > 0) {
    turnSteps--
    const owx = -wy
    const owy = wx
    wy = owx
    wx = owy
  }
  return {
    x: ship.x,
    y: ship.y,
    wx,
    wy
  }
}

function forwardToWaypoint (ship, instruction) {
  const x = ship.x + (instruction.value * ship.wx)
  const y = ship.y + (instruction.value * ship.wy)
  return {
    x,
    y,
    wx: ship.wx,
    wy: ship.wy
  }
}

async function solveForSecondStar (input) {
  const instructions = input.split('\n').filter(n => n).map(parseDirection)

  const startPosition = { x: 0, y: 0, wx: 10, wy: -1 }
  const finalPosition = instructions.reduce(drive(waypointActions), startPosition)

  const solution = Math.abs(finalPosition.x + finalPosition.y)
  report('Solution 2:', solution)
}

run()
