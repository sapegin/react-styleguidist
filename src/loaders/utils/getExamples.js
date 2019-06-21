// @flow
import path from 'path';
import fs from 'fs';
import { encode } from 'qss';
import requireIt from './requireIt';

const examplesLoader = path.resolve(__dirname, '../examples-loader.js');

/**
 * Get require statement for examples file if it exists, or for default examples if it was defined.
 */
module.exports = function getExamples(
	file: string,
	displayName: string,
	examplesFile: string,
	defaultExample: string
): {} | null {
	const examplesFileToLoad = (fs.existsSync(examplesFile) && examplesFile) || defaultExample;
	if (!examplesFileToLoad) {
		return null;
	}

	const relativePath = `./${path.relative(path.dirname(examplesFileToLoad), file)}`;

	const query = {
		displayName,
		file: relativePath,
		shouldShowDefaultExample: !examplesFile && !!defaultExample,
	};
	return requireIt(`!!${examplesLoader}?${encode(query)}!${examplesFileToLoad}`);
};
