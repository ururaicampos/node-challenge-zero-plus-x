const FrameFileConfig = require('../config/frame_file')
const ParserConst = require('./parser_const')

const User = require('../domain/user')
const UserRepository = require('../domain/user_repository')

/**
 * Parser object. Got an array of buffers and returns a JSON report
 *
 */

let repository
let arrayAllSentReceived
let mapAllTransactionsByDay
let setAllTransactionsByDay
let totalTransactions

function Parser() {
	repository = new UserRepository()
	arrayAllSentReceived = []
	mapAllTransactionsByDay = new Map()
	setAllTransactionsByDay = new Set()
	totalTransactions = 0
}

/**
 * Public methods
 *
 * @param arrayBuffer
 */
Parser.prototype.bufferToJSON = function(arrayBuffer) {
	const buffer = Buffer.concat(arrayBuffer)
	let offset = 0

	let validFrameSize = buffer.length / arrayBuffer.length

	if (validFrameSize != FrameFileConfig.frameSize)
		throw Error('The server expected received a different frame size from the client (' + FrameFileConfig.frameSize + '). Check your configuration file!')

	let frame = buffer.slice(offset, FrameFileConfig.frameSize) // the first frame
	while (frame.length > 0) { // all the other frames
		extractDataFromBuffer(frame)
		totalTransactions++

		offset = offset + FrameFileConfig.frameSize
		frame = buffer.slice(offset, FrameFileConfig.frameSize+offset)
	}

	const statsByDay = getStatsByDay()
	const totalSentReceived = sumAllSentReceivedAmount()
	const userStats = repository.findAllUsers()

	return generateJSONResponse(totalSentReceived, totalTransactions, userStats, statsByDay)
}

/**
 * Private methods
 *
 */
function generateJSONResponse(totalSentReceived, totalTransactions, userStats, statsByDay) {
	const jsonReport = {
		totalAmount: totalSentReceived,
		totalTransactions: totalTransactions,
		customerStatistics: {
			users: userStats
		},
		dayStatistics: statsByDay
	}

	return JSON.stringify(jsonReport)
}

function extractDataFromBuffer(slicedBuffer) {
	let sender = slicedBuffer.slice(FrameFileConfig.senderOffset, FrameFileConfig.senderOffset + ParserConst._32_BYTES).toString()
	let receiver = slicedBuffer.slice(FrameFileConfig.receiverOffset, FrameFileConfig.receiverOffset + ParserConst._32_BYTES).toString()
	let amount = slicedBuffer.readUIntBE(FrameFileConfig.amountOffset, ParserConst._4_BYTES)
	let timeStamp = slicedBuffer.readUIntBE(FrameFileConfig.timeStampOffset, ParserConst._6_BYTES)

    arrayAllSentReceived.push(amount)
	createTransactionByDay(timeStamp)

	createUser(sender, amount, true)
	createUser(receiver, amount, false)
}

function createUser(name, total, isSender) {
	const userType = (isSender ? ParserConst.USER_TYPE_SENDER : ParserConst.USER_TYPE_RECEIVER)

	if (!repository.has(name)) {
		const user = new User(name)
		repository.save(name, user)
		user.updateUser(total, userType)
	}
	else {
		const user = repository.findOneByName(name)
		user.updateUser(total, userType)
	}
}

function createTransactionByDay(timeStamp) {
	let frameDate = new Date(timeStamp).toUTCString()
	if (!mapAllTransactionsByDay.has(frameDate))
		mapAllTransactionsByDay.set(frameDate, 1)
	else
		mapAllTransactionsByDay.set(frameDate, mapAllTransactionsByDay.get(frameDate)+1)
}

function getStatsByDay() {
	let statsByDay = []
	mapAllTransactionsByDay.forEach( (value, key) => {
		statsByDay.push(key + ' > ' + value)
	})
	return statsByDay
}

function sumAllSentReceivedAmount() {
	var sum = 0
	arrayAllSentReceived.forEach(function(item) {
		sum += item
	})
	return sum
}

module.exports = Parser