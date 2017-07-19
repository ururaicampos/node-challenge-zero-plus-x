const ProcessorStream = require('../../server/streams/processor_stream')

/**
 * Route to handle the requests with a stream
 *
 * @param req
 * @param res
 * @param next
 */

module.exports.process = (req, res, next) => {
	const processor = new ProcessorStream()
	res.setHeader('Content-Type', 'application/json')
	req.pipe(processor).pipe(res)

}

