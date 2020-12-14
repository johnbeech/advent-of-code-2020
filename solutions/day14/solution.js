const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('test.txt'), 'utf8')).trim()

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

function maskValue (value, mask) {
  const binaryValue = value.toString(2).split('')
  const binaryString = mask.map((maskBit, index) => {
    const valueBit = binaryValue[index] || 0
    return maskBit === 'X' ? valueBit : maskBit
  }).join('')
  console.log('Mapped', value)
  console.log('BV', binaryString)
  console.log('MS', mask.join(''))
  console.log('BS', binaryString)
  console.log('to:', Number.parseInt(binaryString, 2))
  return Number.parseInt(binaryString, 2)
}

function setComputerMemory (item, computer) {
  computer.memory[item.address] = maskValue(item.value, computer.mask)
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
