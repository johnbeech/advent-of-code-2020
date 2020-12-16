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

function maskValue (value, mask, address) {
  const binaryValues = value.toString(2).split('')
  while (binaryValues.length < mask.length) {
    binaryValues.unshift(0)
  }
  const binaryResults = mask.map((maskBit, index) => {
    const valueBit = binaryValues[index] || 0
    return maskBit === 'X' ? valueBit : maskBit
  })
  const binaryResult = binaryResults.join('')
  console.log('Mapped', value)
  console.log('BV', binaryValues.join(''))
  console.log('MS', mask.join(''))
  console.log('BR', binaryResult)
  console.log('to:', Number.parseInt(binaryResult, 2), 'at address:', address)
  return Number.parseInt(binaryResult, 2)
}

function setComputerMemory (item, computer) {
  computer.memory[item.address] = maskValue(item.value, computer.mask, item.address)
  return computer
}

function setComputerMask (item, computer) {
  computer.mask = item.value.split('')
  return computer
}

const actions = {
  mem: setComputerMemory,
  mask: setComputerMask
}

async function solveForFirstStar (input) {
  const bootloader = input.split('\n').filter(n => n).map(parseBootLine)
  const computer = bootloader.reduce((computer, item) => {
    const action = actions[item.instruction]
    return action(item, computer)
  }, { mask: false, memory: {} })

  report('Boot Loader:', bootloader)
  report('Computer State:', computer)

  const solution = Object.values(computer.memory).reduce((acc, item) => acc + item, 0)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
