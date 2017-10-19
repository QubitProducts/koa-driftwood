# express-driftwood

A tiny piece of express middleware for logging requests using [QubitProducts/driftwood](https://github.com/QubitProducts/driftwood).


### Installation

```
npm i driftwood koa-driftwood
```

### Usage

Just call `koa-driftwood` with an instance of driftwood and mount it in your Koa app before everything else:

```js
const createLogger = require('driftwood')
const Koa = require('koa')
const router = require('koa-router')()
const koaLogger = require('koa-driftwood')

createLogger.enable({ '*': 'trace' })

const log = createLogger('my-app')
const app = new Koa()

app.use(koaLogger(log))

router.get('/', (ctx) => { res.body = 'Wooo!' })
router.get('/400', (ctx) => { ctx.status = 400; ctx.body = 'You dun goofed' })
router.get('/500', (ctx) => { ctx.status = 500; ctx.body = 'We dun goofed' })

app.use(router.routes())

app.listen(1119, () => {
  log.info('my-app started!')
})
```

![](http://i.imgur.com/nDfx9eX.png)


### Options

Options can be passed as a second argument.


### options.ignore

A string, regex, function or array of the former, to match URLs that you don't want to log:

```js
{
  ignore: ['/status', /^\/status/, (url) => url.indexOf('/status') > -1]
}
```
