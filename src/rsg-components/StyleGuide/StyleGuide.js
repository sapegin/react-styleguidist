import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableOfContents from 'rsg-components/TableOfContents';
import StyleGuideRenderer from 'rsg-components/StyleGuide/StyleGuideRenderer';
import Sections from 'rsg-components/Sections';
import Welcome from 'rsg-components/Welcome';
import Error from 'rsg-components/Error';
import { HOMEPAGE } from '../../../scripts/consts';

export default class StyleGuide extends Component {
	static propTypes = {
		codeRevision: PropTypes.number.isRequired,
		config: PropTypes.object.isRequired,
		slots: PropTypes.object.isRequired,
		sections: PropTypes.array.isRequired,
		welcomeScreen: PropTypes.bool,
		patterns: PropTypes.array,
		isolatedComponent: PropTypes.bool,
		isolatedExample: PropTypes.bool,
		isolatedSection: PropTypes.bool,
	};

	static childContextTypes = {
		codeRevision: PropTypes.number.isRequired,
		config: PropTypes.object.isRequired,
		slots: PropTypes.object.isRequired,
		isolatedComponent: PropTypes.bool,
		isolatedExample: PropTypes.bool,
		isolatedSection: PropTypes.bool,
	};

	static defaultProps = {
		isolatedComponent: false,
	};

	state = {
		error: false,
		info: null,
	};

	getChildContext() {
		return {
			codeRevision: this.props.codeRevision,
			config: this.props.config,
			slots: this.props.slots,
			isolatedComponent: this.props.isolatedComponent,
			isolatedExample: this.props.isolatedExample,
			isolatedSection: this.props.isolatedSection,
		};
	}

	componentDidCatch(error, info) {
		this.setState({
			error,
			info,
		});
	}

	render() {
		const { config, sections, welcomeScreen, patterns, isolatedComponent } = this.props;

		if (this.state.error) {
			return <Error error={this.state.error} info={this.state.info} />;
		}

		if (welcomeScreen) {
			return <Welcome patterns={patterns} />;
		}

		return (
			<StyleGuideRenderer
				title={config.title}
				homepageUrl={HOMEPAGE}
				toc={<TableOfContents sections={sections} />}
				hasSidebar={config.showSidebar && !isolatedComponent}
				ribbon={config.ribbon}
			>
				<Sections sections={sections} depth={1} />
			</StyleGuideRenderer>
		);
	}
}
