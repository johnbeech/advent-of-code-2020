const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function parseOpCode (line) {
  const [, code, value] = line.match(/(acc|jmp|nop)\s([+-]\d+)/)
  return {
    code,
    value: Number.parseInt(value)
  }
}

const operations = {
  acc: computeAcc,
  nop: computeNop,
  jmp: computeJmp
}

function computeAcc ({ program, acc, pos }) {
  const op = program[pos]
  return { program, acc: acc + op.value, pos: pos + 1 }
}

function computeNop ({ program, acc, pos }) {
  return { program, acc, pos: pos + 1 }
}

function computeJmp ({ program, acc, pos }) {
  const op = program[pos]
  return { program, acc, pos: pos + op.value }
}

function compute ({ program, acc, pos }, history) {
  const op = program[pos]
  history.push({ code: op.code, value: op.value, acc, pos })
  report('Computing', history[history.length - 1])
  return operations[op.code]({ program, acc, pos })
}

async function solveForFirstStar (input) {
  const program = input.split('\n').filter(n => n).map(parseOpCode)

  let computer = { program, acc: 0, pos: 0 }
  let running = true
  const history = []
  const computedCodes = {}
  do {
    computedCodes[computer.pos] = (computedCodes[computer.pos] || 0) + 1
    if (computedCodes[computer.pos] === 1) {
      computer = compute(computer, history)
    } else {
      report('Infite loop detected; breaking program at:', computer, 'after', history.length, 'computations.')
      running = false
    }
  } while (running)

  const solution = computer.acc
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
