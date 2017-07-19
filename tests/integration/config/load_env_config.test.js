process.env.NODE_ENV = 'test'

const app = require('../../../app')
const chai = require('chai')
const expect = require('chai').expect

const loadConfigFile = require('../../../server/config/load_env_config')

describe('Tests - Environment configuration file', () => {

	it('test should be successful with default configuration file', () => {
		var loadConfigFileDefaultFile = function () {
			loadConfigFile({app: app})
		}

		expect(loadConfigFileDefaultFile).to.not.throw(Error)
		expect(loadConfigFile({app: app}).get('env')).to.equal('development')
		expect(loadConfigFile({app: app}).get('port')).to.equal(3000)
	})

	it('test should be successful with a custom input file', () => {
		var loadConfigFileCustomFile = function () {
			loadConfigFile({app: app, file: 'config.ENV.json'})
		}

		expect(loadConfigFileCustomFile).to.not.throw(Error)
		expect(loadConfigFile({app: app}).get('env')).to.equal('development')
		expect(loadConfigFile({app: app}).get('port')).to.equal(3000)
	})

	it('test should got a error if a express() reference was not provide', () => {
		var loadEnvConfigExpError = function () {
			loadConfigFile()
		}
		expect(loadEnvConfigExpError).to.throw(Error)
		expect(loadEnvConfigExpError).to.throw('You must provide an express() reference')
	})

	it('test should got a error if there is no file or is incorrectly formatted', () => {
		var loadEnvConfigExpError = function () {
			loadConfigFile({app: app, file: 'not_found_file'})
		}

		expect(loadEnvConfigExpError).to.throw(Error)
		expect(loadEnvConfigExpError).to.throw('The configuration file was not found or is incorrectly formatted')
	})
})
