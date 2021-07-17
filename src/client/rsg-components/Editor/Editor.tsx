import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import SimpleEditor from 'react-simple-code-editor';
import MdxHighlight from 'rsg-components/mdx/MdxHighlight';
import * as Rsg from '../../../typings';

const highlight = (code: string) => <MdxHighlight className="language-jsx">{code}</MdxHighlight>;

const styles = ({ space, fontFamily, fontSize, color, borderRadius }: Rsg.Theme) => ({
	root: {
		// Use `important` to override inline styles in react-simple-code-editor
		padding: `${space[2]}px !important`,
		fontFamily: fontFamily.monospace,
		fontSize: fontSize.small,
		background: color.codeBackground,
		borderRadius,
		lineHeight: 1.5,
		tabSize: 2,
		'& textarea': {
			padding: 'inherit !important',
			isolate: false,
			transition: 'all ease-in-out .1s',
			border: `1px ${color.border} solid !important`,
			borderRadius,
		},
		'& textarea:focus': {
			isolate: false,
			outline: 0,
			borderColor: `${color.link} !important`,
			boxShadow: [[0, 0, 0, 2, color.focus]],
		},
	},
});

export interface EditorProps extends JssInjectedProps {
	code: string;
	onChange: (code: string) => void;
}

interface EditorState {
	code: string;
	prevCode: string;
}

export class Editor extends Component<EditorProps> {
	public static propTypes = {
		code: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
		classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	};

	public state = { code: this.props.code, prevCode: this.props.code };

	public static getDerivedStateFromProps(nextProps: EditorProps, prevState: EditorState) {
		const { code } = nextProps;
		if (prevState.prevCode !== code) {
			return {
				prevCode: code,
				code,
			};
		}
		return null;
	}

	public shouldComponentUpdate(nextProps: EditorProps, nextState: EditorState) {
		return nextState.code !== this.state.code;
	}

	private handleChange = (code: string) => {
		this.setState({ code });
		this.props.onChange(code);
	};

	public render() {
		return (
			<SimpleEditor
				className={this.props.classes.root}
				value={this.state.code}
				onValueChange={this.handleChange}
				highlight={highlight}
			/>
		);
	}
}

export default Styled<EditorProps>(styles)(Editor);
