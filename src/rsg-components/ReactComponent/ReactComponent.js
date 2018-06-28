import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Examples from 'rsg-components/Examples';
import SectionHeading from 'rsg-components/SectionHeading';
import JsDoc from 'rsg-components/JsDoc';
import Markdown from 'rsg-components/Markdown';
import Slot from 'rsg-components/Slot';
import ReactComponentRenderer from 'rsg-components/ReactComponent/ReactComponentRenderer';
import { DOCS_TAB_USAGE } from '../slots';
import { DisplayModes, UsageModes } from '../../consts';

const ExamplePlaceholder =
	process.env.STYLEGUIDIST_ENV !== 'production'
		? require('rsg-components/ExamplePlaceholder').default
		: () => <div />;

export default class ReactComponent extends Component {
	static propTypes = {
		component: PropTypes.object.isRequired,
		depth: PropTypes.number.isRequired,
		codeSamples: PropTypes.string.isRequired,
		propsMethods: PropTypes.string.isRequired,
	};
	static contextTypes = {
		config: PropTypes.object.isRequired,
		displayMode: PropTypes.string,
	};

	constructor(props, context) {
		super(props, context);
		const { propsMethods } = props;

		this.handleTabChange = this.handleTabChange.bind(this);

		this.state = {
			activeTab: propsMethods === UsageModes.expand ? DOCS_TAB_USAGE : undefined,
		};
	}

	handleTabChange(name) {
		this.setState(state => ({
			activeTab: state.activeTab !== name ? name : undefined,
		}));
	}

	render() {
		const { activeTab } = this.state;
		const { displayMode } = this.context;
		const { component, depth, propsMethods, codeSamples } = this.props;
		const { name, slug, filepath, pathLine } = component;
		const { description, examples = [], tags = {} } = component.props;
		if (!name) {
			return null;
		}
		const showUsage = propsMethods !== UsageModes.hide;

		return (
			<ReactComponentRenderer
				name={name}
				slug={slug}
				filepath={filepath}
				pathLine={pathLine}
				docs={<JsDoc {...tags} />}
				description={description && <Markdown text={description} />}
				heading={
					<SectionHeading
						id={slug}
						deprecated={!!tags.deprecated}
						slotName="componentToolbar"
						slotProps={{
							...component,
							isolated: displayMode !== DisplayModes.all,
						}}
						depth={depth}
					>
						{name}
					</SectionHeading>
				}
				examples={
					examples.length > 0 ? (
						<Examples examples={examples} name={name} codeSamples={codeSamples} />
					) : (
						<ExamplePlaceholder name={name} />
					)
				}
				tabButtons={
					showUsage && (
						<Slot
							name="docsTabButtons"
							active={activeTab}
							props={{ ...component, onClick: this.handleTabChange }}
						/>
					)
				}
				tabBody={<Slot name="docsTabs" active={activeTab} onlyActive props={component} />}
			/>
		);
	}
}
