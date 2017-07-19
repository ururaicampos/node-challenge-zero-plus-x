/**
 * Repository to keep the users from each frame in memory
 *
 */
let userMap

function UserRepository() {
	userMap = new Map()
}

UserRepository.prototype.save = function(userName, object) {
	userMap.set(userName, object)
}

UserRepository.prototype.findOneByName = function(userName) {
	return userMap.get(userName)
}

UserRepository.prototype.findAllUsers = function() {
	const customerStats = []

	userMap.forEach( (user) => {
		const userStats = {
			name: (user.name.replace(/\0[\s\S]*$/g,'')),
			totalSent: user.totalSent,
			totalReceived: user.totalReceived,
			userTransactions: user.transactions
		}

		customerStats.push(userStats)
	})

	return customerStats
}

UserRepository.prototype.has = function(userName) {
	return userMap.has(userName)
}

module.exports = UserRepository

