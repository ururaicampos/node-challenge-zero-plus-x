process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = require('chai').expect

const UserRepository = require('../../../server/domain/user_repository')
const User = require('../../../server/domain/user')

describe('Tests - UserRepository', () => {

	let repository
	let user, anotherUser
	beforeEach( () => {
		repository = new UserRepository()

		user = new User('Iron Man')
		user.totalSent = 100
		user.totalReceived = 200
		user.transactions = 2

		anotherUser = new User('Hulk')
		anotherUser.totalSent = 100
		anotherUser.transactions = 1
	})

	it('should store one User in the repository', () => {
		repository.save(user.name, user)
		expect(repository.has(user.name)).to.be.true
		expect(repository.has(anotherUser.name)).to.be.false
	})

	it('should find one User by name', () => {
		repository.save(user.name, user)

		let userSaved = repository.findOneByName(user.name)
		expect(userSaved.name).to.equal('Iron Man')
	})

	it('should return an array with all Users saved', () => {
		repository.save(user.name, user)
		repository.save(anotherUser.name, anotherUser)

		let allUsers = repository.findAllUsers(user.name)

		expect(allUsers[0].name).to.equal('Iron Man')
		expect(allUsers[0].totalSent).to.equal(100)
		expect(allUsers[0].totalReceived).to.equal(200)
		expect(allUsers[0].userTransactions).to.equal(2)

		expect(allUsers[1].name).to.equal('Hulk')
		expect(allUsers[1].totalSent).to.equal(100)
		expect(allUsers[1].userTransactions).to.equal(1)
	})

})
