const FrameFileConfig = require('../../server/config/frame_file')

/**
 * Create binary frames to be used by the tests
 */

const _32_BYTES = 32
const _6_BYTES = 6
const _4_BYTES = 4

function createDefaultSuccessFrame(sender, receiver, amount, timeStamp) {
    const buf = new Buffer.allocUnsafe(FrameFileConfig.frameSize)

    buf.fill(0, FrameFileConfig.senderOffset, FrameFileConfig.senderOffset + _32_BYTES)
    buf.write(sender, FrameFileConfig.senderOffset, _32_BYTES)

    buf.fill(0, FrameFileConfig.receiverOffset, FrameFileConfig.receiverOffset + _32_BYTES)
    buf.write(receiver, FrameFileConfig.receiverOffset, _32_BYTES)

    buf.fill(0, FrameFileConfig.amountOffset, FrameFileConfig.amountOffset + _4_BYTES)
    buf.writeUIntBE(amount, FrameFileConfig.amountOffset, _4_BYTES)

    buf.fill(0, FrameFileConfig.timeStampOffset, FrameFileConfig.timeStampOffset + _6_BYTES)
    buf.writeUIntBE(timeStamp, FrameFileConfig.timeStampOffset, _6_BYTES)

    return buf
}

module.exports = {
    createDefaultSuccessFrame: createDefaultSuccessFrame
}