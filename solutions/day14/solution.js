const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function parseBootLine (line) {
  let [instruction, value] = line.split(' = ')
  let address
  if (instruction !== 'mask') {
    [, instruction, address] = instruction.match(/(mem)\[(\d+)]/)
    address = Number.parseInt(address)
    value = Number.parseInt(value)
  }
  return {
    instruction,
    address,
    value
  }
}

async function solveForFirstStar (input) {
  const bootloader = input.split('\n').filter(n => n).map(parseBootLine)

  const solution = 'UNSOLVED'
  report('Boot Loader:', bootloader)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
