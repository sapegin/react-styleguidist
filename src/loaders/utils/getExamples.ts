import path from 'path';
import fs from 'fs';
import { encode } from 'qss';
import requireIt from './requireIt';
import * as Rsg from '../../typings';

const mdxLoader = path.resolve(__dirname, '../mdx-loader.js');

/**
 * Get require statement for examples file if it exists.
 */
export default function getExamples(
	file: string,
	examplesFile?: string | false
): Rsg.RequireItResult | undefined {
	const examplesFileToLoad = examplesFile && fs.existsSync(examplesFile) ? examplesFile : false;
	if (!examplesFileToLoad) {
		return undefined;
	}

	const component = `./${path.relative(path.dirname(examplesFileToLoad), file)}`;
	const query = {
		component,
	};
	return requireIt(`!!${mdxLoader}?${encode(query)}!${examplesFileToLoad}`);
}
