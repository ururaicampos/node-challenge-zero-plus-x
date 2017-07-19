process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = require('chai').expect

const User = require('../../../server/domain/user')

describe('Tests - User', () => {

	let user

	beforeEach( () => {
		user = new User('Peter')
	})

	it('should be successful with the User initial state', () => {
		expect(user.name).to.equal('Peter')
		expect(user.totalSent).to.equal(0)
		expect(user.totalReceived).to.equal(0)
		expect(user.transactions).to.equal(0)
	})

	it('should update the User when is a SENDER', () => {
		user.updateUser(200, 'SENDER')
		expect(user.totalSent).to.equal(200)
	})

	it('should update the User when is a RECEIVER', () => {
		user.updateUser(500, 'RECEIVER')
		expect(user.totalReceived).to.equal(500)
	})

	it('should update the User when is a SENDER and a RECEIVER with multiple values', () => {
		user.updateUser(100, 'SENDER')
		user.updateUser(200, 'RECEIVER')
		user.updateUser(500, 'SENDER')
		user.updateUser(800, 'RECEIVER')

		expect(user.totalSent).to.equal(600)
		expect(user.totalReceived).to.equal(1000)
	})
})
