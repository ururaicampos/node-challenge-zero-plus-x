const inherits = require('util').inherits
const Transform = require('stream').Transform
const Parser = require('../parser/parser')

/**
 * Transform stream get the chunks from the pipe() method with _transform
 * _flush method send the frames to be parsed
 *
 * @param options
 * @constructor
 */
function ProcessorTransformStream(options) {
	if (!options) options = {}

	// options.objectMode = true
	Transform.call(this, options)

	this.parser = new Parser()
	this.frame = []
}

inherits(ProcessorTransformStream, Transform)

ProcessorTransformStream.prototype._transform = _transform

function _transform(chunk, encoding, callback) {
	this.frame.push(chunk)
	callback()
}

ProcessorTransformStream.prototype._flush = function(next) {
	this.push( this.parser.bufferToJSON(this.frame) )
	next()
}

module.exports = ProcessorTransformStream