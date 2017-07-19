process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = require('chai').expect

const FrameBuilder = require('../../helper/frame_builder')
const ProcessorStream = require('../../../server/streams/processor_stream')
const FrameFileConfig = require('../../../server/config/frame_file')

let SENT_500 = 500
let SENT_800 = 800
let SENT_1000 = 1000

let RECEIVED_500 = 500
let RECEIVED_800 = 800
let RECEIVED_1000 = 1000

describe('Tests - ProcessorStream', () => {

    let frameHulkToThor
    let frameBruceToClark
    let framePeterToBruce
    let TOTAL_FRAMES
    let TOTAL_AMOUNT

    beforeEach( () => {
        frameHulkToThor = FrameBuilder.createDefaultSuccessFrame('Hulk', 'Thor', SENT_500, new Date().getTime())
        frameBruceToClark = FrameBuilder.createDefaultSuccessFrame('Bruce Wayne', 'Clark Kent', SENT_800, new Date().getTime())
		framePeterToBruce = FrameBuilder.createDefaultSuccessFrame('Peter Parker', 'Bruce Wayne', SENT_1000, new Date().getTime())
        TOTAL_FRAMES = 3
        TOTAL_AMOUNT = 2300
    })

    it('should be successful with FrameFileConfig default frame size', () => {
        expect(frameHulkToThor.length).to.equal(FrameFileConfig.frameSize)
        expect(frameBruceToClark.length).to.equal(FrameFileConfig.frameSize)
        expect(framePeterToBruce.length).to.equal(FrameFileConfig.frameSize)
    })

    it('_transform method should get many frames', () => {
        const processor = new ProcessorStream()
        processor.write(frameHulkToThor)
        processor.write(frameBruceToClark)
        processor.write(framePeterToBruce)
        expect(processor.frame.length).to.equal(TOTAL_FRAMES)
    })

    it('_flush method should process all the frames and got a JSON report', (done) => {
        const processor = new ProcessorStream()
        processor.write(frameHulkToThor)
        processor.write(frameBruceToClark)
        processor.write(framePeterToBruce)
        processor.end()

        processor.on('data', function(json) {
            const jsonObj = JSON.parse(json)

            expect(jsonObj.totalAmount).to.equal(TOTAL_AMOUNT)
            expect(jsonObj.totalTransactions).to.equal(TOTAL_FRAMES)

            expect(jsonObj.customerStatistics.users[0].name).to.equal('Hulk')
            expect(jsonObj.customerStatistics.users[0].totalSent).to.equal(SENT_500)
            expect(jsonObj.customerStatistics.users[0].totalReceived).to.equal(0)
            expect(jsonObj.customerStatistics.users[0].userTransactions).to.equal(1)

            expect(jsonObj.customerStatistics.users[1].name).to.equal('Thor')
            expect(jsonObj.customerStatistics.users[1].totalSent).to.equal(0)
            expect(jsonObj.customerStatistics.users[1].totalReceived).to.equal(RECEIVED_500)
            expect(jsonObj.customerStatistics.users[1].userTransactions).to.equal(1)

            expect(jsonObj.customerStatistics.users[2].name).to.equal('Bruce Wayne')
            expect(jsonObj.customerStatistics.users[2].totalSent).to.equal(SENT_800)
            expect(jsonObj.customerStatistics.users[2].totalReceived).to.equal(RECEIVED_1000)
            expect(jsonObj.customerStatistics.users[2].userTransactions).to.equal(2)

            expect(jsonObj.customerStatistics.users[3].name).to.equal('Clark Kent')
            expect(jsonObj.customerStatistics.users[3].totalSent).to.equal(0)
            expect(jsonObj.customerStatistics.users[3].totalReceived).to.equal(RECEIVED_800)
            expect(jsonObj.customerStatistics.users[3].userTransactions).to.equal(1)

            expect(jsonObj.customerStatistics.users[4].name).to.equal('Peter Parker')
            expect(jsonObj.customerStatistics.users[4].totalSent).to.equal(SENT_1000)
            expect(jsonObj.customerStatistics.users[4].totalReceived).to.equal(0)
            expect(jsonObj.customerStatistics.users[4].userTransactions).to.equal(1)

            done()
        })
    })

})