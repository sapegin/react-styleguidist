import React from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import useTheme from '../../styles/useTheme';
import prismTheme from '../../styles/prismTheme';
import MdxHighlightPre from './MdxHighlightPre';

type Props = {
	children: string;
	className?: string;
};

export default function MdxHighlight({ children, className: codeClassName }: Props) {
	const theme = useTheme();

	if (!codeClassName) {
		return <MdxHighlightPre>{children}</MdxHighlightPre>;
	}

	// Mdx uses `language-js` class names, markdown-to-jsx — `lang-js`
	const language = codeClassName.replace(/lang(uage)?-/, '') as Language;

	return (
		<Highlight {...defaultProps} theme={prismTheme(theme)} code={children} language={language}>
			{({ className, style, tokens, getLineProps, getTokenProps }) => (
				<MdxHighlightPre className={className} style={style}>
					{tokens.map((line, index) => (
						<div key={index} {...getLineProps({ line, key: index })}>
							{line.map((token, key) => (
								<span key={key} {...getTokenProps({ token, key })} />
							))}
						</div>
					))}
				</MdxHighlightPre>
			)}
		</Highlight>
	);
}
