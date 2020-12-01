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
  let solution = 'UNSOLVED'

  const numbers = input.split('\n').map(n => Number.parseInt(n))

  report(numbers)

  numbers.forEach(n => {
    const sums = numbers.filter(y => y + n === 2020)
    if (sums.length > 0) {
      console.log('Found a match')
      solution = sums[0] * n
    }
  })

  report('Input:', input)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
