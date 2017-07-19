process.env.NODE_ENV = 'test'

const app = require('../../../app')
const chai = require('chai')
const expect = require('chai').expect

const FrameFileConfig = require('../../../server/config/frame_file')

describe('Tests - FrameFileConfig', () => {

    it('test should be successful with FrameFileConfig default values', () => {
        expect(FrameFileConfig.frameSize).to.equal(74)
        expect(FrameFileConfig.senderOffset).to.equal(0)
        expect(FrameFileConfig.receiverOffset).to.equal(32)
        expect(FrameFileConfig.amountOffset).to.equal(64)
        expect(FrameFileConfig.timeStampOffset).to.equal(68)
    })

})
