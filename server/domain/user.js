/**
 * The user from each frame
 *
 * @param name
 * @constructor
 */

const USER_IS_A_SENDER = 'SENDER'

function User(name) {
	this.name = name
	this.totalSent = 0
	this.totalReceived = 0
	this.transactions = 0
}

User.prototype.updateUser = function(total, userType) {
	this.transactions += 1
	if (userType === USER_IS_A_SENDER)
		this.totalSent += total
	else
		this.totalReceived += total
}

module.exports = User

