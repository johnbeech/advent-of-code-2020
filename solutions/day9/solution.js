const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

async function solveForFirstStar (input) {
  const preambleSize = 25

  const xmas = input.split('\n').filter(n => n).map((n, index) => {
    const number = Number.parseInt(n)
    return {
      number,
      lowerBound: Math.max(0, index - preambleSize),
      index,
      sums: []
    }
  })

  xmas.forEach((x, index, xmas) => {
    const previousNumbers = xmas.slice(x.lowerBound, x.index)
    if (previousNumbers.length === preambleSize) {
      previousNumbers.forEach(ax => {
        previousNumbers.forEach(bx => {
          const sum = ax.number + bx.number
          // report(x.number, ':', ax.number, '+', bx.number, '=', sum)
          if (sum === x.number) {
            x.sums.push(sum)
          }
        })
      })
    }
  })

  const solution = xmas.filter(x => x.sums.length === 0 && x.index >= preambleSize)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
