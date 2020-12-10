const path = require('path')
const { read, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('test.txt'), 'utf8')).trim()

  await solveForFirstStar(input)
  await solveForSecondStar(input)
}

function createAdapter (rating) {
  rating = Number.parseInt(rating)
  return {
    rating,
    compatability: [
      rating + 1,
      rating + 2,
      rating + 3
    ]
  }
}

function connectAdapter (adapter, index, adapters) {
  const { rating, compatability } = adapter
  const connections = adapters.filter(n => compatability.includes(n.rating)).map(n => n.rating)
  const connection = connections.length > 0 ? connections[0] : rating + 3
  const jolt = connection - rating
  return {
    rating,
    compatability,
    connections,
    connection,
    jolt
  }
}

function sortByAdapterRating (a, b) {
  const ar = a.rating
  const br = b.rating
  return ar - br
}

async function solveForFirstStar (input) {
  const adapters = input.split('\n').filter(n => n).map(createAdapter).sort(sortByAdapterRating)

  const connectedAdapters = adapters.map(connectAdapter)

  report('Connected', connectedAdapters)

  const jolt1Connections = connectedAdapters.filter(n => n.jolt === 1)
  const jolt3Connections = connectedAdapters.filter(n => n.jolt === 3)

  const solution = (jolt1Connections.length + 1) * jolt3Connections.length
  report('Solution 1:', solution, '1 Jolts:', (jolt1Connections.length + 1), '3 Jolts:', jolt3Connections.length)
}

async function solveForSecondStar (input) {
  const adapters = input.split('\n').filter(n => n).map(createAdapter).sort(sortByAdapterRating)
  const connectedAdapters = adapters.map(connectAdapter)

  const branch2Connections = connectedAdapters.filter(n => n.connections.length === 2)
  const branch3Connections = connectedAdapters.filter(n => n.connections.length === 3)

  const solution = Math.pow(2, branch3Connections.length + branch2Connections.length)
  const b2 = branch2Connections.length
  const b3 = branch3Connections.length
  const solutionDiff = 19208 - solution
  console.log(solution, b2, b3, b2 * b3, solutionDiff, solutionDiff / b2, solutionDiff / b3, Math.sqrt(solutionDiff))
  report('Solution 2:', solution, 'combinations from', connectedAdapters.length, 'connected adapters.')
}

run()
