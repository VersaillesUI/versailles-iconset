import accountsBoost from "@accounts/boost"

(async () => {

  const accounts = await accountsBoost({
    tokenSecret: 'your secret'
  });
  const accountsServer = await accounts.listen({
    port: 4003
  });

})()

const next = require('next')
const express = require('express')
const compression = require('compression')
const spdy = require('spdy')
const path = require('path')
const fs = require('fs')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()

const options = {
  key: fs.readFileSync(path.join(process.cwd(), 'cert/ca_private.key')),
  cert: fs.readFileSync(path.join(process.cwd(), 'cert/ca.crt'))
}

const shouldCompress = (req, res) => {
  if(req.headers['x-no-compression']) {
    return false
  }
  return compression.filter(req, res)
}

app.prepare().then(() => {
  const expressApp = express()

  expressApp.use(compression({ filter: shouldCompress }))

  expressApp.all('*', (req, res) => {
    return handle(req, res)
  })

  spdy.createServer(options, expressApp).listen(port, error => {
    if(error) {
      console.error(error)
      return process.exit(1)
    } else {
      console.log(`HTTP/2 server listening on port: ${port}`)
    }
  })
})