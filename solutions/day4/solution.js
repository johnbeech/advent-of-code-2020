const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function parsePassportRecord (record) {
  const pairs = record.split('\n').join(' ').split(' ')
  const passport = pairs.reduce((acc, pair) => {
    const [key, value] = pair.split(':')
    acc[key] = value
    return acc
  }, {})
  return passport
}

async function solveForFirstStar (input) {
  const passports = input.split('\n\n').filter(n => n).map(parsePassportRecord)

  console.log(passports)
  console.log('Found', passports.length, 'records in file')

  const validPassports = passports.filter(p => p.byr && p.iyr && p.eyr && p.hgt && p.hcl && p.ecl && p.pid)
  const solution = validPassports.length
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
