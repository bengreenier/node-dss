const stream = require('stream')
const Router = require('router')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const debug = require('debug')('dss')

const router = Router()
router.__dataStore = {}

const morganDebugStream = new stream.Writable({
  write: function (chunk, encoding, done) {
    // strip newlines (to avoid extra empty log items in the 'tiny' morgan protocol)
    const chunkData = chunk.toString().replace(/[\n\r]/g, '')

    if (chunkData.length > 0) {
      debug(chunkData)
    }
    done()
  }
})

router.use(morgan('tiny', { stream: morganDebugStream }))

router.param('id', (req, res, next, id) => {
  req.params = {
    id
  }

  next()
})

// parse all bodies up to 10mb regardless of mime type as a buffer
router.use(bodyParser.raw({ limit: '10mb', type: () => true }))

const bodyDebug = debug.extend('body')

router.post('/data/:id', (req, res) => {
  const deviceId = req.params.id

  if (!router.__dataStore[deviceId]) {
    router.__dataStore[deviceId] = []
  }

  // log the body, using the debug body instance
  bodyDebug(req.body.toString())

  router.__dataStore[deviceId].push(req.body)

  res.statusCode = 200
  res.end()
})

router.get('/data/:id', (req, res) => {
  const deviceId = req.params.id

  if (!router.__dataStore[deviceId] || router.__dataStore[deviceId].length === 0) {
    res.statusCode = 404
    res.end()
  } else {
    const data = router.__dataStore[deviceId].shift()

    res.statusCode = 200
    res.end(data)
  }
})

module.exports = router
