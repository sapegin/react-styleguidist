import React, { Component, PropTypes } from 'react';
import Markdown from 'rsg-components/Markdown';
import Props from 'rsg-components/Props';
import Playground from 'rsg-components/Playground';

class ReactComponent extends Component {
	static propTypes = {
		highlightTheme: PropTypes.string.isRequired,
		component: PropTypes.object.isRequired,
		renderer: PropTypes.func.isRequired
	};

	renderDescription(description) {
		if (!description) {
			return null;
		}

		return (<Markdown text={description}/>);
	}

	renderProps(props) {
		if (!props.props) {
			return null;
		}

		return (
			<Props props={props}/>
		);
	}

	renderExamples(highlightTheme, examples) {
		if (!examples) {
			return null;
		}

		return examples.map((example, index) => {
			switch (example.type) {
				case 'code':
					return (
						<Playground
							code={example.content}
							evalInContext={example.evalInContext}
							highlightTheme={highlightTheme}
							key={index}
						/>
					);
				case 'markdown':
					return (
						<Markdown
							text={example.content}
							key={index}
						/>
					);
			}
		});
	}

	render() {
		const {highlightTheme, component} = this.props;

		return this.props.renderer({
			name: component.name,
			pathLine: component.pathLine,
			description: this.renderDescription(component.props.description),
			propList: this.renderProps(component.props),
			examples: this.renderExamples(highlightTheme, component.examples),
			visible: component.visible
		});
	}
};

export default ReactComponent;
