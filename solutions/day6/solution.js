const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function parseGroups (groupText) {
  const answers = groupText.split('\n').join('').split('').reduce((acc, item) => {
    acc[item] = true
    return acc
  }, {})

  return {
    answers,
    count: Object.keys(answers).length
  }
}

async function solveForFirstStar (input) {
  const groups = input.split('\n\n').filter(n => n).map(parseGroups)

  report('Groups', groups)

  const solution = groups.reduce((acc, item) => {
    return acc + item.count
  }, 0)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
