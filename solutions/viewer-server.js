const path = require('path')
const express = require('express')
const { position, find, write } = require('promise-path')
const fromHere = position(__dirname)
const report = (...messages) => console.log(`[${require(fromHere('../package.json')).logName} / ${__filename.split(path.sep).pop().split('.js').shift()}]`, ...messages)

const app = express()
const packageData = require('../package.json')

async function generateIndexHTML () {
  const title = packageData.logName
  const solutions = await find(fromHere('/*'))
  const links = solutions
    .filter(n => n.indexOf('.js') === -1 && n.indexOf('.html') === -1)
    .sort((a, b) => {
      const af = Number.parseInt(a.substr(fromHere('./').length).replace('day', ''))
      const bf = Number.parseInt(b.substr(fromHere('./').length).replace('day', ''))
      return af - bf
    })
    .map(solution => {
      const folder = solution.substr(fromHere('./').length)
      return `      <li><a href="./${folder}/viewer.html">${folder}</a></li>`
    })

  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <style> html, body { font-family: sans-serif; }</style>
  </head>
  <body>
    <h1>${title}</h1>
    <ul>
${links.join('\n')}
    </ul>
  </body>
</html>
  `

  report('Updated hard coded index:', fromHere('index.html'))
  await write(fromHere('index.html'), html, 'utf8')

  if (process.argv[2] === 'then-stop') {
    process.exit(0)
  }

  return html
}

app.use('/solutions', express.static(fromHere('')))

app.get('/', async (req, res) => {
  await generateIndexHTML()
  const title = packageData.logName
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
      <style> html, body { font-family: sans-serif; }</style>
    </head>
    <body>
      <h1>${title}</h1>
      <ul>
        <li><a href="./solutions/">Solution Explorer</a></li>
      </ul>
      <p>This page will be replaced with a rendered README.md when hosted by Github Pages.</p>
    </body>
  </html>
    `
  res.send(html)
})

const port = 8080
app.listen(port, () => report(`Listening on http://localhost:${port}/`))

generateIndexHTML()