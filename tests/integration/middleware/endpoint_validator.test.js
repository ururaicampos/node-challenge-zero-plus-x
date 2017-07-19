process.env.NODE_ENV = 'test'

const FrameBuilder = require('../../helper/frame_builder')
const server = require('../../../app')

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

const SUCCESS_HTTP_CODE_200 = 200
const ERROR_HTTP_CODE_501 = 501
const ERROR_501_HTTP_SERVER_MESSAGE = 'Invalid endpoint!'

describe('Tests - Endpoint validator', () => {

	let frameBuffer

	beforeEach( () => {
		var item = {sender: 'Bruce', receiver: 'Clark', amount: 200, timeStamp: Date.now()}
        frameBuffer = FrameBuilder.createDefaultSuccessFrame(item.sender, item.receiver, item.amount, item.timeStamp)
	})

	it('test should be successful when make requests to /api/v1/process', (done) => {
		chai.request(server)
			.post('/api/v1/process')
			.send(frameBuffer)
			.set('Content-Type', "application/octet-stream")
			.end(function(err, res) {
				expect(res.status).to.equal(SUCCESS_HTTP_CODE_200)
				done()
			})
	})

	it('test should got a 501 error because has a invalid URL endpoint', (done) => {
		chai.request(server)
			.post('/fooBar')
			.send(frameBuffer)
			.set('Content-Type', "application/octet-stream")
			.end(function(err, res) {
				expect(res.status).to.equal(ERROR_HTTP_CODE_501)
				expect(res).to.be.json
				expect(res.body.message).to.equal(ERROR_501_HTTP_SERVER_MESSAGE)
				done()
			})
	})
})
