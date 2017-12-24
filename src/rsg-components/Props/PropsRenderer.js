import React from 'react';
import PropTypes from 'prop-types';
import Group from 'react-group';
import objectToString from 'javascript-stringify';
import Arguments from 'rsg-components/Arguments';
import Argument from 'rsg-components/Argument';
import Code from 'rsg-components/Code';
import JsDoc from 'rsg-components/JsDoc';
import Markdown from 'rsg-components/Markdown';
import Name from 'rsg-components/Name';
import Type from 'rsg-components/Type';
import Text from 'rsg-components/Text';
import Para from 'rsg-components/Para';
import Table from 'rsg-components/Table';
import ColorSwatch from 'rsg-components/ColorSwatch';
import map from 'lodash/map';
import { unquote, getType, showSpaces } from './util';

function renderType(type) {
	if (!type) {
		return 'unknown';
	}

	const { name } = type;

	switch (name) {
		case 'arrayOf':
			return `${type.value.name}[]`;
		case 'objectOf':
			return `{${renderType(type.value)}}`;
		case 'instanceOf':
			return type.value;
		default:
			return name;
	}
}

function renderEnum(prop) {
	if (!Array.isArray(getType(prop).value)) {
		return <span>{getType(prop).value}</span>;
	}

	const values = getType(prop).value.map(({ value }) => (
		<Code key={value}>{showSpaces(unquote(value))}</Code>
	));
	return (
		<span>
			One of:{' '}
			<Group separator=", " inline>
				{values}
			</Group>
		</span>
	);
}

function renderShape(props) {
	const rows = [];
	for (const name in props) {
		const prop = props[name];
		const defaultValue = renderDefault(prop);
		const description = prop.description;
		rows.push(
			<div key={name}>
				<Name>{name}</Name>
				{': '}
				<Type>{renderType(prop)}</Type>
				{defaultValue && ' — '}
				{defaultValue}
				{description && ' — '}
				{description && <Markdown text={description} inline />}
			</div>
		);
	}
	return rows;
}

const defaultColorKeys = ['backgroundColor', 'color'];
const defaultValueBlacklist = ['null', 'undefined'];

function renderDefault(prop) {
	if (prop.required) {
		return <Text>Required</Text>;
	} else if (prop.defaultValue) {
		if (prop.type) {
			const propName = prop.type.name;

			if (defaultValueBlacklist.indexOf(prop.defaultValue.value) > -1) {
				return <Code>{showSpaces(unquote(prop.defaultValue.value))}</Code>;
			} else if (propName === 'func') {
				return (
					<Text underlined title={showSpaces(unquote(prop.defaultValue.value))}>
						Function
					</Text>
				);
			} else if (propName === 'shape' || propName === 'object') {
				try {
					// We eval source code to be able to format the defaultProp here. This
					// can be considered safe, as it is the source code that is evaled,
					// which is from a known source and safe by default
					// eslint-disable-next-line no-eval
					const object = eval(`(${prop.defaultValue.value})`);
					return (
						<Text underlined title={objectToString(object, null, 2)}>
							Shape
						</Text>
					);
				} catch (e) {
					// eval will throw if it contains a reference to a property not in the
					// local scope. To avoid any breakage we fall back to rendering the
					// prop without any formatting
					return (
						<Text underlined title={prop.defaultValue.value}>
							Shape
						</Text>
					);
				}
			}
		}

		return (
			<Code>
				{showSpaces(unquote(prop.defaultValue.value))}
				{defaultColorKeys.indexOf(prop.name) > -1 ? <ColorSwatch color={unquote(prop.defaultValue.value)} margin="0 0 0 0.25rem" /> : null}
			</Code>
		);
	}

	return '';
}

function renderDescription(prop) {
console.log(prop)
	const { description, tags = {} } = prop;
	const extra = renderExtra(prop);
	const args = [...(tags.arg || []), ...(tags.argument || []), ...(tags.param || [])];
	const returnDocumentation = (tags.return && tags.return[0]) || (tags.returns && tags.returns[0]);

	return (
		<div>
			{description && <Markdown text={description} />}
			{extra && <Para>{extra}</Para>}
			<JsDoc {...tags} />
			{args.length > 0 && <Arguments args={args} heading />}
			{returnDocumentation && <Argument {...returnDocumentation} returns />}
		</div>
	);
}

function renderExtra(prop) {
	const type = getType(prop);

	if (!type) {
		return null;
	}
	switch (type.name) {
		case 'enum':
			return renderEnum(prop);
		case 'union':
			return renderUnion(prop);
		case 'shape':
			return renderShape(prop.type.value);
		case 'arrayOf':
			if (type.value.name === 'shape') {
				return renderShape(prop.type.value.value);
			}
			return null;
		case 'objectOf':
			if (type.value.name === 'shape') {
				return renderShape(prop.type.value.value);
			}
			return null;
		default:
			return null;
	}
}

function renderUnion(prop) {
	if (!Array.isArray(getType(prop).value)) {
		return <span>{getType(prop).value}</span>;
	}

	const values = getType(prop).value.map((value, index) => (
		<Type key={`${value.name}-${index}`}>{renderType(value)}</Type>
	));
	return (
		<span>
			One of type:{' '}
			<Group separator=", " inline>
				{values}
			</Group>
		</span>
	);
}

function renderName(prop) {
	const { name, tags = {} } = prop;
	return <Name deprecated={!!tags.deprecated}>{name}</Name>;
}

function renderTypeColumn(prop) {
	return <Type>{renderType(getType(prop))}</Type>;
}

export function getRowKey(row) {
	return row.name;
}

export function propsToArray(props) {
	return map(props, (prop, name) => ({ ...prop, name }));
}

export const columns = [
	{
		caption: 'Prop name',
		render: renderName,
	},
	{
		caption: 'Type',
		render: renderTypeColumn,
	},
	{
		caption: 'Default',
		render: renderDefault,
	},
	{
		caption: 'Description',
		render: renderDescription,
	},
];

export default function PropsRenderer({ props }) {
	return <Table columns={columns} rows={propsToArray(props)} getRowKey={getRowKey} />;
}

PropsRenderer.propTypes = {
	props: PropTypes.object.isRequired,
};
