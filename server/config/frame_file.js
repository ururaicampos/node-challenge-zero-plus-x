const fs = require('fs')
const path = require('path')

/**
 *	Object to represent the frame file (by default frame.config.json)
 *
 */

const _32_BYTES = 32
const _6_BYTES = 6
const _4_BYTES = 4

const DEFAULT_FRAME_FILE = 'frame.config.json'

function FrameFile() {
	this.frameSize
	this.senderOffset
	this.receiverOffset
	this.amountOffset
	this.timeStampOffset

	try {
		const jsonFrameFile = fs.readFileSync(path.join(__dirname, DEFAULT_FRAME_FILE))
		const fileJson = JSON.parse(jsonFrameFile)

		this.frameSize = fileJson.frameSize
		this.senderOffset = fileJson.offset.sender
		this.receiverOffset = fileJson.offset.receiver
		this.amountOffset = fileJson.offset.amount
		this.timeStampOffset = fileJson.offset.timestamp
	} catch (err) {
		throw new Error('Frame file was not found')
	}

	validateValues(this.frameSize, this.senderOffset, this.receiverOffset, this.amountOffset, this.timeStampOffset)
}

function validateValues(frameSize, senderOffset, receiverOffset, amountOffset, timeStampOffset) {
	let sValue = senderOffset + _32_BYTES
	let rValue = receiverOffset + _32_BYTES
	let aValue = amountOffset + _4_BYTES
	let tValue = timeStampOffset + _6_BYTES

	let s = (sValue <= rValue ? true : false)
	let r = (rValue <= aValue ? true : false)
	let a = (aValue <= tValue ? true : false)
	let t = (tValue <= frameSize ? true : false)

	if (!s || !r || !a || !t)
		throw Error('Invalid frame file. Please check the values.')
}

module.exports = new FrameFile()