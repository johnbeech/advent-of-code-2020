const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

// Solution 1 functions

function passwordParserByMinMax (line) {
  const [, min, max, policy, password] = line.match(/(\d+)-(\d+)\s([a-z]):\s([a-z]+)/)
  return { min, max, policy, password }
}

function validatePasswordByMinMax ({ min, max, policy, password }) {
  const policyCount = password.split('').filter(c => c === policy).length
  return (policyCount >= min) && (policyCount <= max)
}

async function solveForFirstStar (input) {
  const passwords = input.split('\n').filter(n => n).map(passwordParserByMinMax)
  const validPasswords = passwords.filter(validatePasswordByMinMax)

  report('Valid passwords', validPasswords)

  const solution = validPasswords.length
  report('Solution 1:', solution)
}

// Solution 2 functions

function passwordParserByPosition (line) {
  const [, position1, position2, policy, password] = line.match(/(\d+)-(\d+)\s([a-z]):\s([a-z]+)/)
  return { position1: Number(position1), position2: Number(position2), policy, password }
}

function XOR (a, b) {
  return (a || b) && !(a && b)
}

function validatePasswordByPosition ({ position1, position2, policy, password }) {
  return XOR(password.charAt(position1 - 1) === policy, password.charAt(position2 - 1) === policy)
}

async function solveForSecondStar (input) {
  const passwords = input.split('\n').filter(n => n).map(passwordParserByPosition)
  const validPasswords = passwords.filter(validatePasswordByPosition)

  const solution = validPasswords.length
  report('Solution 2:', solution)
}

run()
