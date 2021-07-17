import createLogger from 'glogg';
import * as Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index';

const logger = createLogger('rsg');

const DEFAULT_LANGUAGES = ['clike', 'markup', 'markdown', 'css', 'css', 'scss', 'less', 'javascript', 'flow', 'typescript', 'jsx', 'tsx', 'graphql', 'json', 'bash', 'diff'];
const IGNORED_LANGUAGES = ['extend', 'insertBefore', 'DFS'];
export const getLanguages = () =>
	Object.keys(Prism.languages).filter((x) => !IGNORED_LANGUAGES.includes(x));

/**
 * Highlight code.
 *
 * @param {string} code
 * @param {string} lang
 * @returns {string}
 */
export default function highlightCode(code: string, lang?: string): string {
	if (!lang) {
		return code;
	}

	const grammar = Prism.languages[lang];
	if (!grammar) {
		// Sort by the first letter a to z to make it easier to find relevant language configurations
		logger.warn(
			`Syntax highlighting for “${lang}” isn’t supported. Supported languages are: ${getLanguages()
				.sort()
				.join(', ')}.`
		);
		return code;
	}

	return Prism.highlight(code, grammar, lang);
}

/**
 * Get highlight code languages.
 *
 * @param {Array<string>} languages
 * @returns {void}
 */
export function getHighlightCodeLanguages(langs: string[] = []): void {
	loadLanguages([...DEFAULT_LANGUAGES, ...langs]);
}
