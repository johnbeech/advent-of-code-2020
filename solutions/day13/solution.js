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
  const serviceIds = serviceLine.split(',')
  return {
    timestamp: Number.parseInt(timestamp),
    serviceIds
  }
}

async function solveForFirstStar (input) {
  const timetable = parseTimetable(input)

  const arrivals = timetable.serviceIds.filter(n => n !== 'x').map(serviceId => {
    const cadence = Number.parseInt(serviceId)
    return {
      serviceId,
      cadence,
      arrival: Math.floor(timetable.timestamp / cadence) * cadence,
      waitTime: cadence - (timetable.timestamp % cadence)
    }
  }).sort((a, b) => a.waitTime - b.waitTime)

  report('Timetable', timetable)
  report('Arrivals', arrivals)

  const nextBus = arrivals[0]
  const solution = nextBus.serviceId * nextBus.waitTime
  report('Solution 1:', solution)
}

async function solveForSecondStar (input) {
  const timetable = parseTimetable(input)
  const searchSpace = timetable.serviceIds.map((serviceId, offset) => {
    return {
      serviceId,
      cadence: Number.parseInt(serviceId),
      offset
    }
  }).filter(n => n.serviceId !== 'x').sort((a, b) => a.offset - b.offset)

  console.log('Search space', searchSpace)

  let time = 0
  let count = 0
  const firstBus = searchSpace.shift()
  let increment = firstBus.cadence
  searchSpace.forEach(bus => {
    console.log('Lining up bus:', bus.cadence, 'at increment:', increment, 'time:', time, 'count:', count)
    let remainder
    do {
      time = time + increment
      remainder = (time + bus.offset) % bus.cadence
      count++
    } while (remainder !== 0)
    increment *= bus.cadence
  })
  console.log('Used', count, 'loops to find answer')

  const solution = time
  report('Solution 2:', solution)
}

run()
