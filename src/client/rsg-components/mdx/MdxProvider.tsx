import React, { ComponentProps, ReactNode } from 'react';
import { MDXProvider as MDXProviderBase } from '@mdx-js/react';
import Link from 'rsg-components/Link';
import Text from 'rsg-components/Text';
import Para from 'rsg-components/Para';
import MdxCode from 'rsg-components/mdx/MdxCode';
import MdxPre from 'rsg-components/mdx/MdxPre';
import MdxWrapper from 'rsg-components/mdx/MdxWrapper';
import MdxHeading from 'rsg-components/mdx/MdxHeading';
import MdxList from 'rsg-components/mdx/MdxList';
import MdxBlockquote from 'rsg-components/mdx/MdxBlockquote';
import MdxHr from 'rsg-components/mdx/MdxHr';
import MdxTable from 'rsg-components/mdx/MdxTable';
import MdxTableHead from 'rsg-components/mdx/MdxTableHead';
import MdxTableBody from 'rsg-components/mdx/MdxTableBody';
import MdxTableRow from 'rsg-components/mdx/MdxTableRow';
import MdxTableCell from 'rsg-components/mdx/MdxTableCell';

// TODO: Allow components customization via style guide config

const DEFAULT_COMPONENTS = {
	wrapper: MdxWrapper,
	a: Link,
	h1: (props: Omit<ComponentProps<typeof MdxHeading>, 'level'>) => (
		<MdxHeading level={1} {...props} />
	),
	h2: (props: Omit<ComponentProps<typeof MdxHeading>, 'level'>) => (
		<MdxHeading level={2} {...props} />
	),
	h3: (props: Omit<ComponentProps<typeof MdxHeading>, 'level'>) => (
		<MdxHeading level={3} {...props} />
	),
	h4: (props: Omit<ComponentProps<typeof MdxHeading>, 'level'>) => (
		<MdxHeading level={4} {...props} />
	),
	h5: (props: Omit<ComponentProps<typeof MdxHeading>, 'level'>) => (
		<MdxHeading level={5} {...props} />
	),
	h6: (props: Omit<ComponentProps<typeof MdxHeading>, 'level'>) => (
		<MdxHeading level={6} {...props} />
	),
	p: (props: Omit<ComponentProps<typeof Para>, 'semantic'>) => <Para semantic="p" {...props} />,
	em: (props: Omit<ComponentProps<typeof Text>, 'semantic'>) => <Text semantic="em" {...props} />,
	strong: (props: Omit<ComponentProps<typeof Text>, 'semantic'>) => (
		<Text semantic="strong" {...props} />
	),
	ul: MdxList,
	ol: (props: Omit<ComponentProps<typeof MdxList>, 'ordered'>) => <MdxList ordered {...props} />,
	blockquote: MdxBlockquote,
	code: MdxCode,
	pre: MdxPre,
	hr: MdxHr,
	table: MdxTable,
	thead: MdxTableHead,
	tbody: MdxTableBody,
	tr: MdxTableRow,
	td: MdxTableCell,
	th: (props: Omit<ComponentProps<typeof MdxTableCell>, 'header'>) => (
		<MdxTableCell header {...props} />
	),
};

type Props = {
	children: ReactNode;
};

export default function MdxProvider({ children }: Props) {
	return <MDXProviderBase components={DEFAULT_COMPONENTS}>{children}</MDXProviderBase>;
}
