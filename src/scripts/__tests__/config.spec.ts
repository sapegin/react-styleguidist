import path from 'path';
import { Configuration } from 'webpack';
import getConfig from '../config';

const testComponent = (name: string) => path.resolve(__dirname, '../../../test/components', name);

const cwd = process.cwd();
const configDir = path.resolve(__dirname, '../../../test/apps/defaults');

beforeEach(() => {
	process.chdir(configDir);
});
afterAll(() => {
	process.chdir(cwd);
});

it('should read a config file', () => {
	const result = getConfig('../basic/styleguide.config.js');
	expect(result).toMatchObject({ title: 'React Style Guide Example' });
});

it('should accept absolute path', () => {
	const result = getConfig(path.join(__dirname, '../../../test/apps/basic/styleguide.config.js'));
	expect(result).toMatchObject({ title: 'React Style Guide Example' });
});

it('should throw when passed config file not found', () => {
	const fn = () => getConfig('pizza');
	expect(fn).toThrow();
});

it('should find config file automatically', () => {
	process.chdir('../basic');
	const result = getConfig();
	expect(result).toMatchObject({ title: 'React Style Guide Example' });
});

it('should accept config as an object', () => {
	const result = getConfig({
		title: 'Style guide',
	});
	expect(result).toMatchObject({ title: 'Style guide' });
});

it('should throw if config has errors', () => {
	expect.assertions(1);
	try {
		getConfig({
			components: 42,
		} as any);
	} catch (err) {
		expect(err.message).toMatch('should be string, function, or array');
	}
});

it('should change the config using the update callback', () => {
	const result = getConfig(
		{
			title: 'Style guide',
		},
		(config) => {
			config.title = 'Pizza';
			return config;
		}
	);
	expect(result).toMatchObject({ title: 'Pizza' });
});

it('should have default getExampleFilename implementation', () => {
	const result = getConfig();
	expect(typeof result.getExampleFilename).toEqual('function');
});

it('default getExampleFilename should return Readme.md path if it exists', () => {
	process.chdir('../..');
	const result = getConfig();
	expect(result.getExampleFilename(testComponent('Button/Button.js'))).toEqual(
		testComponent('Button/Readme.md')
	);
});

it('default getExampleFilename should return Component.md path if it exists', () => {
	process.chdir('../..');
	const result = getConfig();
	expect(result.getExampleFilename(testComponent('Placeholder/Placeholder.js'))).toEqual(
		testComponent('Placeholder/Placeholder.md')
	);
});

it('default getExampleFilename should return Component.md path if it exists with index.js', () => {
	process.chdir('../..');
	const result = getConfig();
	result.components = './components/**/*.js';
	expect(result.getExampleFilename(testComponent('Label/Label.js'))).toEqual(
		testComponent('Label/Label.md')
	);
});

it('default getExampleFilename should return false if no examples file found', () => {
	process.chdir('../..');
	const result = getConfig();
	expect(result.getExampleFilename(testComponent('RandomButton/RandomButton.js'))).toBeFalsy();
});

it('should have default getComponentPathLine implementation', () => {
	const result = getConfig();
	expect(typeof result.getComponentPathLine).toEqual('function');
	expect(result.getComponentPathLine('components/Button.js')).toEqual('components/Button.js');
});

it('should have default title based on package.json name', () => {
	const result = getConfig();
	expect(result.title).toEqual('Pizza Style Guide');
});

it('configDir option should be a directory of a passed config', () => {
	const result = getConfig(path.join(configDir, 'styleguide.config.js'));
	expect(result).toMatchObject({ configDir });
});

it('configDir option should be a current directory if the config was passed as an object', () => {
	const result = getConfig();
	expect(result).toMatchObject({ configDir: process.cwd() });
});

it('should absolutize assetsDir if it exists', () => {
	const assetsDir = 'src/components';
	const result = getConfig({
		assetsDir,
	});
	expect(result.assetsDir).toEqual(path.join(configDir, assetsDir));
});

it('should throw if assetsDir does not exist', () => {
	const fn = () =>
		getConfig({
			assetsDir: 'pizza',
		});
	expect(fn).toThrow();
});

it('should use components option as the first sections if there’s no sections option', () => {
	const components = 'components/*/*.js';
	const result = getConfig({
		components,
	});
	expect(result.sections).toHaveLength(1);
	expect(result.sections[0].components).toEqual(components);
});

it('should use default components option both components and sections options weren’t specified', () => {
	const result = getConfig();
	expect(result.sections).toHaveLength(1);
	expect(result.sections[0].components).toMatch('**');
});

it('should ignore components option there’s sections options', () => {
	const components = 'components/*/*.js';
	const result = getConfig({
		components: 'components/Button/*.js',
		sections: [
			{
				components,
			},
		],
	});
	expect(result.sections).toHaveLength(1);
	expect(result.sections[0].components).toEqual(components);
});

it('should return webpackConfig option as is', () => {
	const webpackConfig = { mode: 'development' } as Configuration;
	const result = getConfig({
		webpackConfig,
	});
	expect(result.webpackConfig).toEqual(webpackConfig);
});

it('should return webpackConfig with user webpack config', () => {
	process.chdir('../basic');
	const result = getConfig();
	expect(result.webpackConfig).toEqual(
		expect.objectContaining({
			module: {
				rules: expect.any(Array),
			},
		})
	);
});

it('should allow no webpack config', () => {
	process.chdir('../no-webpack');
	const fn = () => getConfig();
	expect(fn).not.toThrow();
});

it('should throw when old template as a string option passed', () => {
	expect.assertions(1);
	try {
		getConfig({
			template: 'pizza',
		});
	} catch (err) {
		expect(err.message).toMatch('format has been changed');
	}
});

it('should throw when editorConfig option passed', () => {
	expect.assertions(1);
	try {
		getConfig({
			editorConfig: { theme: 'foo' },
		});
	} catch (err) {
		expect(err.message).toMatch('config option was removed');
	}
});

it('mountPointId should have default value', () => {
	const result = getConfig();
	expect(result.mountPointId).toEqual('rsg-root');
});

it('mountPointId should have default value', () => {
	const result = getConfig();
	expect(result.mountPointId).toEqual('rsg-root');
});

it('should set the exampleMode to expand if the flag showCode is on', () => {
	const result = getConfig({
		showCode: true,
	});
	expect(result.exampleMode).toBe('expand');
});

it('should set the exampleMode to collapse if the flag showCode is off', () => {
	const result = getConfig({
		showCode: false,
	});
	expect(result.exampleMode).toBe('collapse');
});

it('should set the usageMode to expand if the flag showUsage is on', () => {
	const result = getConfig({
		showUsage: true,
	});
	expect(result.usageMode).toBe('expand');
});

it('should set the usageMode to collapse if the flag showUsage is off', () => {
	const result = getConfig({
		showUsage: false,
	});
	expect(result.usageMode).toBe('collapse');
});
