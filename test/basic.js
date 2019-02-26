const http = require('http')
const assert = require('assert')
const finalhandler = require('finalhandler')
const request = require('supertest')
const router = require('../index')

const allocServer = () => {
  return http.createServer(function (req, res) {
    router(req, res, finalhandler(req, res))
  })
}

/* eslint-env node, mocha */
describe('node-dss', () => {
  it('GET /data/test-id-001', (done) => {
    request(allocServer())
      .get('/data/test-id-001')
      .expect(404, done)
  })

  it('POST /data/test-id-001', (done) => {
    request(allocServer())
      .post('/data/test-id-001')
      .send({ type: 'offer', data: 'sdp' })
      .expect(200, done)
  })

  it('POST /data/test-id-002', (done) => {
    request(allocServer())
      .post('/data/test-id-002')
      .send({ type: 'offer', data: 'sdp', dataSeparator: '|' })
      .expect(200, done)
  })

  describe('queries', () => {
    const agent = request.agent(allocServer())

    it('inserts data (x1)', (done) => {
      agent
        .post('/data/test-id-003')
        .send({ type: 'offer', data: 'sdp', dataSeparator: '|' })
        .expect(200, done)
    })

    it('inserts data (x2)', (done) => {
      agent
        .post('/data/test-id-003')
        .send({ type: 'answer', data: 'sdp2', dataSeparator: '|' })
        .expect(200, done)
    })

    it('reads back data (x1)', (done) => {
      agent
        .get('/data/test-id-003')
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(JSON.parse(response.text), { type: 'offer', data: 'sdp', dataSeparator: '|' })
        })
        .then(done, done)
    })

    it('reads back data (x2)', (done) => {
      agent
        .get('/data/test-id-003')
        .expect(200)
        .then((response) => {
          assert.deepStrictEqual(JSON.parse(response.text), { type: 'answer', data: 'sdp2', dataSeparator: '|' })
        })
        .then(done, done)
    })

    it('gets 404 when there is no data', (done) => {
      agent
        .get('/data/test-id-003')
        .expect(404, done)
    })
  })
})
