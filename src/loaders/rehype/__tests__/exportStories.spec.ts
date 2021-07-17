import mdx from '@mdx-js/mdx';
import { vol } from 'memfs';
import deabsDeep from 'deabsdeep';
import exportStories from '../exportStories';

jest.mock('fs', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	return require('memfs').fs;
});

afterEach(() => {
	vol.reset();
});

const compile = async (mdxContent: string, storyContent: string) => {
	vol.fromJSON({ '/Pizza/Pizza.stories.tsx': storyContent });
	const result = await mdx(mdxContent, {
		filepath: 'Pizza.md',
		rehypePlugins: [
			exportStories({ componentPath: './index.tsx', mdxDocumentPath: '/Pizza/Readme.md' }),
		],
	});

	// Strip repeated parts
	return deabsDeep(result.split('/* @jsx mdx */')[1].split('const MDXLayout = "wrapper"'))[0];
};

test('reexports objects from the loader', async () => {
	const result = await compile(
		`Henlo`,
		`
export const story = () => <Container><Button /></Container>
`
	);
	expect(result).toMatchInlineSnapshot(`
		"
		import { __stories_namedExamples, __stories_storiesScope } from '!!~/src/loaders/stories-loader.js?componentPath=.%2Findex.tsx&mdxDocumentPath=%2FPizza%2FReadme.md!/Pizza/Pizza.stories.tsx'
		export const __namedExamples = __stories_namedExamples;
		export const __storiesScope = __stories_storiesScope;

		const layoutProps = {
		  __namedExamples,
		__storiesScope
		};
		"
	`);
});
