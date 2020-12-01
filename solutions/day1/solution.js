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
  const numbers = input.split('\n').map(n => Number.parseInt(n))

  report('Input:', numbers.length, 'numbers in a list')

  const sums = []
  numbers.forEach(a => {
    numbers.forEach(b => {
      sums.push({ a, b, sum: a + b, product: a * b })
    })
  })

  const solution = sums.filter(n => n.sum === 2020)[0]
  report('Solution 1:', solution.product, solution)
}

async function solveForSecondStar (input) {
  const numbers = input.split('\n').map(n => Number.parseInt(n))
  const sums = []
  numbers.forEach(a => {
    numbers.forEach(b => {
      numbers.forEach(c => {
        sums.push({ a, b, c, sum: a + b + c, product: a * b * c })
      })
    })
  })

  const solution = sums.filter(n => n.sum === 2020)[0]
  report('Solution 2:', solution.product, solution)
}

run()
