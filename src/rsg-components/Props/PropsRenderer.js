import React, { PropTypes } from 'react';
import Code from 'rsg-components/Code';
import Markdown from 'rsg-components/Markdown';
import Group from 'react-group';
import { unquote, getType, showSpaces } from './util';

import s from './Props.css';

function renderRows(props) {
	let rows = [];
	for (let name in props) {
		let prop = props[name];
		rows.push(
			<tr key={name}>
				<td className={s.cell}><Code className={s.name}>{name}</Code></td>
				<td className={s.cell}><Code className={s.type}>{renderType(getType(prop))}</Code></td>
				<td className={s.cell}>{renderDefault(prop)}</td>
				<td className={s.cell + ' ' + s.cellDesc}>{renderDescription(prop)}</td>
			</tr>
		);
	}
	return rows;
}

function renderType(type) {
	if (!type) {
		return 'unknown';
	}

	let { name } = type;

	switch (name) {
		case 'arrayOf':
			return `${type.value.name}[]`;
		case 'instanceOf':
			return type.value;
		default:
			return name;
	}
}

function renderDefault(prop) {
	if (prop.required) {
		return (
			<span className={s.required}>Required</span>
		);
	}
	else if (prop.defaultValue) {
		return (
			<Code>{showSpaces(unquote(prop.defaultValue.value))}</Code>
		);
	}
	return '';
}

function renderDescription(prop) {
	let { description } = prop;
	let extra = renderExtra(prop);
	return (
		<Group>
			{description && <Markdown text={description} inline />}
			{extra}
		</Group>
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
		default:
			return null;
	}
}

function renderEnum(prop) {
	if (!Array.isArray(getType(prop).value)) {
		return <span>{getType(prop).value}</span>;
	}
	let values = getType(prop).value.map(({ value }) => (
		<Code>{showSpaces(unquote(value))}</Code>
	));

	return (
		<span>One of: <Group separator=", " inline>{values}</Group></span>
	);
}

function renderUnion(prop) {
	if (!Array.isArray(getType(prop).value)) {
		return <span>{getType(prop).value}</span>;
	}
	let values = getType(prop).value.map((value) => (
		<Code className={s.type}>{renderType(value)}</Code>
	));

	return (
		<span>One of type: <Group seperator=", " inline>{values}</Group></span>
	);
}

function renderShape(props) {
	let rows = [];
	for (let name in props) {
		let prop = props[name];
		let defaultValue = renderDefault(prop);
		let description = prop.description;
		rows.push(
			<div key={name}>
				<Code className={s.name}>{name}</Code>{': '}
				<Code className={s.type}>{renderType(prop)}</Code>
				{defaultValue && ' — '}{defaultValue}
				{description && ' — '}
				{description && <Markdown text={description} inline />}
			</div>
		);
	}
	return rows;
}

export default function PropsRenderer({ props }) {
	return (
		<table className={s.table}>
			<thead className={s.tableHead}>
				<tr>
					<th className={s.cellHeading}>Name</th>
					<th className={s.cellHeading}>Type</th>
					<th className={s.cellHeading}>Default</th>
					<th className={s.cellHeading + ' ' + s.cellDesc}>Description</th>
				</tr>
			</thead>
			<tbody className={s.tableBody}>
				{renderRows(props)}
			</tbody>
		</table>
	);
}

PropsRenderer.propTypes = {
	props: PropTypes.object.isRequired,
};
