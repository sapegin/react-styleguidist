import { Component, PropTypes } from 'react';
import Components from 'rsg-components/Components';
import TableOfContents from 'rsg-components/TableOfContents';
import Renderer from './Renderer';

import s from './Layout.css';

import isEmpty from 'lodash/isEmpty';

class Layout extends Component {
	static propTypes = {
		config: PropTypes.object.isRequired,
		components: PropTypes.array.isRequired,
		sections: PropTypes.array.isRequired,
		onSearchChange: PropTypes.func.isRequired,
		onItemFocus: PropTypes.func.isRequired,
		filter: PropTypes.string.isRequired
	};

	renderComponents(config, components, sections) {
		if (!isEmpty(components) || !isEmpty(sections)) {
			return (
				<Components highlightTheme={config.highlightTheme} components={components} sections={sections} />
			);
		}
		else {
			return (
				<div className={s.empty}>
					No components found. <a className={s.link} href="https://github.com/sapegin/react-styleguidist#configuration">Check
					the components option</a> in your style guide config.
				</div>
			);
		}
	}

	renderTableOfContents(components, sections) {
		return (
			<TableOfContents
				components={components}
				sections={sections}
				onInputChange={this.props.onSearchChange}
				onItemDoubleClick={this.props.onItemFocus}
				filter={this.props.filter}
			/>
		);
	}

	render() {
		let { config, components, sections } = this.props;

		return (
			<Renderer
				title={config.title}
				components={this.renderComponents(config, components, sections)}
				sections={this.props.sections}
				toc={this.renderTableOfContents(components, sections)}
			/>
		);
	}
};

export default Layout;
