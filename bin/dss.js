const http = require('http')
const finalhandler = require('finalhandler')
const debug = require('debug')('dss:boot')
const router = require('../index')

const server = http.createServer(function (req, res) {
  router(req, res, finalhandler(req, res))
})

const bind = server.listen(process.env.PORT || 3000, () => {
  debug(`online @ ${bind.address().port}`)
})
