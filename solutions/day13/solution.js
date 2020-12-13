const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function parseTimetable (input) {
  const [timestamp, serviceLine] = input.split('\n').filter(n => n)
  const serviceIds = serviceLine.split(',').filter(n => n !== 'x').map(n => Number.parseInt(n))
  return {
    timestamp: Number.parseInt(timestamp),
    serviceIds
  }
}

async function solveForFirstStar (input) {
  const timetable = parseTimetable(input)

  const arrivals = timetable.serviceIds.map(serviceId => {
    return {
      serviceId,
      arrival: Math.floor(timetable.timestamp / serviceId) * serviceId,
      waitTime: serviceId - (timetable.timestamp % serviceId)
    }
  }).sort((a, b) => a.waitTime - b.waitTime)

  report('Timetable', timetable)
  report('Arrivals', arrivals)

  const nextBus = arrivals[0]
  const solution = nextBus.serviceId * nextBus.waitTime
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const solution = 'UNSOLVED'
  report('Solution 2:', solution)
}

run()
