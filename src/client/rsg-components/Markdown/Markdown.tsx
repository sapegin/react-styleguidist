import React, { FC, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { compiler } from 'markdown-to-jsx';
import Link from 'rsg-components/Link';
import Text from 'rsg-components/Text';
import Para from 'rsg-components/Para';
import Code from 'rsg-components/Code';
import MdxBlockquote from 'rsg-components/mdx/MdxBlockquote';
import MdxCodeStatic from 'rsg-components/mdx/MdxCodeStatic';
import MdxHeading from 'rsg-components/mdx/MdxHeading';
import MdxHighlight from 'rsg-components/mdx/MdxHighlight';
import MdxHr from 'rsg-components/mdx/MdxHr';
import MdxList from 'rsg-components/mdx/MdxList';
import MdxPre from 'rsg-components/mdx/MdxPre';
import MdxTable from 'rsg-components/mdx/MdxTable';
import MdxTableBody from 'rsg-components/mdx/MdxTableBody';
import MdxTableCell from 'rsg-components/mdx/MdxTableCell';
import MdxTableHead from 'rsg-components/mdx/MdxTableHead';
import MdxTableRow from 'rsg-components/mdx/MdxTableRow';

// HACK: markdown-to-jsx doesn't destinguish between inline and block code blocks,
// so we highlight syntax in the <pre> tag and assume <code> is always inline.
const Pre: FC = (props) => {
	if (isValidElement(props.children)) {
		return (
			<MdxPre>
				<MdxCodeStatic>
					<MdxHighlight {...props.children.props} />
				</MdxCodeStatic>
			</MdxPre>
		);
	}

	return <MdxPre {...props} />;
};
Pre.propTypes = {
	children: PropTypes.node,
};

export const overrides = {
	a: {
		component: Link,
	},
	h1: {
		component: MdxHeading,
		props: {
			level: 1,
		},
	},
	h2: {
		component: MdxHeading,
		props: {
			level: 2,
		},
	},
	h3: {
		component: MdxHeading,
		props: {
			level: 3,
		},
	},
	h4: {
		component: MdxHeading,
		props: {
			level: 4,
		},
	},
	h5: {
		component: MdxHeading,
		props: {
			level: 5,
		},
	},
	h6: {
		component: MdxHeading,
		props: {
			level: 6,
		},
	},
	p: {
		component: Para,
		props: {
			semantic: 'p',
		},
	},
	em: {
		component: Text,
		props: {
			semantic: 'em',
		},
	},
	strong: {
		component: Text,
		props: {
			semantic: 'strong',
		},
	},
	ul: {
		component: MdxList,
	},
	ol: {
		component: MdxList,
		props: {
			ordered: true,
		},
	},
	blockquote: {
		component: MdxBlockquote,
	},
	code: {
		component: Code,
	},
	pre: {
		component: Pre,
	},
	hr: {
		component: MdxHr,
	},
	table: {
		component: MdxTable,
	},
	thead: {
		component: MdxTableHead,
	},
	th: {
		component: MdxTableCell,
		props: {
			header: true,
		},
	},
	tbody: {
		component: MdxTableBody,
	},
	tr: {
		component: MdxTableRow,
	},
	td: {
		component: MdxTableCell,
	},
} as const;

interface MarkdownProps {
	text: string;
	inline?: boolean;
}

export const Markdown: React.FunctionComponent<MarkdownProps> = ({ text, inline }) => {
	return compiler(text, {
		overrides,
		forceBlock: !inline,
		forceWrapper: inline,
		wrapper: inline ? 'span' : 'div',
	});
};

Markdown.propTypes = {
	text: PropTypes.string.isRequired,
	inline: PropTypes.bool,
};

export default Markdown;
