const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function parseGroup (groupText) {
  const lines = groupText.split('\n')
  const answers = lines.join('').split('').reduce((acc, item) => {
    acc[item] = acc[item] ? acc[item] + 1 : 1
    return acc
  }, {})

  return {
    answers,
    count1: Object.keys(answers).length,
    count2: Object.values(answers).filter(n => n === lines.length).length
  }
}

async function solveForFirstStar (input) {
  const groups = input.split('\n\n').filter(n => n).map(parseGroup)

  report('Groups', groups)

  const solution = groups.reduce((acc, item) => {
    return acc + item.count1
  }, 0)
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const groups = input.split('\n\n').filter(n => n).map(parseGroup)

  const solution = groups.reduce((acc, item) => {
    return acc + item.count2
  }, 0)
  report('Solution 2:', solution)
}

run()
