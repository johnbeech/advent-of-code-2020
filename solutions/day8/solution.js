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
  // report('Computing', history[history.length - 1])
  return operations[op.code]({ program, acc, pos })
}

function runComputer (program) {
  let computer = { program, acc: 0, pos: 0 }
  let status = 'running'
  const history = []
  const computedCodes = {}
  do {
    computedCodes[computer.pos] = (computedCodes[computer.pos] || 0) + 1
    if (!program[computer.pos]) {
      report('Terminating program; no operation found at:', computer.pos, 'of program length:', program.length)
      status = 'terminated'
    } else if (computedCodes[computer.pos] === 1) {
      computer = compute(computer, history)
    } else {
      report('Infite loop detected; breaking program at:', computer.pos, 'after', history.length, 'computations.')
      status = 'infinite loop'
    }
  } while (status === 'running')

  return { computer, history, computedCodes, status }
}

async function solveForFirstStar (input) {
  const program = input.split('\n').filter(n => n).map(parseOpCode)

  const { computer } = runComputer(program)

  const solution = computer.acc
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const program = input.split('\n').filter(n => n).map(parseOpCode)

  const possibleCodes = program.filter((op, index) => {
    const nopOrJmp = op.code === 'nop' || op.code === 'jmp'
    op.pos = index
    return nopOrJmp
  })

  report('Possible codes', possibleCodes)

  const computations = possibleCodes.map(op => {
    const modifiedProgram = JSON.parse(JSON.stringify(program))
    modifiedProgram[op.pos].code = op.code === 'jmp' ? 'nop' : 'jmp'
    return runComputer(modifiedProgram)
  })

  const terminations = computations.filter(n => n.status === 'terminated')
  report('Found', terminations.length, 'terminated programs out of', computations.length, 'computations.')

  const solution = terminations[0].computer.acc
  report('Solution 2:', solution)
}

run()
