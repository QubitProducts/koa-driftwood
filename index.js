const chalk = require('chalk')

module.exports = function createExpressLogger (log, options) {
  options = parseOptions(options)

  return async function logger (ctx, next) {
    const start = Date.now()

    await next()
    logRequest(ctx, start)
  }

  function logRequest (ctx, start) {
    const url = ctx.originalUrl

    if (shouldIgnore(url)) {
      return
    }

    const status = ctx.status
    const duration = Date.now() - start

    let logLevel
    let color
    if (status >= 100) {
      logLevel = 'info'
      color = 'green'
    }
    if (status >= 400) {
      logLevel = 'warn'
      color = 'yellow'
    }
    if (status >= 500) {
      logLevel = 'error'
      color = 'red'
    }

    log[logLevel](`${ctx.method} ${url} ${chalk.bold[color](status)} ${chalk.grey(duration + 'ms')}`)
  }

  function shouldIgnore (url) {
    return options.ignore.some((pattern) => {
      if (typeof pattern === 'string') {
        return url === pattern
      }
      if (pattern.test) {
        return pattern.test(url)
      }
      if (typeof pattern === 'function') {
        return pattern(url)
      }
      return false
    })
  }
}

function parseOptions (options) {
  options = Object.assign({
    ignore: []
  }, options)

  if (!(options.ignore instanceof Array)) {
    options.ignore = [options.ignore]
  }

  return options
}
