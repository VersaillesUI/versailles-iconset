const fs = require('fs')
const path = require('path')
const axios = require('axios')
const { Readable } = require('stream')

const base = path.resolve(process.cwd(), '.cache')
const resolvePath = (...paths) => path.join(base, ...paths)
const ID = 'http-import-plugin'

class HttpImportPlugin {
  constructor () {
    fs.stat(base, (err) => {
      if (err) {
        fs.mkdirSync(base)
      }
    })
  }
  apply (compiler) {
    compiler.resolverFactory.hooks.resolver
      .for('normal')
      .tap(ID, (resolver) => {
        const resolvedHook = resolver.ensureHook('resolve')

        resolver.getHook(`described-resolve`)
          .tapAsync(ID, async (requestContext, resolveContext, callback) => {
            if(/https?:\/\//.test(requestContext.request)) {
              const url = requestContext.request + requestContext.query
              const filename = path.basename(requestContext.request)
              requestContext.request = resolvePath(filename)
              return axios.get(url).then(res => res.data)
                .then(res => {
                  Readable.from(res).pipe(fs.createWriteStream(resolvePath([filename])))
                  resolver.doResolve(resolvedHook, requestContext, null, resolveContext, callback)
                })
            } else {
              callback()
            }
          })
      })
  }
}

module.exports = HttpImportPlugin