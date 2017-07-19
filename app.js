const http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')

const loadEnvConfig = require('./server/config/load_env_config')
const endPointValidator = require('./server/middleware/endpoint_validator')
const headerValidator = require('./server/middleware/header_validator')
const routeApi = require('./server/routes/index')

app.use(endPointValidator) // middleware endpoint validator
app.use(headerValidator) // middleware header validator
app.use(morgan('dev')) // print http requests on the server side

/**
 * API routes
 */
app.use('/api/v1', routeApi)

/**
 * Load environment config file (development as default)
 */
loadEnvConfig({app})

/**
 *  Development error handler. Print stacktrace.
 */
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.json({message:err.message, stack:err.stack})
	})
}

/**
 * Production error handler. No stacktraces leaked to user.
 */
app.use(function(err, req, res, next) {
	res.status(err.status || 500)
    res.json({message:err.message, stack:{}})
})

/**
 * Inconsistent state. Close the app.
 */
process.on('uncaughtException', function (err) {
	console.error('uncaughtException: ', err.message);
	console.error(err.stack);
	process.exit(1);
});

/**
 * Start the app
 */
var server   = http.createServer(app)
server.listen(app.get('port'), function() {
   console.log("SERVER RUNNING PORT", app.get('port'))
})

/**
 * Endpoint tests get the server up and running
 */
module.exports = app