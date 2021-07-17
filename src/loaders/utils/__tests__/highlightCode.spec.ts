import glogg from 'glogg';
import highlightCode, { getHighlightCodeLanguages, getLanguages } from '../highlightCode';

const logger = glogg('rsg');

const code = '<p>Hello React</p>';

// run getHighlightCodeLanguages with ['java']
getHighlightCodeLanguages(['java']);

it('should highlight code with specified language', () => {
	const actual = highlightCode(code, 'html');
	expect(actual).toMatchSnapshot();
});

it('should warn when language not found', () => {
	const warn = jest.fn();
	logger.once('warn', warn);

	const actual = highlightCode(code, 'pizza');
	expect(actual).toBe(code);
	expect(warn).toBeCalledWith(
		`Syntax highlighting for “pizza” isn’t supported. Supported languages are: ${getLanguages()
			.sort()
			.join(', ')}.`
	);
});

it('should not highlight code without language', () => {
	const actual = highlightCode(code);
	expect(actual).toBe(code);
});

it('should includes language after run getHighlightCodeLanguages', () => {
	expect(getLanguages().includes('java')).toBe(true);
});
