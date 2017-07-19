const contentType = require('content-type')

/**
 * Middleware to check all requests' headers
 * Only application/octet-stream are allowed
 *
 */
module.exports = headerValidate = (req, res, next) => {
    const header = contentType.parse(req)

    if (header.type !== 'application/octet-stream') {
        const headerException = new Error('The Content-Type must be application/octet-stream')
        headerException.status = 406
        next(headerException)
    } else {
        next()
    }
}