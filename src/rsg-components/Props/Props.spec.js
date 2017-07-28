import React from 'react';
import { parse } from 'react-docgen';
import PropsRenderer, { propsToArray, columns } from './PropsRenderer';
import { unquote, getType, showSpaces } from './util';

// Test renderers with clean readable snapshot diffs
// eslint-disable-next-line react/prop-types
export default function ColumnsRenderer({ props }) {
	return (
		<ul>
			{propsToArray(props).map((row, rowIdx) =>
				<li key={rowIdx}>
					{columns.map(({ render }, colIdx) =>
						<div key={colIdx}>
							{render(row)}
						</div>
					)}
				</li>
			)}
		</ul>
	);
}

function render(propTypes, defaultProps = []) {
	const props = parse(`
		import { Component } from 'react';
		import PropTypes from 'prop-types';
		export default class Cmpnt extends Component {
			static propTypes = {
				${propTypes.join(',')}
			}
			static defaultProps = {
				${defaultProps.join(',')}
			}
			render() {
			}
		}
	`);
	return shallow(<ColumnsRenderer props={props.props} />);
}

describe('PropsRenderer', () => {
	it('should render a table', () => {
		const actual = shallow(
			<PropsRenderer
				props={{ color: { type: { name: 'string' }, required: false, description: '' } }}
			/>
		);

		expect(actual).toMatchSnapshot();
	});
});

describe('props columns', () => {
	it('should render PropTypes.string', () => {
		const actual = render(['color: PropTypes.string']);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.string with a default value', () => {
		const actual = render(['color: PropTypes.string'], ['color: "pink"']);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.string.isRequired', () => {
		const actual = render(['color: PropTypes.string.isRequired']);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.arrayOf', () => {
		const actual = render(['colors: PropTypes.arrayOf(PropTypes.string)']);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.arrayOf(PropTypes.shape)', () => {
		const actual = render([
			'foos: PropTypes.arrayOf(PropTypes.shape({bar: PropTypes.number, baz: PropTypes.any}))',
		]);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.instanceOf', () => {
		const actual = render(['num: PropTypes.instanceOf(Number)']);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.shape', () => {
		const actual = render([
			'foo: PropTypes.shape({bar: PropTypes.number.isRequired, baz: PropTypes.any})',
		]);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.shape with formatted defaultProps', () => {
		const actual = render(
			[
				`
				foo: PropTypes.shape({
					bar: PropTypes.number.isRequired,
					baz: PropTypes.any,
				})
			`,
			],
			[
				`
				foo: {
					bar: 123, baz() {
						return 'foo';
					},
					bing() {
						return 'badaboom';
					},
					trotskij: () => 1935,
					qwarc: { si: 'señor', },
				}
			`,
			]
		);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.shape with description', () => {
		const actual = render([
			`foo: PropTypes.shape({
			/**
			 * Number
			 */
			bar: PropTypes.number.isRequired,
			/** Any */
			baz: PropTypes.any
		})`,
		]);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.objectOf', () => {
		const actual = render(['colors: PropTypes.objectOf(PropTypes.string)']);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.objectOf(PropTypes.shape)', () => {
		const actual = render([
			`colors: PropTypes.objectOf(
			PropTypes.shape({
				bar: PropTypes.number.isRequired,
				baz: PropTypes.any
			})
		)`,
		]);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.oneOf', () => {
		const actual = render(['size: PropTypes.oneOf(["small", "normal", "large"])']);

		expect(actual).toMatchSnapshot();
	});

	it('should render PropTypes.oneOfType', () => {
		const actual = render(['union: PropTypes.oneOfType([PropTypes.string, PropTypes.number])']);

		expect(actual).toMatchSnapshot();
	});

	it('should render description in Markdown', () => {
		const actual = render(['/**\n * Label\n */\ncolor: PropTypes.string']);

		expect(actual).toMatchSnapshot();
	});

	it('should render unknown proptype for a prop when a relevant proptype is not assigned', () => {
		const actual = render([], ['color: "pink"']);

		expect(actual).toMatchSnapshot();
	});

	it('should render function body in tooltip', () => {
		const actual = render(['fn: PropTypes.func'], ['fn: (e) => console.log(e)']);

		expect(actual).toMatchSnapshot();
	});

	it('should render arguments from JsDoc tags', () => {
		const props = {
			size: {
				type: {
					name: 'number',
				},
				required: false,
				description: 'Test description',
				tags: {
					arg: [
						{
							name: 'Foo',
							description: 'Converts foo to bar',
							type: { name: 'Array' },
						},
					],
					param: [
						{
							name: 'Bar',
						},
					],
				},
			},
		};
		const actual = shallow(<ColumnsRenderer props={props} />);

		expect(actual).toMatchSnapshot();
	});

	it('should render name as deprecated when tag deprecated is present', () => {
		const props = {
			size: {
				type: {
					name: 'number',
				},
				required: false,
				description: 'Test description',
				tags: {
					deprecated: [
						{
							title: 'deprecated',
							description: 'Do not use.',
						},
					],
				},
			},
		};
		const actual = shallow(<ColumnsRenderer props={props} />);

		expect(actual).toMatchSnapshot();
	});
});

describe('unquote', () => {
	it('should remove double quotes around the string', () => {
		const result = unquote('"foo"');
		expect(result).toBe('foo');
	});

	it('should remove single quotes around the string', () => {
		const result = unquote("'foo'");
		expect(result).toBe('foo');
	});

	it('should not remove quotes in the middle of the string', () => {
		const result = unquote('foo"bar');
		expect(result).toBe('foo"bar');
	});
});

describe('getType', () => {
	it('should return .type or .flowType property', () => {
		const result = getType({
			type: 'foo',
			flowType: 'bar',
		});
		expect(result).toBe('bar');
	});
});

describe('showSpaces', () => {
	it('should replace leading and trailing spaces with a visible character', () => {
		const result = showSpaces(' pizza ');
		expect(result).toBe('␣pizza␣');
	});
});
