const path = require('path')
const { read, write, position } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../../package.json')).logName} / ${__dirname.split(path.sep).pop()}]`, ...messages)

async function run () {
  const input = (await read(fromHere('input.txt'), 'utf8')).trim()
  const rules = input.split('\n').filter(n => n).map(parseRule)

  await write(fromHere('rules.json'), JSON.stringify(rules, null, 2), 'utf8')
  const hierarchy = mapBagHierarchy(rules)

  await write(fromHere('hierarchy.json'), JSON.stringify(hierarchy, null, 2), 'utf8')
  console.log(hierarchy['shiny:gold'])

  await solveForFirstStar(hierarchy)
  await solveForSecondStar(hierarchy)
}

function parseBag (line) {
  // 1 drab beige bag
  report('Parse Bag', line)
  const [, quantity, style, color] = line.match(/(\d+)\s([a-z]+)\s([a-z]+)\sbag/)
  const key = `${style}:${color}`
  const bag = {
    key,
    style,
    color,
    quantity: Number.parseInt(quantity)
  }
  report('Parse bag', line, ':', bag)
  return bag
}

function parseRule (line) {
  // vibrant red bags contain 1 drab beige bag.
  // striped beige bags contain no other bags.
  const [left, right] = line.replace('.', '').split(' bags contain ')
  const bagContainer = left
  const [style, color] = bagContainer.split(' ')
  const key = `${style}:${color}`
  if (right === 'no other bags') {
    return {
      key,
      style,
      color,
      contains: []
    }
  } else {
    const contains = right.split(', ').map(parseBag)
    return {
      key,
      style,
      color,
      contains
    }
  }
}

function leafNodesFirst (a, b) {
  const an = a.contains.length
  const bn = b.contains.length
  return an - bn
}

function mapBagHierarchy (rules) {
  const tree = {}
  rules.sort(leafNodesFirst).forEach(rule => {
    const node = tree[rule.key] ? tree[rule.key] : { parents: [] }
    node.rule = rule
    tree[rule.key] = node
    rule.contains.forEach(bag => {
      const child = tree[bag.key] ? tree[bag.key] : { parents: [] }
      child.parents.push(rule.key)
      tree[bag.key] = child
    })
  })
  return tree
}

function findParents (searchKey, hierarchy, result, depth = 0) {
  const node = hierarchy[searchKey]
  // store node
  if (depth > 0) {
    const { key, style, color } = node.rule
    result.push({ key, style, color })
  }

  // and parents of parent
  node.parents.forEach(parent => {
    findParents(parent, hierarchy, result, depth + 1)
  })

  return result
}

function findChildren (searchKey, hierarchy, result) {
  const node = hierarchy[searchKey]

  node.rule.contains.forEach(child => {
    const { key, style, color, quantity } = child
    for (let i = 0; i < quantity; i++) {
      result.push({ key, style, color })
      findChildren(child.key, hierarchy, result)
    }
  })

  return result
}

async function solveForFirstStar (hierarchy) {
  const topLevelParents = findParents('shiny:gold', hierarchy, [])
  await write(fromHere('shiny-gold-parents.json'), JSON.stringify(topLevelParents, null, 2), 'utf8')

  const uniqueBagColours = Array.from(new Set(topLevelParents.map(n => n.key)))
  report('Unique Bag Colours', uniqueBagColours)

  const solution = uniqueBagColours.length
  report('Solution 1:', solution)
}

async function solveForSecondStar (hierarchy) {
  const bagRules = findChildren('shiny:gold', hierarchy, [])
  await write(fromHere('shiny-gold-bag-rules.json'), JSON.stringify(bagRules, null, 2), 'utf8')

  const solution = bagRules.length
  report('Solution 2:', solution)
}

run()
