import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import PlaygroundError from 'rsg-components/PlaygroundError';
import ReactExample from 'rsg-components/ReactExample';
import Context from 'rsg-components/Context';

interface PreviewProps {
	code: string;
	documentScope: Record<string, unknown>;
	exampleScope: Record<string, unknown>;
}

interface PreviewState {
	error: string | null;
}

const cleanErrorMessage = (message: string): string =>
	message.replace('bound evalInContext(Example)(...): ', '');

export default class Preview extends Component<PreviewProps, PreviewState> {
	public static propTypes = {
		code: PropTypes.string.isRequired,
		documentScope: PropTypes.object.isRequired,
		exampleScope: PropTypes.object.isRequired,
	};

	// TODO: How to type it?
	public static contextType = Context;

	private mountNode: Element | null = null;

	public state: PreviewState = {
		error: null,
	};

	public componentDidMount() {
		// Clear console after hot reload, do not clear on the first load
		// to keep any warnings
		if (this.context.codeRevision > 0) {
			// eslint-disable-next-line no-console
			console.clear();
		}

		this.executeCode();
	}

	public shouldComponentUpdate(nextProps: PreviewProps, nextState: PreviewState) {
		return this.state.error !== nextState.error || this.props.code !== nextProps.code;
	}

	public componentDidUpdate(prevProps: PreviewProps) {
		if (this.props.code !== prevProps.code) {
			this.executeCode();
		}
	}

	public componentWillUnmount() {
		this.unmountPreview();
	}

	public unmountPreview() {
		if (this.mountNode) {
			ReactDOM.unmountComponentAtNode(this.mountNode);
		}
	}

	private executeCode() {
		this.setState({
			error: null,
		});

		const { code, documentScope, exampleScope } = this.props;
		if (!code) {
			return;
		}

		const exampleApp = (
			<ReactExample
				code={code}
				documentScope={documentScope}
				exampleScope={exampleScope}
				compileExample={this.context.config.compileExample}
				onError={this.handleError}
			/>
		);

		window.requestAnimationFrame(() => {
			// this.unmountPreview();
			try {
				ReactDOM.render(exampleApp, this.mountNode);
			} catch (err) {
				this.handleError(err);
			}
		});
	}

	private handleError = (err: Error) => {
		this.unmountPreview();

		this.setState({
			error: cleanErrorMessage(err.toString()),
		});

		console.error(err); // eslint-disable-line no-console
	};

	public render() {
		const { error } = this.state;
		return (
			<>
				<div data-testid="mountNode" ref={(ref) => (this.mountNode = ref)} />
				{error && <PlaygroundError message={error} />}
			</>
		);
	}
}
