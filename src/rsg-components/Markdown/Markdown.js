import { PropTypes } from 'react';
import mapValues from 'lodash/mapValues';
import Styled from 'rsg-components/Styled';
import { styles as linkStyles } from 'rsg-components/Link';
import renderMarkdown from '../../utils/markdown-to-jsx';

const styles = ({ font, monospace, link, linkHover, border, codeBackground }) => ({
	base: {
		fontFamily: font,
		fontSize: 'inherit',
	},
	para: {
		fontFamily: font,
		fontSize: 'inherit',
		marginBottom: 15,
	},
	a: linkStyles({ link, linkHover }).link,
	h3: {
		composes: '$para',
		fontSize: 26,
		fontWeight: 'normal',
	},
	h4: {
		composes: '$para',
		fontSize: 23,
		fontWeight: 'normal',
	},
	h5: {
		composes: '$para',
		fontSize: 16,
		fontWeight: 'normal',
	},
	h6: {
		composes: '$para',
		fontSize: 16,
		fontWeight: 'normal',
		fontStyle: 'italic',
	},
	p: {
		composes: '$para',
	},
	ul: {
		composes: '$para',
	},
	ol: {
		composes: '$para',
	},
	blockquote: {
		composes: '$para',
		fontSize: 13,
		margin: [[0, 50]],
		padding: 0,
	},
	hr: {
		composes: '$para',
		borderWidth: '0 0 1px 0',
		borderColor: border,
		borderStyle: 'solid',
	},
	code: {
		display: 'inline',
		fontFamily: monospace,
		fontSize: 'inherit',
		color: 'inherit',
		background: 'transparent',
	},
	pre: {
		backgroundColor: codeBackground,
		border: [[1, border, 'solid']],
		padding: [[12, 15]],
		borderRadius: 3,
		'& code': {
			fontFamily: monospace,
			fontSize: 12,
			color: 'inherit',
			background: 'transparent',
		},
	},
	table: {
		composes: '$para',
		borderCollapse: 'collapse',
	},
	thead: {
		composes: '$hr',
	},
	td: {
		paddingRight: 15,
		paddingTop: 6,
		fontSize: 13,
	},
	th: {
		paddingRight: 15,
		paddingBottom: 6,
		textAlign: 'left',
		fontSize: 13,
	},
	em: {},
	strong: {},
	img: {},
	li: {},
	tr: {},
	tbody: {},
});

function Markdown({
	classes,
	text,
	inline,
}) {
	// Custom CSS classes for each tag: <em> → <em className={s.em}>.
	const overrides = mapValues(classes, value => ({
		props: {
			className: value,
		},
	}));

	// Inline mode: replace <p> (usual root component) with <span>
	const overridesInline = {
		...overrides,
		p: {
			component: 'span',
			props: {
				className: classes.base,
			},
		},
	};

	const options = { overrides: inline ? overridesInline : overrides };
	return renderMarkdown(text, options);
}

Markdown.propTypes = {
	classes: PropTypes.object.isRequired,
	text: PropTypes.string.isRequired,
	inline: PropTypes.bool,
};

export default Styled(styles)(Markdown);
