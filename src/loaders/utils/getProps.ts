import path from 'path';
import fs from 'fs';
import { encode } from 'qss';
import { TagProps, TagParamObject, DocumentationObject, utils, TagObject } from 'react-docgen';
import _ from 'lodash';
import doctrine, { Annotation } from 'doctrine';
import createLogger from 'glogg';
import removeDoclets from './removeDoclets';
import requireIt from './requireIt';
import getNameFromFilePath from './getNameFromFilePath';
import * as Rsg from '../../typings';

const logger = createLogger('rsg');

const mdxLoader = path.resolve(__dirname, '../mdx-loader.js');

const JS_DOC_METHOD_PARAM_TAG_SYNONYMS: (keyof TagProps)[] = ['param', 'arg', 'argument'];
const JS_DOC_METHOD_RETURN_TAG_SYNONYMS: (keyof TagProps)[] = ['return', 'returns'];
const JS_DOC_ALL_SYNONYMS: (keyof TagProps)[] = [
	...JS_DOC_METHOD_PARAM_TAG_SYNONYMS,
	...JS_DOC_METHOD_RETURN_TAG_SYNONYMS,
];

// HACK: We have to make sure that doclets is a proper object with correct prototype to
// work around an issue in react-docgen that breaks the build if a component has JSDoc tags
// like @see in its description, see https://github.com/reactjs/react-docgen/issues/155
// and https://github.com/styleguidist/react-styleguidist/issues/298
const getDocletsObject = (str?: string) => ({ ...utils.docblock.getDoclets(str) });

const getDoctrineTags = (documentation: Annotation) => {
	return _.groupBy(documentation.tags, 'title');
};

const doesExternalExampleFileExist = (componentPath: string, exampleFile: string) => {
	const exampleFilepath = path.resolve(path.dirname(componentPath), exampleFile);
	const doesFileExist = fs.existsSync(exampleFilepath);

	if (!doesFileExist) {
		logger.warn(`An example file ${exampleFile} defined in ${componentPath} component not found.`);
	}
	return doesFileExist;
};

const getMergedTag = (tags: TagProps, names: (keyof TagProps)[]): TagObject[] => {
	return names.reduce((params: TagObject[], name) => [...params, ...(tags[name] || [])], []);
};

/**
 * 1. Remove non-public methods.
 * 2. Extract doclets.
 * 3. Highlight code in descriptions.
 * 4. Extract @example doclet (load linked file with mdx-loader).
 *
 * @param {object} doc
 * @param {string} filepath
 * @returns {object}
 */
export default function getProps(doc: DocumentationObject, filepath?: string): Rsg.TempPropsObject {
	const outDocs: Rsg.TempPropsObject = { doclets: {}, displayName: '', ...doc, methods: undefined };

	// Keep only public methods
	outDocs.methods = (doc.methods || []).filter((method) => {
		const doclets = method.docblock && utils.docblock.getDoclets(method.docblock);
		return doclets && doclets.public;
	}) as Rsg.MethodWithDocblock[];

	// Parse the docblock of the remaining methods with doctrine to retrieve
	// the JSDoc tags
	// if a method is visible it must have a docblock
	outDocs.methods = outDocs.methods.map((method) => {
		const allTags = getDoctrineTags(
			doctrine.parse(method.docblock, { sloppy: true, unwrap: true })
		);

		// Merge with react-docgen information about arguments and return value
		// with information from JSDoc

		const paramTags = getMergedTag(
			allTags as TagProps,
			JS_DOC_METHOD_PARAM_TAG_SYNONYMS
		) as TagParamObject[];
		const params =
			method.params &&
			method.params.map((param) => ({
				...param,
				...paramTags.find((tagParam) => tagParam.name === param.name),
			}));

		if (params) {
			method.params = params;
		}

		const returnTags = getMergedTag(
			allTags as TagProps,
			JS_DOC_METHOD_RETURN_TAG_SYNONYMS
		) as TagParamObject[];
		const returns = method.returns
			? {
					...method.returns,
					type: {
						type: 'NameExpression',
						...method.returns.type,
					},
			  }
			: returnTags[0];

		if (returns) {
			method.returns = returns;
		}

		// Remove tag synonyms
		method.tags = _.omit(allTags, JS_DOC_ALL_SYNONYMS);

		return method;
	});

	if (doc.description) {
		// Read doclets from the description and remove them
		outDocs.doclets = getDocletsObject(doc.description);

		const documentation = doctrine.parse(doc.description);
		outDocs.tags = getDoctrineTags(documentation) as TagProps;

		outDocs.description = removeDoclets(doc.description);

		let exampleFileExists = false;
		let exampleFile = outDocs.doclets.example;

		// doc.doclets.example might be a boolean or undefined
		if (typeof outDocs.doclets.example === 'string' && filepath) {
			exampleFile = outDocs.doclets.example.trim();
			exampleFileExists = doesExternalExampleFileExist(filepath, exampleFile);
		}

		// Overwrite any existing `content` with the content from the
		// @example JSDdoc tag
		if (exampleFileExists && filepath) {
			const exampleFilepath = path.resolve(path.dirname(filepath), exampleFile);
			const component = `./${path.relative(path.dirname(exampleFilepath), filepath)}`;
			const query = {
				component,
			};
			outDocs.content = requireIt(`!!${mdxLoader}?${encode(query)}!${exampleFile}`);
			delete outDocs.doclets.example;
		}
	} else {
		outDocs.doclets = {};
	}

	if (doc.props) {
		// Read doclets of props
		Object.keys(doc.props).forEach((propName) => {
			if (!doc.props) {
				return;
			}
			const prop = doc.props[propName];
			const doclets = getDocletsObject(prop.description);

			// When a prop is listed in defaultProps but not in props the prop.description is undefined
			const documentation = doctrine.parse(prop.description || '');

			// documentation.description is the description without tags
			prop.description = documentation.description;
			prop.tags = getDoctrineTags(documentation) as TagProps;

			// Remove ignored props
			if (doclets && doclets.ignore && outDocs.props) {
				delete outDocs.props[propName];
			} else if (outDocs.props) {
				outDocs.props[propName] = prop;
			}
		});
	}

	if (!doc.displayName && filepath) {
		// Guess the exported component's display name based on the file path
		outDocs.displayName = getNameFromFilePath(filepath);
	}

	if (outDocs.doclets && outDocs.doclets.visibleName) {
		outDocs.visibleName = outDocs.doclets.visibleName;

		// Custom tag is added both to doclets and tags
		// Removing from both locations
		delete outDocs.doclets.visibleName;
		if (outDocs.tags) {
			delete outDocs.tags.visibleName;
		}
	}

	return outDocs;
}
