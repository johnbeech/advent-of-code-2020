const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function passwordParser (line) {
  const [, min, max, policy, password] = line.match(/(\d+)-(\d+)\s([a-z]):\s([a-z]+)/)
  return { min, max, policy, password }
}

function validatePassword ({ min, max, policy, password }) {
  const policyCount = password.split('').filter(c => c === policy).length
  return (policyCount >= min) && (policyCount <= max)
}

async function solveForFirstStar (input) {
  const passwords = input.split('\n').filter(n => n).map(passwordParser)
  const validPasswords = passwords.filter(validatePassword)

  report('Valid passwords', validPasswords)

  const solution = validPasswords.length
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
