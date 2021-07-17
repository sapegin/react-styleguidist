import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Preview from 'rsg-components/Preview';
import Para from 'rsg-components/Para';
import Slot from 'rsg-components/Slot';
import PlaygroundRenderer from 'rsg-components/Playground/PlaygroundRenderer';
import Context from 'rsg-components/Context';
import { EXAMPLE_TAB_CODE_EDITOR } from '../slots';
import { getIsolatedUrl } from '../../utils/getUrl';
import { ExampleModes } from '../../consts';
import * as Rsg from '../../../typings';

const getIsolatedButtonUrl = ({
	isolated,
	hashPath,
	exampleIndex,
}: {
	isolated: boolean;
	hashPath: string[];
	exampleIndex?: number | string;
}) => {
	if (isolated) {
		return getIsolatedUrl(hashPath);
	} else {
		return getIsolatedUrl(hashPath, exampleIndex);
	}
};

interface PlaygroundProps {
	componentName: string;
	componentHashPath: string[];
	exampleMode: string;
	code: string;
	documentScope: Record<string, unknown>;
	exampleScope: Record<string, unknown>;
	modifiers: Rsg.Modifiers;
}

interface PlaygroundState {
	code: string;
	prevCode: string;
	activeTab?: string;
}

class Playground extends Component<PlaygroundProps, PlaygroundState> {
	public static propTypes = {
		componentName: PropTypes.string.isRequired,
		componentHashPath: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		exampleMode: PropTypes.string.isRequired,
		code: PropTypes.string.isRequired,
		documentScope: PropTypes.object.isRequired,
		exampleScope: PropTypes.object.isRequired,
		modifiers: PropTypes.object.isRequired,
	};

	public static contextType = Context;

	private handleChange = debounce((code) => {
		this.setState({
			code,
		});
	}, this.context.config.previewDelay);

	public state: PlaygroundState = {
		code: this.props.code,
		prevCode: this.props.code,
		activeTab: this.getInitialActiveTab() ? EXAMPLE_TAB_CODE_EDITOR : undefined,
	};

	public static getDerivedStateFromProps(nextProps: PlaygroundProps, prevState: PlaygroundState) {
		const { code } = nextProps;
		if (prevState.prevCode !== code) {
			return {
				prevCode: code,
				code,
			};
		}
		return null;
	}

	public componentWillUnmount() {
		// Clear pending changes
		this.handleChange.cancel();
	}

	private getInitialActiveTab(): boolean {
		const { showcode } = this.props.modifiers;
		const expandCode = this.props.exampleMode === ExampleModes.expand;
		return showcode !== undefined ? showcode : expandCode;
	}

	private handleTabChange = (name: string) => {
		this.setState((state) => ({
			activeTab: state.activeTab !== name ? name : undefined,
		}));
	};

	public render() {
		const { code, activeTab } = this.state;
		const {
			documentScope,
			exampleScope,
			componentName,
			componentHashPath,
			modifiers,
			exampleMode,
		} = this.props;
		const { isolated, exampleIndex } = this.context;
		const isExampleHidden = exampleMode === ExampleModes.hide;
		const isEditorHidden = modifiers.noeditor || isExampleHidden;
		const isolatedButton = isolated && exampleIndex !== undefined;

		const preview = (
			<Preview code={code} documentScope={documentScope} exampleScope={exampleScope} />
		);

		return isEditorHidden ? (
			<Para>{preview}</Para>
		) : (
			<PlaygroundRenderer
				componentName={componentName}
				exampleIndex={modifiers.index}
				padded={!!modifiers.padded}
				preview={preview}
				previewClassName={modifiers['preview-class']}
				tabButtons={
					<Slot
						name="exampleTabButtons"
						active={activeTab}
						props={{ onClick: this.handleTabChange }}
					/>
				}
				tabBody={
					<Slot
						name="exampleTabs"
						active={activeTab}
						onlyActive
						props={{ code, onChange: this.handleChange }}
					/>
				}
				toolbar={
					<Slot
						name="exampleToolbar"
						props={{
							name: componentName,
							href: getIsolatedButtonUrl({
								isolated: isolatedButton,
								hashPath: componentHashPath,
								exampleIndex: modifiers.index,
							}),
							exampleIndex: modifiers.index,
							isolated: isolatedButton,
						}}
					/>
				}
			/>
		);
	}
}

export default Playground;
