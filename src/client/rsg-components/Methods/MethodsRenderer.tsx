import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'rsg-components/Markdown';
import Argument from 'rsg-components/Argument';
import Arguments from 'rsg-components/Arguments';
import Name from 'rsg-components/Name';
import JsDoc from 'rsg-components/JsDoc';
import Table from 'rsg-components/Table';
import { MethodDescriptor } from 'react-docgen';

const getRowKey = (row: MethodDescriptor): string => row.name;

export const columns = [
	{
		caption: 'Method name',
		// eslint-disable-next-line react/prop-types
		render: ({ name, tags = {} }: MethodDescriptor) => (
			<Name deprecated={!!tags.deprecated}>{`${name}()`}</Name>
		),
	},
	{
		caption: 'Parameters',
		// eslint-disable-next-line react/prop-types
		render: ({ params = [] }: MethodDescriptor) => <Arguments args={params} />,
	},
	{
		caption: 'Description',
		// eslint-disable-next-line react/prop-types
		render: ({ description, returns, tags = {} }: MethodDescriptor) => (
			<div>
				{description && <Markdown text={description} />}
				{returns && <Argument block returns {...returns} />}
				<JsDoc {...tags} />
			</div>
		),
	},
];

const MethodsRenderer: React.FunctionComponent<{ methods: MethodDescriptor[] }> = ({ methods }) => (
	<Table columns={columns} rows={methods} getRowKey={getRowKey} />
);

MethodsRenderer.propTypes = {
	methods: PropTypes.array.isRequired,
};

export default MethodsRenderer;
