process.env.NODE_ENV = 'test'

const FrameBuilder = require('../../helper/frame_builder')
const server = require('../../../app')

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

const ERROR_HTTP_CODE_406 = 406
const ERROR_406_HTTP_SERVER_MESSAGE = 'The Content-Type must be application/octet-stream'

describe('Tests - HTTP header validator', () => {

    let frameBuffer

	beforeEach( () => {
		var item = {sender: 'Bruce', receiver: 'Clark', amount: 200, timeStamp: Date.now()}
		frameBuffer = FrameBuilder.createDefaultSuccessFrame(item.sender, item.receiver, item.amount, item.timeStamp)
	})

	it('test should got a 406 error because has a invalid HTTP header', (done) => {
		chai.request(server)
			.post('/api/v1/process')
			.send(frameBuffer)
			.set('Content-Type', "application/any_other_thing")
			.end(function(err, res) {

				expect(res.status).to.equal(ERROR_HTTP_CODE_406)
				expect(res).to.be.xml
				expect(res.body.message).to.equal(ERROR_406_HTTP_SERVER_MESSAGE)

				done()
			})
	})

})
