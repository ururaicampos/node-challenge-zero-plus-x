const fs = require('fs')
const path = require('path')

/**
 * Load environment variables from DEFAULT_CONFIG_FILE
 * The app will crash if the file doesn't exist or is incorrectly formatted.
 *
 */
const DEFAULT_CONFIG_FILE = 'config.ENV.json'

module.exports = loadConfigFile = (options) => {
    const opts = options || {}

	if (!opts.app) {
        throw Error('You must provide an express() reference')
	}

    opts.file = options.file || DEFAULT_CONFIG_FILE
    try {
        const jsonEnvFile = fs.readFileSync(path.join(__dirname, opts.file))
        const jsonObject = JSON.parse(jsonEnvFile)

		opts.app.set('env', jsonObject.NODE_ENV)
        opts.app.set('port', jsonObject.PORT)
        process.env.NODE_ENV = jsonObject.NODE_ENV
        process.env.PORT = jsonObject.PORT

        return opts.app
    }
    catch (err) {
        throw Error('The configuration file was not found or is incorrectly formatted')
    }
}