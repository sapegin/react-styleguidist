import fs from 'fs';
import path from 'path';
import findup from 'findup';
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import schema from './schemas/config';
import StyleguidistError from './utils/error';
import sanitizeConfig from './utils/sanitizeConfig';

const CONFIG_FILENAME = 'styleguide.config.js';

/**
 * Read, parse and validate config file or passed config.
 *
 * @param {object|string} [config] All config options or config file name or nothing.
 * @param {function} [update] Change config object before running validation on it.
 * @returns {object}
 */
function getConfig(config, update) {
	let configFilepath;
	if (isString(config)) {
		// Load config from a given file
		configFilepath = path.resolve(process.cwd(), config);
		if (!fs.existsSync(configFilepath)) {
			throw new StyleguidistError('Styleguidist config not found: ' + configFilepath + '.');
		}
		config = {};
	} else if (!isPlainObject(config)) {
		// Try to read config options from a file
		configFilepath = findConfigFile();
		config = {};
	}

	if (configFilepath) {
		config = require(configFilepath);
	}

	if (update) {
		config = update(config);
	}

	const configDir = configFilepath ? path.dirname(configFilepath) : process.cwd();

	try {
		return sanitizeConfig(config, schema, configDir);
	} catch (exception) {
		if (exception instanceof StyleguidistError) {
			throw new StyleguidistError(
				`Something is wrong with your style guide config\n\n${exception.message}`,
				exception.extra
			);
		} else {
			throw exception;
		}
	}
}

/**
 * Try to find config file up the file tree.
 *
 * @return {string|boolean} Config absolute file path.
 */
function findConfigFile() {
	let configDir;
	try {
		configDir = findup.sync(process.cwd(), CONFIG_FILENAME);
	} catch (exception) {
		return false;
	}

	return path.join(configDir, CONFIG_FILENAME);
}

module.exports = getConfig;
