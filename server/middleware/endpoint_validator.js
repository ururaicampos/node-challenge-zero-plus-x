/**
 * Middleware to check the path of all requests
 *
 */
module.exports = endPointValidator = (req, res, next) => {

    if (req.path !== '/api/v1/process') {
        const endPointException = new Error('Invalid endpoint!')
		endPointException.status = 501
        next(endPointException)
    } else {
        next()
    }
}