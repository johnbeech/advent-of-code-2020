const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function parsePass (code) {
  const row = code.substr(0, 7).split('').reduce((range, instruction) => {
    const space = range.high - range.low
    const half = space / 2
    return (instruction === 'F') ? { low: range.low, high: range.low + half } : { low: range.high - half, high: range.high }
  }, { low: 0, high: 128 }).low
  const col = code.substr(7, 3).split('').reduce((range, instruction) => {
    const space = range.high - range.low
    const half = space / 2
    return (instruction === 'L') ? { low: range.low, high: range.low + half } : { low: range.high - half, high: range.high }
  }, { low: 0, high: 8 }).low
  return {
    code,
    row,
    col,
    id: row * 8 + col
  }
}

async function solveForFirstStar (input) {
  const passes = input.split('\n').map(parsePass)

  const sortedPasses = passes.sort((a, b) => {
    const ida = a.id
    const idb = b.id
    return ida - idb
  })

  report(sortedPasses)

  const solution = sortedPasses.reverse()[0]

  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
