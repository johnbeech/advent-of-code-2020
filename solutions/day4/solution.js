const path = require('path')
const { read, write, position } = require('promise-path')
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

function validateHeight (height) {
  const matches = height.match(/(\d+)([A-z]+)/)
  if (!matches) {
    return false
  }

  const [, value, unit] = matches
  if (unit === 'cm') {
    return value >= 150 && value <= 193
  }
  if (unit === 'in') {
    return value >= 59 && value <= 76
  }
  return false
}

function validateHairColor (hairColor) {
  return /#[0-9a-f]{6}/.test(hairColor)
}
function validateEyeColor (hairColor) {
  return [
    'amb',
    'blu',
    'brn',
    'gry',
    'grn',
    'hzl',
    'oth'
  ].includes(hairColor)
}

function validatePassportId (id) {
  return /[0-9]{9}/.test(id)
}

async function solveForSecondStar (input) {
  const passports = input.split('\n\n').filter(n => n).map(parsePassportRecord)

  console.log(passports)
  console.log('Found', passports.length, 'records in file')

  const validPassports = passports.filter(p => {
    const expcetedFields = p.byr && p.iyr && p.eyr && p.hgt && p.hcl && p.ecl && p.pid
    if (!expcetedFields) {
      return false
    }

    const validBirthYear = Number.parseInt(p.byr) >= 1920 && Number.parseInt(p.byr) <= 2002
    const validIssueYear = Number.parseInt(p.iyr) >= 2010 && Number.parseInt(p.iyr) <= 2020
    const validExpirationYear = Number.parseInt(p.eyr) >= 2020 && Number.parseInt(p.eyr) <= 2030
    const validHeight = validateHeight(p.hgt)
    const validHairColor = validateHairColor(p.hcl)
    const validEyeColor = validateEyeColor(p.ecl)
    const validPassportId = validatePassportId(p.pid)

    return validBirthYear && validIssueYear && validExpirationYear && validHeight && validHairColor && validEyeColor && validPassportId
  }).map(p => {
    return {
      birthYear: p.byr,
      issueYear: p.iyr,
      expirationYear: p.eyr,
      height: p.hgt,
      hairColor: p.hcl,
      eyeColor: p.ecl,
      passportId: p.pid
    }
  })

  await write(fromHere('part2-valid-passports.json'), JSON.stringify(validPassports, null, 2), 'utf8')

  const solution = validPassports.length
  report('Solution 2:', solution)
}

run()
