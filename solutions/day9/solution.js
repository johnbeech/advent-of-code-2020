const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  const { solution, xmas } = await solveForFirstStar(input)
  await solveForSecondStar(solution, xmas)
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

  const solution = xmas.filter(x => x.sums.length === 0 && x.index >= preambleSize)[0].number
  report('Solution 1:', solution)
  return {
    solution,
    xmas
  }
}

async function solveForSecondStar (seed, xmas) {
  let encryptionWeakness = '?'
  const weaknesses = xmas.map((x, index, xmas) => {
    const checkedValues = [x.number]
    let lowerBound = x.number
    let upperBound = lowerBound
    let runningTotal = lowerBound
    let next
    do {
      next = xmas[index + checkedValues.length]
      if (next) {
        lowerBound = Math.min(lowerBound, next.number)
        upperBound = Math.max(upperBound, next.number)
        runningTotal = runningTotal + next.number
        checkedValues.push(next.number)
      }
    } while (runningTotal < seed && next)
    encryptionWeakness = lowerBound + upperBound
    if (runningTotal === seed) {
      console.log(checkedValues)
      report('Lower bound:', lowerBound, 'Upper bound:', upperBound, 'Total:', runningTotal, 'Seed:', seed, 'Checked values:', checkedValues.length, 'Encryption weakness:', encryptionWeakness)
    }
    return {
      lowerBound,
      upperBound,
      runningTotal,
      seed,
      checkedValues,
      encryptionWeakness
    }
  })

  const validWeaknesses = weaknesses.filter(n => n.runningTotal === seed && n.checkedValues.length > 1)
  report('Found', validWeaknesses.length, 'valid weaknesses.')

  const solution = validWeaknesses[0].encryptionWeakness
  report('Solution 2:', solution)
}

run()
