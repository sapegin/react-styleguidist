import fs from 'fs';
import path from 'path';
import { encode } from 'qss';
import { Parent, Node as MdxNode } from 'unist';

const storiesLoader = path.resolve(__dirname, '../stories-loader.js');

// TODO: Use readdir() instead?
const getStoriesFile = (componentPath: string) => {
	const componentExtension = path.extname(componentPath);
	const extensions = [
		'.stories.js',
		'.stories.tsx',
		'.stories.ts',
		'.stories.jsx',
		'.story.js',
		'.story.tsx',
		'.story.ts',
		'.story.jsx',
	];
	const names = [
		// `ComponentName.stories`
		componentPath.replace(componentExtension, ''),
		// `FolderName.stories` when component definition file is `index`
		path.join(path.dirname(componentPath), path.basename(path.dirname(componentPath))),
	];
	for (const name of names) {
		for (const extension of extensions) {
			const filePath = `${name}${extension}`;
			const exists = fs.existsSync(filePath);
			if (exists) {
				return filePath;
			}
		}
	}
	return false;
};

/**
 * Reexport stories from a CSF file via webpack loader (to enable hot reload).
 *
 * import Button from './Button'
 * import Container from './Container'
 * export const basic = () => <Container><Button /></Container>
 *
 * ->
 *
 * import { __stories_namedExamples, __stories_storiesScope } from '!!...'
 * export const __namedExamples = __stories_namedExamples;
 * export const __storiesScope = __stories_storiesScope;
 */
export default ({
	componentPath,
	mdxDocumentPath,
}: {
	componentPath: string;
	mdxDocumentPath: string;
}) => () => (treeRaw: MdxNode) => {
	const tree = treeRaw as Parent;

	const componentAbsolutePath = path.resolve(path.dirname(mdxDocumentPath), componentPath);
	const storiesFile = getStoriesFile(componentAbsolutePath);
	if (!storiesFile) {
		return tree;
	}

	// Rexporting story via a webpack loader to enable hot reload on chaning
	// story code. Looks like MDX doesn't support reexports of any kind, so
	// importing and then exporting a const is the only form that works.

	const query = {
		componentPath,
		mdxDocumentPath,
	};
	tree.children.push({
		type: 'import',
		value: `import { __stories_namedExamples, __stories_storiesScope } from '!!${storiesLoader}?${encode(
			query
		)}!${storiesFile}'`,
	});
	tree.children.push({
		type: 'export',
		value: `export const __namedExamples = __stories_namedExamples`,
	});
	tree.children.push({
		type: 'export',
		value: `export const __storiesScope = __stories_storiesScope`,
	});

	return tree;
};
